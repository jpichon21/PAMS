<?php

namespace App\Controller\Admin;

use App\Entity\PamsCode;
use App\Form\PamsCodeType;
use App\Repository\PamsCodeRepository;
use App\Service\PamsCodeService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class PamsCodeController extends AbstractController
{
    /**
     * @Route("/admin/pamscode", name="admin_pams_code_index", methods={"GET"})
     */
    public function index(PamsCodeRepository $pamsCodeRepository): Response
    {
        return $this->render('admin/pams_code/index.html.twig', [

        ]);
    }

    /**
     * @Route("/admin/pamscode/datatable", name="admin_pams_code_datatable", methods={"POST"}, options={"expose"=true})
     * @param Request $request
     * @param PamsCodeRepository $pamsCodeRepository
     * @return Response
     */
    public function datatable(Request $request, PamsCodeRepository $pamsCodeRepository): Response
    {

        $jsonReturn = [];
        $draw = intval($request->request->get('draw'));
        $start = $request->request->get('start');
        $length = $request->request->get('length');
        $search = $request->request->get('search');
        $orders = $request->request->get('order');
        $columns = $request->request->get('columns');

        // Orders
        foreach ($orders as $key => $order) {
            // Orders does not contain the name of the column, but its number,
            // so add the name so we can handle it just like the $columns array
            $orders[$key]['name'] = $columns[$order['column']]['name'];
        }

        // Get results from the Repository
        $results = $pamsCodeRepository->getRequiredDTData($start, $length, $orders, $search, $columns);

        // Returned objects are of type Town
        $objects = $results["results"];
        // Get total number of objects
        $total_objects_count = $pamsCodeRepository->countPams();
        // Get total number of results
        $selected_objects_count = count($objects);
        // Get total number of filtered data
        $filtered_objects_count = $results["countResult"];

        $jsonReturn['draw'] = $draw;
        $jsonReturn['recordsTotal'] = $total_objects_count;
        $jsonReturn['recordsFiltered'] = $filtered_objects_count;
        $jsonReturn['data'] = [];

        $i = 0;

        foreach ($objects as $key => $pamsCode) {
            /* @var $pamsCode PamsCode */
            $jsonReturn['data'][$i] = [];

            $j = 0;
            foreach ($columns as $key2 => $column) {

                $responseTemp = '-';

                switch ($column['name']) {
                    case 'id':
                        {
                            $id = $pamsCode->getId();

                            $responseTemp = $id;
                            break;
                        }

                    case 'createur':
                        {
                            $createur = $pamsCode->getCreateurCode();

                            $responseTemp = $createur;
                            break;
                        }

                    case 'destinataire':
                        {
                            $destinataire = $pamsCode->getDestinataireCode();

                            $responseTemp = $destinataire;
                            break;
                        }

                    case 'online':
                        {
                            $online = $pamsCode->getPremiereConnexion();
                            $responseTemp = $online === null ? '' : $online->format('d/m/Y');

                            break;
                        }

                    case 'view':
                        {
                            $url = $this->generateUrl('pams_code_show', ['id' => $pamsCode->getId()]);
                            $view = '<a href="'.$url.'"><button class="btn btn-outline-primary">View</button></a>';

                            $responseTemp = $view;
                            break;
                        }

                    case 'action':
                        {
                            $url = $this->generateUrl('admin_pams_code_delete', ['id' => $pamsCode->getId()]);

                            $csrf = $this->container->get('security.csrf.token_manager');
                            $token = $csrf->getToken('delete'.$pamsCode->getId());

                            $action = '<form method="post" action="'.$url.'" style="display: inline-block" onsubmit="return confirm(\'Êtes vous vraiment sûr ?\')">
                                            <input type="hidden" name="_method" value="DELETE">
                                            <input type="hidden" name="_token" value="'.$token.'">
                                            <button class="btn btn-outline-danger">Supprimer</button>
                                        </form>';

                            $responseTemp = $action;
                            break;
                        }

                }

                $jsonReturn['data'][$i][$j] = $responseTemp;
                $j++;
            }

            $i++;

        }

        return new Response(json_encode($jsonReturn));
    }


    /**
     * @Route("/admin/pamscode/new", name="admin_pams_code_new", methods={"GET","POST"})
     * @param Request $request
     * @param PamsCodeService $pamsCodeService
     * @return Response
     */
    public function new(Request $request, PamsCodeService $pamsCodeService): Response
    {
        $pamsCode = new PamsCode();
        $codes = $pamsCodeService->generateValidCode();
        $pamsCode->setCreateurCode($codes[0]);
        $pamsCode->setDestinataireCode($codes[1]);
        $pamsCode->setNotifLecture(false);
        $pamsCode->setHash($pamsCodeService->generateHash($codes[0], $codes[1]));
        $form = $this->createForm(PamsCodeType::class, $pamsCode);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($pamsCode);
            $entityManager->flush();

            return $this->redirectToRoute('admin_pams_code_index');
        }

        return $this->render('admin/pams_code/new.html.twig', [
            'pams_code' => $pamsCode,
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/admin/pamscode/import", name="admin_pams_code_import", methods={"GET","POST"})
     * @param Request $request
     * @param PamsCodeService $pamsCodeService
     * @return Response
     */
    public function import(Request $request, PamsCodeService $pamsCodeService, PamsCodeRepository $pamsCodeRepository): Response
    {

        $erreur = [];
        if ($request->files->get('file') !== null) {
            set_time_limit(0);
            ini_set('memory_limit', '2048M');

            $row = 1;
            if (($handle = fopen($request->files->get('file')->getRealPath(), "r")) !== FALSE) {
                while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                    if ($row > 1) {
                        $codeCreateur =  str_replace(' ', '', $data[1]);
                        $codeDestinataire =  str_replace(' ', '', $data[2]);

                        //On verifie qu'il n'y a pas doublon
                        //Ce n'est pas optimisé mais c'est du one shot
                        if ($pamsCodeService->checkCodeExist($codeCreateur)) {
                            $erreur[] = 'Code ' . $codeCreateur . ' déjà existant';
                        } else {
                            if ($pamsCodeService->checkCodeExist($codeDestinataire)) {
                                $erreur[] = 'Code ' . $codeDestinataire . ' déjà existant';
                            } else {
                                $pamsCode = new PamsCode();
                                $pamsCode->setCreateurCode($codeCreateur);
                                $pamsCode->setDestinataireCode($codeDestinataire);
                                $pamsCode->setNotifLecture(false);
                                $pamsCode->setHash($pamsCodeService->generateHash($codeCreateur, $codeDestinataire));
                                $this->getDoctrine()->getManager()->persist($pamsCode);
                                $this->getDoctrine()->getManager()->flush();
                                $this->getDoctrine()->getManager()->clear();
                            }
                        }

                    }
                    $row++;
                }
                fclose($handle);
            }
        }

        return $this->render('admin/pams_code/import.html.twig', ['erreurs' => $erreur]);
    }

    /**
     * @Route("/admin/pamscode/{id}", name="pams_code_show", methods={"GET"})
     */
    public function show(PamsCode $pamsCode): Response
    {
        return $this->render('admin/pams_code/show.html.twig', [
            'pams_code' => $pamsCode,
        ]);
    }

    /**
     * @Route("/admin/pamscode/{id}", name="admin_pams_code_delete", methods={"DELETE"})
     */
    public function delete(Request $request, PamsCode $pamsCode): Response
    {
        if ($this->isCsrfTokenValid('delete' . $pamsCode->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($pamsCode);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_pams_code_index');
    }
}

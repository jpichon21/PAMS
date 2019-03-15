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

class PamsCodeController extends AbstractController
{
    /**
     * @Route("/admin/pamscode", name="admin_pams_code_index", methods={"GET"})
     */
    public function index(PamsCodeRepository $pamsCodeRepository): Response
    {
        return $this->render('admin/pams_code/index.html.twig', [
            'pams_codes' => $pamsCodeRepository->findAll(),
        ]);
    }

    /**
     * @Route("/admin/pamscode/new", name="admin_pams_code_new", methods={"GET","POST"})
     */
    public function new(Request $request, PamsCodeService $pamsCodeService): Response
    {
        $pamsCode = new PamsCode();
        $codes = $pamsCodeService->generateValidCode();
        $pamsCode->setCreateurCode($codes[0]);
        $pamsCode->setDestinataireCode($codes[1]);
        $pamsCode->setNotifLecture(false);
        $pamsCode->setHash($this->pamsCodeService->generateHash($codes[0],$codes[1]));
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
        if ($this->isCsrfTokenValid('delete'.$pamsCode->getId(), $request->request->get('_token'))) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($pamsCode);
            $entityManager->flush();
        }

        return $this->redirectToRoute('admin_pams_code_index');
    }
}

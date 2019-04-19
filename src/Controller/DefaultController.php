<?php

namespace App\Controller;

use App\Entity\PamsCode;
use App\Form\PamsEntreeType;
use App\Form\PamsInitType;
use App\Repository\PamsCodeRepository;
use App\Service\PamsCodeService;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;

class DefaultController extends AbstractController
{
    /**
     * @var ObjectManager
     */
    private $em;

    /**
     * @var PamsCodeRepository
     */
    private $pamsCodeRepository;

    /**
     * @var PamsCodeService
     */
    private $pamsCodeService;

    /**
     * @var SessionInterface
     */
    private $session;

    public function __construct(PamsCodeRepository $pamsCodeRepository, ObjectManager $em, PamsCodeService $pamsCodeService, SessionInterface $session)
    {
        $this->em = $em;
        $this->pamsCodeRepository = $pamsCodeRepository;
        $this->pamsCodeService = $pamsCodeService;
        $this->session = $session;
    }

    /**
     * @Route("/", name="homepage")
     */
    public function index(Request $request)
    {
        $form = $this->createForm(PamsEntreeType::class);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $pamsCodeEntree = $form->get('pamsCode')->getData();
            $pamsCodeEntree = $this->pamsCodeService->normalizeCode($pamsCodeEntree);

            $this->session->set('pamscode', $pamsCodeEntree);
            $codeRetour = $this->pamsCodeService->getCodeValid($pamsCodeEntree)[0];

            $route = $this->pamsCodeService->checkCodeRoute($codeRetour, $codeRetour * -1);
            if ($route !== null) {
                return $this->redirectToRoute($route);
            }

        }

        return $this->render('default/coffre.html.twig', [
            'form' => $form->createView()
        ]);

    }

    /**
     * @Route("/view", name="pams_view")
     */
    public function view(Request $request, \Swift_Mailer $mailer)
    {
        /*********
         * On contrôle que l'utilisateur est au bon endroit
         ***************/
        $pamsCode = $this->session->get('pamscode');
        $codeRetour = $this->pamsCodeService->getCodeValid($pamsCode);
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour[0], 2);
        if ($route !== null) {
            return $this->redirectToRoute($route);
        }
        /*****************/

        //Si il y a une notif de lecture on envoie un mail
        $this->pamsCodeService->notifLecture($codeRetour[1]);

        return $this->render('default/view.html.twig', [

        ]);

    }

    /**
     * @Route("/createur_view", name="pams_create_view")
     */
    public function createurView(Request $request)
    {
        /*********
         * On contrôle que l'utilisateur est au bon endroit
         ***************/

        $pamsCode = $this->session->get('pamscode');
        $retour = $this->pamsCodeService->getCodeValid($pamsCode);
        //$codeRetour = $retour[0];
        /* @var $pams PamsCode */
        $pams = $retour[1];
        //$route = $this->pamsCodeService->checkCodeRoute($codeRetour, 1);

        //if ($route !== null || $pams === null) {
        //    throw $this->createAccessDeniedException();
        //} else {
            $pamsArray = $this->pamsCodeService->getChapitre($pams, 1);
        //}

        return $this->render('default/createur_view.html.twig', ['Pamsjson' => json_encode($pamsArray)]);

    }

    /**
     * @Route("/create", name="pams_create")
     */
    public function create(Request $request)
    {
        /*********
         * On contrôle que l'utilisateur est au bon endroit
         ***************/
        $pamsCode = $this->session->get('pamscode');
        $codeRetour = $this->pamsCodeService->getCodeValid($pamsCode);
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour[0], 1);
        $pams = $codeRetour[1];
        if ($route !== null) {
            return $this->redirectToRoute($route);
        }
        //Si il y a dejà un pams on redirige vers l'update
        //if($pams!==null){
        //    return $this->redirectToRoute('pams_update');
        //}
        /*****************/

        return $this->render('default/create.html.twig', [

        ]);

    }

    /**
     * @Route("/update", name="pams_update")
     */
    public function update(Request $request)
    {
        /*********
         * On contrôle que l'utilisateur est au bon endroit
         ***************/
        $pamsCode = $this->session->get('pamscode');
        $codeRetour = $this->pamsCodeService->getCodeValid($pamsCode);
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour[0], 1);
        $pams = $codeRetour[1];
        if ($route !== null || $pams === null) {
            return $this->redirectToRoute($route);
        }else{
            $pamsArray = $this->pamsCodeService->getChapitre($pams, 1);
        }
        /*****************/

        return $this->render('default/update.html.twig', ['Pamsjson' => json_encode($pamsArray)]);

    }

    /**
     * @Route("/init", name="pams_init")
     */
    public function init(Request $request)
    {
        $pamsCode = $this->session->get('pamscode');

        /*********
         * On contrôle que l'utilisateur est au bon endroit
         ***************/
        $retour = $this->pamsCodeService->getCodeValid($pamsCode);
        $codeRetour = $retour[0];
        /* @var $pams \App\Entity\PamsCode */
        $pams = $retour[1];
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 3);
        if ($route !== null) {
            return $this->redirectToRoute($route);
        }
        /*****************/

        $form = $this->createForm(PamsInitType::class, $pams);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $pams->setPremiereConnexion(new \DateTime());
            $this->em->flush();

            $retour = $this->pamsCodeService->getCodeValid($pamsCode);
            $codeRetour = $retour[0];
            $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 3);
            if ($route !== null) {
                return $this->redirectToRoute($route);
            }

        }

        return $this->render('default/premiere_connexion.html.twig', [
            'form' => $form->createView()
        ]);

    }

    /**
     * @Route("/getnotif", name="get_notif", options={"expose"=true})
     * @param Request $request
     */
    public function getNotif(Request $request){
        if ($request->isXMLHttpRequest()) {
            $email = $request->request->get('publicationInput');

            if($email!=='') {

                $pamsCode = $this->session->get('pamscode');
                $retour = $this->pamsCodeService->getCodeValid($pamsCode);
                /* @var $pams PamsCode */
                $pams = $retour[1];

                $pams->setMailAuteur($email);
                $pams->setNotifLecture(true);

                $this->em->flush();
            }

        }
    }

    /**
     * @Route("/check-code-valid", name="pams_check_code_valid", options={"expose"=true})
     */
    public function checkCodeValid(Request $request)
    {
        $pamsCode = $request->query->get('data');
        $pamsCode = json_decode($pamsCode);
        $pamsCode = $pamsCode[0]->value;
        $retour = $this->pamsCodeService->getCodeValid($pamsCode);
        if($retour[0] === 99){
            return new Response('Oups Pas de pams trouvé');
        }else{
            return new Response('ok');
        }
    }

    /**
     * @Route("/get", name="pams_get", options={"expose"=true})
     * @param Request $request
     * @return Response
     */
    public function getPams(Request $request)
    {
        if ($request->isXMLHttpRequest()) {

            $pamsCode = $this->session->get('pamscode');
            $retour = $this->pamsCodeService->getCodeValid($pamsCode);
            $codeRetour = $retour[0];
            /* @var $pams PamsCode */
            $pams = $retour[1];
            $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 1);

            if ($route !== null || $pams === null) {
                throw $this->createAccessDeniedException();
            } else {
                $chapitre = $request->request->get('chapitre');
                $pamsArray = $this->pamsCodeService->getChapitre($pams, $chapitre);

                return new JsonResponse($pamsArray);
            }
        }

        return new Response('This is not ajax!', 400);
    }

    /**
     * @Route("/post", name="pams_post",  options={"expose"=true})
     * @param Request $request
     * @return Response
     * @throws \Exception
     */
    public function postPams(Request $request)
    {
        if ($request->isXMLHttpRequest()) {
            if($request->server->get('CONTENT_LENGTH')<PamsCodeService::TAILLE_MAX) {
                $pamsCode = $this->session->get('pamscode');
                $retour = $this->pamsCodeService->getCodeValid($pamsCode);
                $codeRetour = $retour[0];
                /* @var $pams PamsCode */
                $pams = $retour[1];
                $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 1);

                if ($route !== null || $pams === null) {
                    throw $this->createAccessDeniedException();
                } else {
                    $pamsJson = $request->request->get('pams');
                    if ($pamsJson !== null) {
                        $this->pamsCodeService->createChapitre($pams, $pamsJson);
                    } else {
                        return new Response('Pas de données', 500);
                    }

                    return new Response('ok');
                }
            }else{
                return new Response('Données trop importantes', 500);
            }
        }

        return new Response('This is not ajax!', 400);

    }

}

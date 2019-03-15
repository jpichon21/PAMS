<?php

namespace App\Controller;

use App\Form\PamsEntreeType;
use App\Form\PamsInitType;
use App\Repository\PamsCodeRepository;
use App\Service\PamsCodeService;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
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

            $this->session->set('pamscode',$pamsCodeEntree);
            $codeRetour = $this->pamsCodeService->getCodeValid($pamsCodeEntree)[0];

            $route = $this->pamsCodeService->checkCodeRoute($codeRetour, $codeRetour*-1);
            if($route!==null) {
                return $this->redirectToRoute($route);
            }

        }

        return $this->render('default/index.html.twig', [
            'form' => $form->createView()
        ]);

    }

    /**
     * @Route("/view", name="pams_view")
     */
    public function view(Request $request)
    {
        /*********
         * On contrôle que l'utilisateur est au bon endroit
         ***************/
        $pamsCode = $this->session->get('pamscode');
        $codeRetour = $this->pamsCodeService->getCodeValid($pamsCode)[0];
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 2);
        if($route!==null) {
            return $this->redirectToRoute($route);
        }
        /*****************/

        return $this->render('default/view.html.twig', [

        ]);

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
        $codeRetour = $this->pamsCodeService->getCodeValid($pamsCode)[0];
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 1);
        if($route!==null) {
            return $this->redirectToRoute($route);
        }
        /*****************/

        return $this->render('default/create.html.twig', [

        ]);

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
        $this->pamsCodeService->checkCodeRoute($codeRetour, 3);
        $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 3);
        if($route!==null) {
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
            $this->pamsCodeService->checkCodeRoute($codeRetour, 3);
            $route = $this->pamsCodeService->checkCodeRoute($codeRetour, 3);
            if($route!==null) {
                return $this->redirectToRoute($route);
            }

        }

        return $this->render('default/index.html.twig', [
            'form' => $form->createView()
        ]);

    }

}

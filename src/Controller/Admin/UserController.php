<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserController extends AbstractController
{
    /**
     * @var ObjectManager
     */
    private $em;

    /**
     * @var UserRepository
     */
    private $repository;

    private $userPasswordEncoder;

    public function __construct(UserRepository $repository, ObjectManager $em, UserPasswordEncoderInterface $userPasswordEncoder)
    {
        $this->em = $em;
        $this->repository = $repository;
        $this->userPasswordEncoder = $userPasswordEncoder;
    }

    /**
     * @Route("/admin/user", name="admin_user")
     */
    public function index()
    {
        $listeUsers = $this->repository->findAll();

        return $this->render('admin/user/index.html.twig', [
            'listeUsers' => $listeUsers,
        ]);
    }

    /**
     * @Route("/admin/user/new", name="admin_user_new")
     */
    public function new(Request $request)
    {
        $user = new User();
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {

            $plainPassword = $form->get('plainPassword')->getData();

            $user->setEnable(true);
            $user->setPassword(
                $this->userPasswordEncoder->encodePassword(
                    $user,
                    $plainPassword
                )
            );

            $this->em->persist($user);
            $this->em->flush();
            $this->addFlash('success', 'User créé avec succès');
            return $this->redirectToRoute('admin_user');
        }

        return $this->render('admin/user/new.html.twig', [
            'user' => $user,
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/admin/user/{id}", name="admin_user_edit", methods="GET|POST")
     * @param User $user
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function edit(User $user, Request $request)
    {
        $this->denyAccessUnlessGranted('ROLE_SUPER_ADMIN');

        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $plainPassword = $form->get('plainPassword')->getData();
            if ($plainPassword !== '') {
                $user->setPassword(
                    $this->userPasswordEncoder->encodePassword(
                        $user,
                        $plainPassword
                    )
                );
            }

            $this->em->flush();
            $this->addFlash('success', 'User modifié avec succès');
            return $this->redirectToRoute('admin_user');
        }

        return $this->render('admin/user/edit.html.twig', [
            'user' => $user,
            'form' => $form->createView()
        ]);
    }

    /**
     * @Route("/admin/user/{id}", name="admin_user_delete", methods="DELETE")
     * @param User $user
     * @return \Symfony\Component\HttpFoundation\RedirectResponse
     */
    public function delete(User $user, Request $request)
    {
        $this->denyAccessUnlessGranted('ROLE_SUPER_ADMIN');

        if (
            $user !== $this->getUser() &&
            $this->isCsrfTokenValid('delete' . $user->getId(), $request->get('_token'))
        ) {
            $this->em->remove($user);
            $this->em->flush();
            $this->addFlash('success', 'User supprimé avec succès');
        }

        return $this->redirectToRoute('admin_user');
    }

    /**
     * @Route("/admin/user/enable/{id}", name="admin_user_enable", options={"expose"=true})
     */
    public function enable(User $user)
    {
        $this->denyAccessUnlessGranted('ROLE_SUPER_ADMIN');

        $user->toogleEnable();

        $this->em->flush();

        return new Response("ok");

    }


}

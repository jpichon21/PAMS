<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Form\UserType;
use App\Repository\UserRepository;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

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

    public function __construct(UserRepository $repository, ObjectManager $em)
    {
        $this->em = $em;
        $this->repository = $repository;
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
        $form = $this->createForm(UserType::class, $user);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
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
        if (
            $user !== $this->getUser() &&
            $this->getUser()->hasRole('ROLE_SUPER_ADMIN') &&
            $this->isCsrfTokenValid('delete' . $user->getId(), $request->get('_token'))
        ) {
            $this->em->remove($user);
            $this->em->flush();
            $this->addFlash('success', 'User supprimé avec succès');
        }

        return $this->redirectToRoute('admin_user');
    }

}

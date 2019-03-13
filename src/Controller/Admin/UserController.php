<?php

namespace App\Controller\Admin;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class UserController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    /**
     * @Route("/admin/user", name="admin_user")
     */
    public function index()
    {
        $listeUsers = $this->entityManager->getRepository(User::class);

        return $this->render('admin/user/index.html.twig', [
            'listeUsers'=>$listeUsers,
        ]);
    }
}

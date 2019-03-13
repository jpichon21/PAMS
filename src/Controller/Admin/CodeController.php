<?php

namespace App\Controller\Admin;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class CodeController extends AbstractController
{
    /**
     * @Route("/admin/code", name="admin_code")
     */
    public function index()
    {
        return $this->render('admin/code/index.html.twig', [
            'controller_name' => 'CodeController',
        ]);
    }
}

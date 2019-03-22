<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class FirstFormController extends AbstractController
{
    /**
     * @Route("/first/form", name="first_form")
     */
    public function index()
    {
        return $this->render('first_form/index.html.twig', [
            'controller_name' => 'FirstFormController',
        ]);
    }
}

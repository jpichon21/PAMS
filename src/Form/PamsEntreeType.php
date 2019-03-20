<?php

namespace App\Form;

use App\Entity\PamsCode;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PamsEntreeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('pamsCode', TextType::class, array(
                'attr' => array(
                    'placeholder' => 'Entrez votre code',
                    'class' => 'form-control input-pams',
                    'maxlength' => 11,
            )))
            ->add('submit', SubmitType::class, array(
                'attr' => array(
                    'class' => 'btn btn-go',
            )))
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
        ]);
    }
}

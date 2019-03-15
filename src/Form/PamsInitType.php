<?php

namespace App\Form;

use App\Entity\PamsCode;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PamsInitType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('nomCompletAuteur', TextType::class, [

            ])
            ->add('mailAuteur', EmailType::class, [
                'required' => false
            ])
            ->add('notifLecture', CheckboxType::class, [
                'required' => false
            ])
            ->add('nomCompletDestinataire', TextType::class, [
                'required' => false
            ])
            ->add('remiseDate', DateType::class, [])
            ->add('titreHistoire', TextType::class, [])
            ->add('submit', SubmitType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PamsCode::class,
        ]);
    }
}

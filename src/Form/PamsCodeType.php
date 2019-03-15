<?php

namespace App\Form;

use App\Entity\PamsCode;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PamsCodeType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('createurCode', TextType::class, [
                'disabled' => true
            ])
            ->add('destinataireCode',TextType::class, [
                'disabled' => true
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'data_class' => PamsCode::class,
        ]);
    }
}

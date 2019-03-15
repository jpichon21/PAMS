<?php

namespace App\DataFixtures;

use App\Entity\PamsCode;
use App\Service\PamsCodeService;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PamsCodeFixtures extends Fixture
{
    private $pamsCodeService;

    public function __construct(PamsCodeService $pamsCodeService)
    {
        $this->pamsCodeService = $pamsCodeService;
    }

    public function load(ObjectManager $manager)
    {
        for ($i = 0; $i < 150; $i++) {
            $codes = $this->pamsCodeService->generateValidCode();
            $code = new PamsCode();
            $code->setCreateurCode($codes[0]);
            $code->setDestinataireCode($codes[1]);
            $manager->persist($code);
        }

        $manager->flush();
    }
}

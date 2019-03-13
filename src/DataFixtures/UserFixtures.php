<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
    private $passwordEncoder;

    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {

        // on créé 10 users
        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $user->setEmail(sprintf('userAdmin%d@faker.com', $i));
            if($i===0){
                $user->setRoles(['ROLE_USER','ROLE_ADMIN','ROLE_SUPER_ADMIN']);
            }else {
                $user->setRoles(['ROLE_USER','ROLE_ADMIN']);
            }
            $user->setPassword($this->passwordEncoder->encodePassword(
                $user,
                'userpass'
            ));
            $manager->persist($user);
        }

        $manager->flush();

    }
}

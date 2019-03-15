<?php

namespace App\Service;

use App\Entity\PamsCode;
use Doctrine\Common\Persistence\ObjectManager;

class PamsCodeService
{

    private $em;

    public function __construct(ObjectManager $em)
    {
        $this->em = $em;
    }

    //On genere les 2 codes Createur et Destinataire
    //Les 2 codes doivent être unique (present ni dans createur ni dans destinataire)
    public function generateValidCode()
    {
        $codes = [];

        for($j=0;$j<2;$j++) {
            $trouve=false;
            while (!$trouve) {
                $code = '';
                $chars = 'ABCDEFGHIJKMNOPQRSTUVWXYZ023456789';
                mt_srand((double)microtime() * 1000000);
                $i = 0;

                while ($i < 6) {
                    $num = mt_rand() % 34;
                    $tmp = $chars[$num];
                    $code .= $tmp;
                    $i++;
                }

                $repo = $this->em->getRepository(PamsCode::class);
                $codeExist = $repo->findOneByCreateurCode($code);
                if ($codeExist === null) {
                    $repo = $this->em->getRepository(PamsCode::class);
                    $codeExist = $repo->findOneByDestinataireCode($code);
                    if ($codeExist === null) {
                        $trouve = true;
                        $codes[$j] = $code;
                    }
                }

            }
        }

        return $codes;
    }
}
<?php

namespace App\Service;

use App\Entity\PamsCode;
use App\Repository\PamsCodeRepository;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\RouterInterface;

class PamsCodeService
{

    const TAILLEMAXCODE = 8;

    private $em;

    private $pamsCodeRepository;

    private $flashBag;

    public function __construct(
        ObjectManager $em,
        PamsCodeRepository $pamsCodeRepository,
        FlashBagInterface $flashBag
    )
    {
        $this->em = $em;
        $this->pamsCodeRepository = $pamsCodeRepository;
        $this->flashBag = $flashBag;
    }

    // 1 : Createur
    // 2 : Destinataire
    // 3 : premiere connexion createur
    // 99 : Introuvable
    public function getCodeValid(string $code){
        /* @var $pamsCode \App\Entity\PamsCode */
        $retour=[];
        $pamsCode = $this->pamsCodeRepository->findOneByCreateurCode($code);
        if($pamsCode !==null){
            if($pamsCode->getPremiereConnexion()===null){
                $retour[0] = 3;
            }else{
                $retour[0] = 1;
            }
        }else {
            $pamsCode = $this->pamsCodeRepository->findOneByDestinataireCode($code);
            if ($pamsCode !== null) {
                $retour[0] = 2;
            } else {
                $retour[0] = 99;
            }
        }

        $retour[1] = $pamsCode;
        return $retour;
    }

    // 1 : Createur
    // 2 : Destinataire
    // 3 : premiere connexion createur
    // 0 : Introuvable
    // Si -1 on ne s'occupe du code retour envoyé
    public function checkCodeRoute($codeRetourEnvoye, $codeRetourAttendu){
        $route = null;
        if(($codeRetourAttendu !== 1 && $codeRetourEnvoye===1) || $codeRetourAttendu===-1){
            $route = 'pams_create';
        }else {
            if (($codeRetourAttendu !== 2 && $codeRetourEnvoye===2) || $codeRetourAttendu===-2){
                $route = 'pams_view';
            } else {
                if(($codeRetourAttendu !== 3 && $codeRetourEnvoye===3) || $codeRetourAttendu===-3){
                    $route = 'pams_init';
                }else {
                    if(($codeRetourAttendu !== 99 && $codeRetourEnvoye===99) || $codeRetourAttendu===-99){
                        $this->flashBag->add('warning', 'Oups Pas de pams trouvé !');
                        $route = 'homepage';
                    }
                }
            }
        }

        return $route;
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

                while ($i < $this::TAILLEMAXCODE) {
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

    public function generateHash($codeCreateur, $codeDestinataire){
        return md5($codeCreateur . $codeDestinataire);
    }

    public function normalizeCode($code) {
        $code = preg_replace('#[^a-zA-Z0-9]#', '', $code);
        $code = strtoupper($code);

        return $code;
    }
}
<?php

namespace App\Service;

use App\Entity\PamsBlock;
use App\Entity\PamsChapitre;
use App\Entity\PamsCode;
use App\Repository\PamsBlockRepository;
use App\Repository\PamsChapitreRepository;
use App\Repository\PamsCodeRepository;
use Doctrine\Common\Persistence\ObjectManager;
use Exception;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBagInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\RouterInterface;

class PamsCodeService
{

    const TAILLEMAXCODE = 8;
    const PATH_TO_DATA_FOLDER = '/public/data';
    const TYPE_BLOCK_PHOTO = 'photo';
    const TYPE_BLOCK_TEXTE = 'texte';
    const TYPE_BLOCK_CITATION = 'citation';
    const TYPE_BLOCK_VIDEO = 'video';

    private $em;

    private $pamsCodeRepository;

    private $pamsChapitreRepository;

    private $pamsBlockRepository;

    private $flashBag;

    private $container;

    public function __construct(
        ObjectManager $em,
        PamsCodeRepository $pamsCodeRepository,
        PamsChapitreRepository $pamsChapitreRepository,
        PamsBlockRepository $pamsBlockRepository,
        FlashBagInterface $flashBag,
        ContainerInterface $container
    )
    {
        $this->em = $em;
        $this->pamsCodeRepository = $pamsCodeRepository;
        $this->flashBag = $flashBag;
        $this->pamsChapitreRepository = $pamsChapitreRepository;
        $this->pamsBlockRepository = $pamsBlockRepository;
        $this->container = $container;

    }

    // 1 : Createur
    // 2 : Destinataire
    // 3 : premiere connexion createur
    // 99 : Introuvable
    public function getCodeValid(string $code)
    {
        /* @var $pamsCode \App\Entity\PamsCode */
        $retour = [];
        $pamsCode = $this->pamsCodeRepository->findOneByCreateurCode($code);
        if ($pamsCode !== null) {
            if ($pamsCode->getPremiereConnexion() === null) {
                $retour[0] = 3;
            } else {
                $retour[0] = 1;
            }
        } else {
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
    public function checkCodeRoute($codeRetourEnvoye, $codeRetourAttendu)
    {
        $route = null;
        if (($codeRetourAttendu !== 1 && $codeRetourEnvoye === 1) || $codeRetourAttendu === -1) {
            $route = 'pams_create';
        } else {
            if (($codeRetourAttendu !== 2 && $codeRetourEnvoye === 2) || $codeRetourAttendu === -2) {
                $route = 'pams_view';
            } else {
                if (($codeRetourAttendu !== 3 && $codeRetourEnvoye === 3) || $codeRetourAttendu === -3) {
                    $route = 'pams_init';
                } else {
                    if (($codeRetourAttendu !== 99 && $codeRetourEnvoye === 99) || $codeRetourAttendu === -99) {
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

        for ($j = 0; $j < 2; $j++) {
            $trouve = false;
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

    public function generateHash($codeCreateur, $codeDestinataire)
    {
        return md5($codeCreateur . $codeDestinataire);
    }

    public function normalizeCode($code)
    {
        $code = preg_replace('#[^a-zA-Z0-9]#', '', $code);
        $code = strtoupper($code);

        return $code;
    }

    /**
     * @param PamsCode $pams
     * @param $pamsJson
     * @return null
     * @throws Exception
     */
    public function createChapitre(PamsCode $pams, $pamsJson)
    {

        $fichiersASupprimer = [];
        $pamsObj = json_decode($pamsJson);

        //On verifie que le chapitre existe
        //Si non on le cree

        $chapitre = $this->pamsChapitreRepository->findOneBy(['pams' => $pams->getId(), 'numero' => $pamsObj->chapitre]);

        if ($chapitre === null) {
            $chapitre = new PamsChapitre();
            $chapitre->setNumero($pamsObj->chapitre);
            $chapitre->setPams($pams);
            $this->em->persist($chapitre);
        }

        //Gestion de l'opacité et couleur
        $chapitre->setOpacite($pamsObj->backgroundOpacity);
        $chapitre->setBackgroundColor($pamsObj->backgroundColor);

        //Gestion de l'image du chapitre
        if ($pamsObj->uploadedbackgroundImage !== null) {
            //On stock le fichier à supprimer
            if ($chapitre->getIsCustomImage()) {
                $fichiersASupprimer[] = $chapitre->getBackgroundImage();
            }

            //On cree le fichier
            $nomFichier = $this->decode_image($pams->getId(), $pamsObj->uploadedbackgroundImage);
            $chapitre->setBackgroundImage($nomFichier);
            $chapitre->setIsCustomImage(true);

        } else {
            $chapitre->setBackgroundImage($pamsObj->backgroundImage);
            $chapitre->setIsCustomImage(false);
        }

        //Gestion de la musique du chapitre
        if (property_exists($pamsObj, "uploadedMusic") && $pamsObj->uploadedMusic !== null) {
            //On stock le fichier à supprimer
            if ($chapitre->getIsCustomMusic()) {
                $fichiersASupprimer[] = $chapitre->getMusic();
            }

            //On cree le fichier
            $nomFichier = $this->decode_music($pams->getId(), $pamsObj->uploadedMusic);
            $chapitre->setMusic($nomFichier);
            $chapitre->setIsCustomMusic(true);

        } else {
            $chapitre->setMusic($pamsObj->backgroundImage);
            $chapitre->setIsCustomMusic(false);
        }

        //Gestion du layout du chapitre
        $chapitre->setLayout($pamsObj->layout);

        $blockPresent = [];
        //Gestion des blocks photo
        if (property_exists($pamsObj, "uploadedblockImage") && $pamsObj->uploadedblockImage !== null) {
            foreach ($pamsObj->uploadedblockImage as $nomBlock => $blockData) {
                $block = $this->pamsBlockRepository->findOneBy(['chapitre' => $chapitre->getId(), 'nomBlock' => $nomBlock]);
                $nomFichier = $this->decode_image($pams->getId(), $blockData);

                //Si le block est null on le créé sinon
                if ($block === null) {
                    $block = new PamsBlock();
                    $block->setNomBlock($nomBlock);
                    $this->em->persist($block);
                } else {
                    $fichiersASupprimer[] = $block->getValeur();
                    $blockPresent[] = $nomBlock;
                }

                $block->setChapitre($chapitre);
                $block->setTypeBlock(self::TYPE_BLOCK_PHOTO);
                $block->setValeur($nomFichier);
            }
        }

        //Gestion des blocks video
        if (property_exists($pamsObj, "uploadedblockVideos") && $pamsObj->uploadedblockVideos !== null) {
            foreach ($pamsObj->uploadedblockVideos as $nomBlock => $blockData) {
                $block = $this->pamsBlockRepository->findOneBy(['chapitre' => $chapitre->getId(), 'nomBlock' => $nomBlock]);
                $nomFichier = $this->decode_video($pams->getId(), $blockData);

                //Si le block est null on le créé sinon
                if ($block === null) {
                    $block = new PamsBlock();
                    $block->setNomBlock($nomBlock);
                    $this->em->persist($block);
                } else {
                    $fichiersASupprimer[] = $block->getValeur();
                    $blockPresent[] = $nomBlock;
                }

                $block->setChapitre($chapitre);
                $block->setTypeBlock(self::TYPE_BLOCK_VIDEO);
                $block->setValeur($nomFichier);
            }
        }

        //On supprime les blocks qui ne servent plus
        $blocks = $this->pamsBlockRepository->findBy(['chapitre' => $chapitre->getId()]);
        foreach($blocks as $block){
            if(!in_array($block->getNomBlock(), $blockPresent)){
                $fichiersASupprimer[] = $block->getValeur();
                $this->em->remove($block);
            }
        }

        $this->em->flush();

        //On supprime les fichiers uniquement si le flush a fonctionné
        foreach ($fichiersASupprimer as $fichier) {
            @unlink($this->container->getParameter('kernel.project_dir') . self::PATH_TO_DATA_FOLDER . '/' . $pams->getId() . '/' . $fichier);
        }

        return null;
    }

    public function getChapitre(PamsCode $pams, $chapitre){
        $pamsArray = [];

        $chapitre = $this->pamsChapitreRepository->findOneBy(['pams' => $pams->getId(), 'numero' => $chapitre]);
        if($chapitre===null){
            $pamsArray['backgroundColor'] = null;
            $pamsArray['backgroundImage'] = null;
            $pamsArray['backgroundOpacity'] = null;
            $pamsArray['chapitre'] = null;
            $pamsArray['nbChapitre'] = null;
            $pamsArray['layout'] = null;
        }else {

            $pamsArray['backgroundColor'] = $chapitre->getBackgroundColor();
            if ($chapitre->getIsCustomImage()) {
                $pamsArray['backgroundImage'] = self::PATH_TO_DATA_FOLDER . '/' . $pams->getId() . '/' . $chapitre->getBackgroundImage();
            } else {
                $pamsArray['backgroundImage'] = $chapitre->getBackgroundImage();
            }
            $pamsArray['backgroundOpacity'] = $chapitre->getOpacite();
            $pamsArray['chapitre'] = $chapitre->getNumero();
            $pamsArray['nbChapitre'] = count($chapitre->getPams()->getPamsChapitres());
            $pamsArray['layout'] = $chapitre->getLayout();

            foreach ($chapitre->getPamsBlocks() as $block) {
                switch ($block->getTypeBlock()) {
                    case self::TYPE_BLOCK_PHOTO :
                        $pamsArray['uploadedblockImage'][$block->getNomBlock()] = $block->getValeur();
                        break;
                    case self::TYPE_BLOCK_TEXTE :
                        $pamsArray['uploadedblockImage'][$block->getNomBlock()] = $block->getValeur();
                        break;
                    case self::TYPE_BLOCK_CITATION :
                        $pamsArray['uploadedblockImage'][$block->getNomBlock()] = $block->getValeur();
                        break;
                    case self::TYPE_BLOCK_VIDEO :
                        $pamsArray['uploadedblockVideos'][$block->getNomBlock()] = $block->getValeur();
                        break;
                    default:
                }
            }
        }


        return $pamsArray;
    }

    public function decode_image($pamsId, $base64)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
            $data = substr($base64, strpos($base64, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new Exception('invalid image type');
            }

            $data = base64_decode($data);

            if ($data === false) {
                throw new Exception('base64_decode failed');
            }
        } else {
            throw new Exception('did not match data URI with image data');
        }

        $dir = $this->container->getParameter('kernel.project_dir') . self::PATH_TO_DATA_FOLDER . '/' . $pamsId;

        if (!file_exists($dir)) {
            if (!mkdir($dir, 0777)) {
                throw new Exception('Unable to create data directory');
            };
        }

        $nomFichier = uniqid() . '.' . $type;
        file_put_contents($dir . '/' . $nomFichier, $data);

        return $nomFichier;
    }

    public function decode_video($pamsId, $base64)
    {
        if (preg_match('/^data:video\/(\w+);base64,/', $base64, $type)) {
            $data = substr($base64, strpos($base64, ',') + 1);
            $type = strtolower($type[1]);

            if (!in_array($type, ['mp4'])) {
                throw new Exception('invalid video type');
            }

            $data = base64_decode($data);

            if ($data === false) {
                throw new Exception('base64_decode failed');
            }
        } else {
            throw new Exception('did not match data URI with video data');
        }

        $dir = $this->container->getParameter('kernel.project_dir') . self::PATH_TO_DATA_FOLDER . '/' . $pamsId;

        if (!file_exists($dir)) {
            if (!mkdir($dir, 0777)) {
                throw new Exception('Unable to create data directory');
            };
        }

        $nomFichier = uniqid() . '.' . $type;
        file_put_contents($dir . '/' . $nomFichier, $data);

        return $nomFichier;
    }

    // A faire quand le front l'enverra
    public function decode_music($pamsId, $base64)
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) {
            $data = substr($base64, strpos($base64, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif

            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new Exception('invalid image type');
            }

            $data = base64_decode($data);

            if ($data === false) {
                throw new Exception('base64_decode failed');
            }
        } else {
            throw new Exception('did not match data URI with image data');
        }

        $dir = $this->container->getParameter('kernel.project_dir') . self::PATH_TO_DATA_FOLDER . '/' . $pamsId;

        if (!file_exists($dir)) {
            if (!mkdir($dir, 0777)) {
                throw new Exception('Unable to create data directory');
            };
        }

        $nomFichier = uniqid() . '.' . $type;
        file_put_contents($dir . '/' . $nomFichier, $data);

        return $nomFichier;
    }


}
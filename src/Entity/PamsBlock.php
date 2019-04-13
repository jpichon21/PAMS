<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PamsBlockRepository")
 * @ORM\HasLifecycleCallbacks
 */
class PamsBlock
{
    use TimestampableEntity;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\PamsChapitre", inversedBy="pamsBlocks")
     * @ORM\JoinColumn(nullable=false)
     */
    private $chapitre;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $typeBlock;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $nomBlock;

    /**
     * @ORM\Column(type="text")
     */
    private $valeur;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $auteur;

    /**
     * @ORM\Column(type="text", nullable=true)
     */
    private $infos;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChapitre(): ?PamsChapitre
    {
        return $this->chapitre;
    }

    public function setChapitre(?PamsChapitre $chapitre): self
    {
        $this->chapitre = $chapitre;

        return $this;
    }

    public function getTypeBlock(): ?string
    {
        return $this->typeBlock;
    }

    public function setTypeBlock(string $typeBlock): self
    {
        $this->typeBlock = $typeBlock;

        return $this;
    }

    public function getNomBlock(): ?string
    {
        return $this->nomBlock;
    }

    public function setNomBlock(string $nomBlock): self
    {
        $this->nomBlock = $nomBlock;

        return $this;
    }

    public function getValeur(): ?string
    {
        return $this->valeur;
    }

    public function setValeur(string $valeur): self
    {
        $this->valeur = $valeur;

        return $this;
    }

    public function getAuteur(): ?string
    {
        return $this->auteur;
    }

    public function setAuteur(?string $auteur): self
    {
        $this->auteur = $auteur;

        return $this;
    }

    public function getInfos(): ?string
    {
        return $this->infos;
    }

    public function setInfos(?string $infos): self
    {
        $this->infos = $infos;

        return $this;
    }
}

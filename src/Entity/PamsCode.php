<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PamsCodeRepository")
 * @ORM\HasLifecycleCallbacks
 */
class PamsCode
{
    use TimestampableEntity;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=8, unique=true)
     */
    private $createurCode;

    /**
     * @ORM\Column(type="string", length=8, unique=true)
     */
    private $destinataireCode;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $onlineDate;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $visionDate;

    /**
     * @ORM\Column(type="string", length=32)
     */
    private $hash;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $premiereConnexion;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $nomCompletAuteur;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $nomCompletDestinataire;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $mailAuteur;

    /**
     * @ORM\Column(type="datetime", nullable=true)
     */
    private $remiseDate;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $titreHistoire;

    /**
     * @ORM\Column(type="boolean")
     */
    private $notifLecture;


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getDestinataireCode(): ?string
    {
        return $this->destinataireCode;
    }

    public function setDestinataireCode(string $destinataireCode): self
    {
        $this->destinataireCode = $destinataireCode;

        return $this;
    }

    public function getOnlineDate(): ?\DateTimeInterface
    {
        return $this->onlineDate;
    }

    public function setOnlineDate(?\DateTimeInterface $onlineDate): self
    {
        $this->onlineDate = $onlineDate;

        return $this;
    }

    public function getVisionDate(): ?\DateTimeInterface
    {
        return $this->visionDate;
    }

    public function setVisionDate(?\DateTimeInterface $visionDate): self
    {
        $this->visionDate = $visionDate;

        return $this;
    }

    public function getCreateurCode(): ?string
    {
        return $this->createurCode;
    }

    public function setCreateurCode(string $createurCode): self
    {
        $this->createurCode = $createurCode;

        return $this;
    }

    public function getHash(): ?string
    {
        return $this->hash;
    }

    public function setHash(string $hash): self
    {
        $this->hash = $hash;

        return $this;
    }

    public function getPremiereConnexion(): ?\DateTimeInterface
    {
        return $this->premiereConnexion;
    }

    public function setPremiereConnexion(?\DateTimeInterface $premiereConnexion): self
    {
        $this->premiereConnexion = $premiereConnexion;

        return $this;
    }

    public function getNomCompletAuteur(): ?string
    {
        return $this->nomCompletAuteur;
    }

    public function setNomCompletAuteur(?string $nomCompletAuteur): self
    {
        $this->nomCompletAuteur = $nomCompletAuteur;

        return $this;
    }

    public function getNomCompletDestinataire(): ?string
    {
        return $this->nomCompletDestinataire;
    }

    public function setNomCompletDestinataire(?string $nomCompletDestinataire): self
    {
        $this->nomCompletDestinataire = $nomCompletDestinataire;

        return $this;
    }

    public function getMailAuteur(): ?string
    {
        return $this->mailAuteur;
    }

    public function setMailAuteur(?string $mailAuteur): self
    {
        $this->mailAuteur = $mailAuteur;

        return $this;
    }

    public function getRemiseDate(): ?\DateTimeInterface
    {
        return $this->remiseDate;
    }

    public function setRemiseDate(?\DateTimeInterface $remiseDate): self
    {
        $this->remiseDate = $remiseDate;

        return $this;
    }

    public function getTitreHistoire(): ?string
    {
        return $this->titreHistoire;
    }

    public function setTitreHistoire(?string $titreHistoire): self
    {
        $this->titreHistoire = $titreHistoire;

        return $this;
    }

    public function getNotifLecture(): ?bool
    {
        return $this->notifLecture;
    }

    public function setNotifLecture(bool $notifLecture): self
    {
        $this->notifLecture = $notifLecture;

        return $this;
    }

}

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
     * @ORM\Column(type="string", length=6, unique=true)
     */
    private $createurCode;

    /**
     * @ORM\Column(type="string", length=6, unique=true)
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

}

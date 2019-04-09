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
}

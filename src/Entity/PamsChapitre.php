<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\PamsChapitreRepository")
 * @ORM\HasLifecycleCallbacks
 *
 */
class PamsChapitre
{
    use TimestampableEntity;

    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="smallint")
     */
    private $numero;

    /**
     * @ORM\ManyToOne(targetEntity="App\Entity\PamsCode", inversedBy="pamsChapitres")
     * @ORM\JoinColumn(nullable=false)
     */
    private $pams;

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\PamsBlock", mappedBy="chapitre")
     */
    private $pamsBlocks;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $backgroundImage;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $backgroundColor;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $music;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $layout;

    public function __construct()
    {
        $this->pamsBlocks = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNumero(): ?int
    {
        return $this->numero;
    }

    public function setNumero(int $numero): self
    {
        $this->numero = $numero;

        return $this;
    }

    public function getPams(): ?PamsCode
    {
        return $this->pams;
    }

    public function setPams(?PamsCode $pams): self
    {
        $this->pams = $pams;

        return $this;
    }

    /**
     * @return Collection|PamsBlock[]
     */
    public function getPamsBlocks(): Collection
    {
        return $this->pamsBlocks;
    }

    public function addPamsBlock(PamsBlock $pamsBlock): self
    {
        if (!$this->pamsBlocks->contains($pamsBlock)) {
            $this->pamsBlocks[] = $pamsBlock;
            $pamsBlock->setChapitre($this);
        }

        return $this;
    }

    public function removePamsBlock(PamsBlock $pamsBlock): self
    {
        if ($this->pamsBlocks->contains($pamsBlock)) {
            $this->pamsBlocks->removeElement($pamsBlock);
            // set the owning side to null (unless already changed)
            if ($pamsBlock->getChapitre() === $this) {
                $pamsBlock->setChapitre(null);
            }
        }

        return $this;
    }

    public function getBackgroundImage(): ?string
    {
        return $this->backgroundImage;
    }

    public function setBackgroundImage(?string $backgroundImage): self
    {
        $this->backgroundImage = $backgroundImage;

        return $this;
    }

    public function getBackgroundColor(): ?string
    {
        return $this->backgroundColor;
    }

    public function setBackgroundColor(?string $backgroundColor): self
    {
        $this->backgroundColor = $backgroundColor;

        return $this;
    }

    public function getMusic(): ?string
    {
        return $this->music;
    }

    public function setMusic(?string $music): self
    {
        $this->music = $music;

        return $this;
    }

    public function getLayout(): ?string
    {
        return $this->layout;
    }

    public function setLayout(?string $layout): self
    {
        $this->layout = $layout;

        return $this;
    }
}

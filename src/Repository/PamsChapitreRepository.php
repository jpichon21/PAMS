<?php

namespace App\Repository;

use App\Entity\PamsChapitre;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method PamsChapitre|null find($id, $lockMode = null, $lockVersion = null)
 * @method PamsChapitre|null findOneBy(array $criteria, array $orderBy = null)
 * @method PamsChapitre[]    findAll()
 * @method PamsChapitre[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PamsChapitreRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, PamsChapitre::class);
    }

    // /**
    //  * @return PamsChapitre[] Returns an array of PamsChapitre objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('p.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?PamsChapitre
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

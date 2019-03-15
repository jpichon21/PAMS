<?php

namespace App\Repository;

use App\Entity\PamsCode;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method PamsCode|null find($id, $lockMode = null, $lockVersion = null)
 * @method PamsCode|null findOneBy(array $criteria, array $orderBy = null)
 * @method PamsCode[]    findAll()
 * @method PamsCode[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PamsCodeRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, PamsCode::class);
    }

    // /**
    //  * @return PamsCode[] Returns an array of PamsCode objects
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
    public function findOneBySomeField($value): ?PamsCode
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

<?php

namespace App\Repository;

use App\Entity\PamsBlock;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bridge\Doctrine\RegistryInterface;

/**
 * @method PamsBlock|null find($id, $lockMode = null, $lockVersion = null)
 * @method PamsBlock|null findOneBy(array $criteria, array $orderBy = null)
 * @method PamsBlock[]    findAll()
 * @method PamsBlock[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PamsBlockRepository extends ServiceEntityRepository
{
    public function __construct(RegistryInterface $registry)
    {
        parent::__construct($registry, PamsBlock::class);
    }

    // /**
    //  * @return PamsBlock[] Returns an array of PamsBlock objects
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
    public function findOneBySomeField($value): ?PamsBlock
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

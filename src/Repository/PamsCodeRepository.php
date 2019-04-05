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

    public function count($criteria)
    {
        return $this
            ->createQueryBuilder('object')
            ->select("count(object.id)")
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getRequiredDTData($start, $length, $orders, $search)
    {
        // Create Main Query
        $query = $this->createQueryBuilder('pamscode');

        // Create Count Query
        $countQuery = $this->createQueryBuilder('pamscode');
        $countQuery->select('COUNT(pamscode)');

        $query->where("1=1");
        $countQuery->where("1=1");

        //Search
        if($search['value']!='') {
            $search = $search['value'];
            $searchQuery = 'pamscode.createurCode LIKE :search OR pamscode.destinataireCode LIKE :search';
            $query->andWhere($searchQuery);
            $query->setParameter('search','%'.$search.'%');
            $countQuery->andWhere($searchQuery);
            $countQuery->setParameter('search','%'.$search.'%');
        }

        // Limit
        $query->setFirstResult($start)->setMaxResults($length);

        // Order
        foreach ($orders as $key => $order)
        {
            // $order['name'] is the name of the order column as sent by the JS
            if ($order['name'] != '')
            {
                $orderColumn = null;

                switch($order['name'])
                {
                    case 'id':
                        {
                            $orderColumn = 'pamscode.id';
                            break;
                        }
                    case 'destinataire':
                        {
                            $orderColumn = 'pamscode.destinataireCode';
                            break;
                        }
                    case 'createur':
                        {
                            $orderColumn = 'pamscode.createurCode';
                            break;
                        }
                    case 'online':
                        {
                            $orderColumn = 'pamscode.online';
                            break;
                        }
                }

                if ($orderColumn !== null)
                {
                    $query->orderBy($orderColumn, $order['dir']);
                }
            }
        }

        // Execute
        $results = $query->getQuery()->getResult();
        $countResult = $countQuery->getQuery()->getSingleScalarResult();

        return array(
            "results" 		=> $results,
            "countResult"	=> $countResult
        );
    }
}

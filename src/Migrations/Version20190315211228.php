<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190315211228 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE pams_code ADD premiere_connexion DATETIME DEFAULT NULL, ADD nom_complet_auteur VARCHAR(255) DEFAULT NULL, ADD nom_complet_destinataire VARCHAR(255) DEFAULT NULL, ADD mail_auteur VARCHAR(255) DEFAULT NULL, ADD remise_date DATETIME DEFAULT NULL, ADD titre_histoire VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE pams_code DROP premiere_connexion, DROP nom_complet_auteur, DROP nom_complet_destinataire, DROP mail_auteur, DROP remise_date, DROP titre_histoire');
    }
}

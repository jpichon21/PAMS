<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20190413170850 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('CREATE TABLE pams_block (id INT AUTO_INCREMENT NOT NULL, chapitre_id INT NOT NULL, type_block VARCHAR(255) NOT NULL, nom_block VARCHAR(255) NOT NULL, valeur LONGTEXT NOT NULL, auteur LONGTEXT DEFAULT NULL, infos LONGTEXT DEFAULT NULL, created_at DATETIME DEFAULT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_7054DDC81FBEEF7B (chapitre_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('CREATE TABLE pams_chapitre (id INT AUTO_INCREMENT NOT NULL, pams_id INT NOT NULL, numero SMALLINT NOT NULL, background_image VARCHAR(255) DEFAULT NULL, background_color VARCHAR(255) DEFAULT NULL, music VARCHAR(255) DEFAULT NULL, layout VARCHAR(255) DEFAULT NULL, is_custom_image TINYINT(1) NOT NULL, opacite VARCHAR(255) DEFAULT NULL, is_custom_music TINYINT(1) NOT NULL, created_at DATETIME DEFAULT NULL, updated_at DATETIME DEFAULT NULL, INDEX IDX_C4E21E2E33847306 (pams_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE = InnoDB');
        $this->addSql('ALTER TABLE pams_block ADD CONSTRAINT FK_7054DDC81FBEEF7B FOREIGN KEY (chapitre_id) REFERENCES pams_chapitre (id)');
        $this->addSql('ALTER TABLE pams_chapitre ADD CONSTRAINT FK_C4E21E2E33847306 FOREIGN KEY (pams_id) REFERENCES pams_code (id)');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE pams_block DROP FOREIGN KEY FK_7054DDC81FBEEF7B');
        $this->addSql('DROP TABLE pams_block');
        $this->addSql('DROP TABLE pams_chapitre');
    }
}

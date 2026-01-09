-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 09 jan. 2026 à 15:16
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `kanban_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `board`
--

DROP TABLE IF EXISTS `board`;
CREATE TABLE IF NOT EXISTS `board` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `board`
--

INSERT INTO `board` (`id`, `nom`, `username`) VALUES
(1, 'Projet JEE - Kanba', NULL),
(2, 'Nouveau Projet', NULL),
(4, 'Booard1', 'med'),
(5, 'Board2', 'med'),
(6, 'Dév App Kanban', 'admin'),
(7, 'Révisions & Examens', 'admin');

-- --------------------------------------------------------

--
-- Structure de la table `kanban_column`
--

DROP TABLE IF EXISTS `kanban_column`;
CREATE TABLE IF NOT EXISTS `kanban_column` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `board_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9emsfm9uo0nxypy8lqcl8gt6u` (`board_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `kanban_column`
--

INSERT INTO `kanban_column` (`id`, `nom`, `board_id`) VALUES
(1, 'En attente', 1),
(2, 'teste2', 1),
(4, 'fff', 1),
(5, 'ddd', 1),
(6, 'eeeeeeeee', 1),
(7, 'Backlog', 6),
(8, 'En cours', 6),
(9, 'Revue de Code', 6),
(10, 'Terminé', 6),
(11, 'À réviser', 7),
(12, 'En cours (TP)', 7),
(13, 'Préparation Examen', 7),
(14, 'Validé', 7);

-- --------------------------------------------------------

--
-- Structure de la table `tag`
--

DROP TABLE IF EXISTS `tag`;
CREATE TABLE IF NOT EXISTS `tag` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `couleur` varchar(255) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `tag`
--

INSERT INTO `tag` (`id`, `couleur`, `nom`) VALUES
(1, '#FF0000', 'Urgent'),
(2, '#00FF00', 'Développement'),
(3, '#0000FF', 'Bug'),
(4, '#FF5733', 'Prioritaire');

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `column_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf381n7ejf0hwxb7px8vkel0ea` (`column_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `task`
--

INSERT INTO `task` (`id`, `description`, `titre`, `column_id`) VALUES
(1, 'Vérification du fonctionnement', 'Tâche de test', 1),
(2, 'Ceci est une description de test', 'Ma première tâche', 2),
(3, 'a revoir', 'tache 22', 1),
(4, '', 'tache3', 1),
(5, 'fff', 'ff', 1),
(6, '\"eeeeeeee', 'fffffe', 1),
(7, 'fffffffffff', 'fffffffffff', 1),
(8, 'ccc', 'fffffffffffff', 1),
(9, 'aaaaaaaaaaaa', 'sssssssss', 1),
(10, 'Optimiser le chargement des modules Angular.', 'Configurer Lazy Loading', 7),
(11, 'Créer une grille de cartes pour l\'espace de travail.', 'Design du Dashboard', 7),
(12, 'Correction des erreurs 401 lors des requêtes preflight.', 'Debugger l\'intercepteur Auth', 8),
(13, 'Ajouter le logo cliquable \"K\" et l\'avatar.', 'Intégration du Navbar', 8),
(14, 'Utiliser @angular/cdk pour déplacer les cartes.', 'Implémenter le Drag & Drop', 9),
(15, 'Utiliser Pageable dans le controller Java.', 'Pagination Backend', 9),
(16, 'Interfaces Board, Column et Task terminées.', 'Créer le modèle de données', 10),
(17, 'Configuration In-Memory avec admin/12345.', 'Setup Spring Security', 10),
(18, 'Revoir les fichiers de contrôle et les tablespaces.', 'Architecture Oracle 19c', 11),
(19, 'Apprendre les protocoles SSL/TLS et certificats.', 'Sécurité Réseaux', 11),
(20, 'Mise en place de l\'authentification Basic et JWT.', 'Spring Security', 11),
(21, 'Mapping des relations complexes (ManyToMany) et Lazy Loading.', 'JPA / Hibernate', 11),
(22, 'Configuration d\'hyperviseurs bare-metal (Proxmox/ESXi).', 'Virtualisation Type 1', 11),
(23, 'Calculs de vue et de perspective en 3D.', 'Matrices de Projection', 11),
(24, 'Gestion des services et des intercepteurs HTTP.', 'Développement Angular', 11),
(25, 'Utilisation de EXPLAIN PLAN et indexation.', 'Optimisation SQL', 11),
(26, 'Finir le service de gestion des tâches.', 'Mini-projet Angular', 12),
(27, 'Pratiquer les relations ManyToOne et les @Query.', 'Réviser JPA / Hibernate', 13),
(28, 'Revoir les hyperviseurs de type 1 et type 2.', 'Virtualisation & Cloud', 13),
(29, 'Soumission finale du rapport technique.', 'Rapport de Stage', 14),
(30, 'Niveau C1 validé.', 'Certificat Anglais', 14);

-- --------------------------------------------------------

--
-- Structure de la table `task_tags`
--

DROP TABLE IF EXISTS `task_tags`;
CREATE TABLE IF NOT EXISTS `task_tags` (
  `task_id` bigint NOT NULL,
  `tag_id` bigint NOT NULL,
  KEY `FKd15mt5ws4x5odinqe02xf8you` (`tag_id`),
  KEY `FK5jrufop0gtxfeybb27jkoqn9r` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `task_tags`
--

INSERT INTO `task_tags` (`task_id`, `tag_id`) VALUES
(1, 4);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr43af9ap4edm43mmtq01oddj6` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `password`, `role`, `username`) VALUES
(1, '$2a$10$Uaf4Ezh05AL2RFIQukPhb.ZjN3s3U/rmpAPIiLqLaFUvpCr20Kd8a', 'ROLE_USER', 'mon_utilisateur'),
(2, '$2a$10$/4JCSOwjlVrCRS7XhruHJ.IQjunHZaoqsvHJnSBTigY/4VMoNGiOG', 'ROLE_USER', 'med'),
(3, '$2a$10$znUkG0kUbPqDFBgboI8MQeg1Vx2Thawg.G4pfYPjGUnPqylgf.q32', 'ROLE_USER', 'Mohammed');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `kanban_column`
--
ALTER TABLE `kanban_column`
  ADD CONSTRAINT `FK9emsfm9uo0nxypy8lqcl8gt6u` FOREIGN KEY (`board_id`) REFERENCES `board` (`id`);

--
-- Contraintes pour la table `task`
--
ALTER TABLE `task`
  ADD CONSTRAINT `FKf381n7ejf0hwxb7px8vkel0ea` FOREIGN KEY (`column_id`) REFERENCES `kanban_column` (`id`);

--
-- Contraintes pour la table `task_tags`
--
ALTER TABLE `task_tags`
  ADD CONSTRAINT `FK5jrufop0gtxfeybb27jkoqn9r` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`),
  ADD CONSTRAINT `FKd15mt5ws4x5odinqe02xf8you` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

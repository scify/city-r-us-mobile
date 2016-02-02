-- MySQL dump 10.13  Distrib 5.5.46, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: project_cityrus
-- ------------------------------------------------------
-- Server version	5.5.46-0ubuntu0.12.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `device_capabilities`
--
use city-r-us;
DROP TABLE IF EXISTS `device_capabilities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device_capabilities` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `unit` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `data_type` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `device_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `device_capabilities_device_id_foreign` (`device_id`),
  CONSTRAINT `device_capabilities_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_capabilities`
--

LOCK TABLES `device_capabilities` WRITE;
/*!40000 ALTER TABLE `device_capabilities` DISABLE KEYS */;
/*!40000 ALTER TABLE `device_capabilities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `manufacturer` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT 'smartphone',
  `status` varchar(255) COLLATE utf8_unicode_ci NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `devices_user_id_foreign` (`user_id`),
  CONSTRAINT `devices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'test','test','test','smartphone','1','2016-01-22 10:43:46','2016-01-22 10:43:46',NULL,1),(2,'450b56a8ef11328a','ZTE Blade L2','Android','smartphone','1','2016-01-22 13:33:46','2016-01-22 13:33:46',NULL,2),(3,'83c2b3f42d7511a7','GT-I9505','Android','smartphone','1','2016-01-22 13:42:13','2016-01-22 13:42:13',NULL,3),(4,'e38b6d465f1db09f','HTC Desire 620G dual sim','Android','smartphone','1','2016-01-22 23:09:03','2016-01-22 23:09:03',NULL,4),(5,'83c2b3f42d7511a7','GT-I9505','Android','smartphone','1','2016-01-25 08:31:21','2016-01-25 08:31:21',NULL,5),(6,'23bc3fc9758b8f0','Lenovo TAB S8-50F','Android','smartphone','1','2016-01-25 09:41:19','2016-01-25 09:41:19',NULL,6),(7,'450b56a8ef11328a','ZTE Blade L2','Android','smartphone','1','2016-01-25 09:43:15','2016-01-25 09:43:15',NULL,7),(8,'83c2b3f42d7511a7','GT-I9505','Android','smartphone','1','2016-01-25 10:28:53','2016-01-25 10:28:53',NULL,8),(9,'b3c80029176a7ec9','Nexus 4','Android','smartphone','1','2016-01-25 10:34:14','2016-01-25 10:34:14',NULL,9),(10,'83c2b3f42d7511a7','GT-I9505','Android','smartphone','1','2016-01-25 11:45:22','2016-01-25 11:45:22',NULL,10);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices_missions`
--

DROP TABLE IF EXISTS `devices_missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices_missions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `registration_date` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `device_id` int(10) unsigned NOT NULL,
  `mission_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `devices_missions_device_id_foreign` (`device_id`),
  KEY `devices_missions_mission_id_foreign` (`mission_id`),
  CONSTRAINT `devices_missions_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`),
  CONSTRAINT `devices_missions_mission_id_foreign` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices_missions`
--

LOCK TABLES `devices_missions` WRITE;
/*!40000 ALTER TABLE `devices_missions` DISABLE KEYS */;
INSERT INTO `devices_missions` VALUES (1,'s.cityrus_O5m8eTmy5t7gkPak.23bc3fc9758b8f0','37.967747','23.715059','2016-01-25 09:41:32','0000-00-00 00:00:00','0000-00-00 00:00:00',6,1),(2,'s.cityrus_CN3TL1WsjadDnbn8.23bc3fc9758b8f0','37.970150','23.722424','2016-01-25 09:49:59','0000-00-00 00:00:00','0000-00-00 00:00:00',6,3),(3,'s.cityrus_O5m8eTmy5t7gkPak.450b56a8ef11328a','37.975833','23.718366','2016-01-25 10:22:25','0000-00-00 00:00:00','0000-00-00 00:00:00',2,1),(4,'s.cityrus_O5m8eTmy5t7gkPak.b3c80029176a7ec9','37.975821','23.718440','2016-01-25 10:40:57','0000-00-00 00:00:00','0000-00-00 00:00:00',9,1),(5,'s.cityrus_bOKPS5Sv8G8KR8WJ.23bc3fc9758b8f0','37.935394','23.647570','2016-01-25 12:27:30','0000-00-00 00:00:00','0000-00-00 00:00:00',6,4);
/*!40000 ALTER TABLE `devices_missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invites`
--

DROP TABLE IF EXISTS `invites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invites` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `message` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `clicked` tinyint(1) NOT NULL DEFAULT '0',
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `invites_user_id_foreign` (`user_id`),
  CONSTRAINT `invites_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invites`
--

LOCK TABLES `invites` WRITE;
/*!40000 ALTER TABLE `invites` DISABLE KEYS */;
/*!40000 ALTER TABLE `invites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `measurements`
--

DROP TABLE IF EXISTS `measurements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `measurements` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `value` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unit` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `latitude` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `longitude` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `observation_date` datetime DEFAULT NULL,
  `observation_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `measurements_observation_id_foreign` (`observation_id`),
  CONSTRAINT `measurements_observation_id_foreign` FOREIGN KEY (`observation_id`) REFERENCES `observations` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `measurements`
--

LOCK TABLES `measurements` WRITE;
/*!40000 ALTER TABLE `measurements` DISABLE KEYS */;
INSERT INTO `measurements` VALUES (1,'','location','test','test','37.9677467','23.7150592','2016-01-25 11:41:19',1,'2016-01-25 09:41:33','2016-01-25 09:41:33',NULL),(2,'','route','test','test','37.9677467','23.7150592','2016-01-25 11:48:10',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(3,'','route','test','test','37.9677467','23.7150592','2016-01-25 11:48:11',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(4,'','route','test','test','37.969718933105','23.715309143066','2016-01-25 11:48:36',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(5,'','route','test','test','37.972671508789','23.71675491333','2016-01-25 11:48:49',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(6,'','route','test','test','37.972682952881','23.718030929565','2016-01-25 11:49:00',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(7,'','route','test','test','37.972179412842','23.721063613892','2016-01-25 11:49:20',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(8,'','route','test','test','37.970149993896','23.722423553467','2016-01-25 11:49:37',2,'2016-01-25 09:50:00','2016-01-25 09:50:00',NULL),(9,'','location','test','test','37.9758333','23.7183657','2016-01-25 12:22:23',3,'2016-01-25 10:22:26','2016-01-25 10:22:26',NULL),(10,'','location','test','test','37.9758205','23.7184398','2016-01-25 12:40:55',4,'2016-01-25 10:41:03','2016-01-25 10:41:03',NULL),(11,'','route','test','test','37.9327735','23.6285133','2016-01-25 02:23:29',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(12,'','route','test','test','37.932773590088','23.628513336182','2016-01-25 02:23:30',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(13,'','route','test','test','37.930046081543','23.627901077271','2016-01-25 02:23:56',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(14,'','route','test','test','37.928565979004','23.629413604736','2016-01-25 02:24:08',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(15,'','route','test','test','37.929405212402','23.630535125732','2016-01-25 02:24:20',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(16,'','route','test','test','37.927406311035','23.631282806396','2016-01-25 02:24:33',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(17,'','route','test','test','37.926910400391','23.63418006897','2016-01-25 02:24:46',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(18,'','route','test','test','37.926971435547','23.636257171631','2016-01-25 02:24:57',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(19,'','route','test','test','37.928104400635','23.638492584229','2016-01-25 02:25:08',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(20,'','route','test','test','37.927375793457','23.639993667603','2016-01-25 02:25:19',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(21,'','route','test','test','37.928043365479','23.641969680786','2016-01-25 02:25:29',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(22,'','route','test','test','37.928413391113','23.643836975098','2016-01-25 02:25:41',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(23,'','route','test','test','37.930377960205','23.645477294922','2016-01-25 02:25:53',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(24,'','route','test','test','37.932685852051','23.645565032959','2016-01-25 02:26:04',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(25,'','route','test','test','37.933422088623','23.647243499756','2016-01-25 02:26:15',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL),(26,'','route','test','test','37.935394287109','23.647569656372','2016-01-25 02:26:26',5,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL);
/*!40000 ALTER TABLE `measurements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES ('2014_10_12_000000_create_users_table',1),('2014_10_12_100000_create_password_resets_table',1),('2015_10_26_132315_create_missions_table',1),('2015_11_16_130736_create_devices_table',1),('2015_11_17_125637_create_users_missions_table',1),('2015_11_20_165110_mission_add_radical_id_column',1),('2015_11_23_130156_create_observations_and_measurements_table',1),('2016_01_07_133542_create_suggested_missions_table',1),('2016_01_08_100123_create_invites_table',1),('2016_01_11_082038_create_points_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mission_types`
--

DROP TABLE IF EXISTS `mission_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mission_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mission_types`
--

LOCK TABLES `mission_types` WRITE;
/*!40000 ALTER TABLE `mission_types` DISABLE KEYS */;
INSERT INTO `mission_types` VALUES (1,'location'),(2,'route');
/*!40000 ALTER TABLE `mission_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `missions`
--

DROP TABLE IF EXISTS `missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `missions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `img_name` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  `type_id` int(10) unsigned NOT NULL,
  `radical_service_id` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `missions_radical_service_id_unique` (`radical_service_id`),
  KEY `missions_type_id_foreign` (`type_id`),
  CONSTRAINT `missions_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `mission_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `missions`
--

LOCK TABLES `missions` WRITE;
/*!40000 ALTER TABLE `missions` DISABLE KEYS */;
INSERT INTO `missions` VALUES (1,'Cafe/Bar προσβάσιμα σε ΑμεΑ','Ποιους χώρους μπορούν να απολαύσουν οι συμπολίτες μας με κινητικές αναπηρίες; Μοιραστείτε Cafe/Bar που είναι προσβάσιμα από ΑμεΑ. Η Αθήνα είναι όμορφη. Και πρέπει να την χαίρονται όλοι ανεξαιρέτως. Για τους συνανθρώπους μας με κινητικές αναπηρίες πρέπει ν',NULL,'2016-01-22 10:43:46','2016-01-22 10:43:46',NULL,1,'cityrus_O5m8eTmy5t7gkPak'),(2,'Διαδρομές και χώροι αναψυχής προσβάσιμοι από ΑμεΑ','Πού μπορούν να κινηθούν με το αναπηρικό αμαξίδιο οι συμπολίτες μας με κινητικές αναπηρίες; Ποιούς χώρους  αναψυχής μπορούν να επισκεφτούν; Τους ξέρετε; Πόσους από αυτούς επισκεφτήκατε και θέλετε να το μοιραστείτε; Καταγράψτε τις διαδρομές και τα Cafe/Bar ',NULL,'2016-01-22 10:43:47','2016-01-22 10:43:47',NULL,2,'cityrus_Ymew99uee5QC5OCS'),(3,'Όμορφες διαδρομές για περπάτημα','Ας απολαύσουμε βόλτες στην πόλη! Για ψώνια, για τη φανταστική θέα, για την ιστορία, για ρομαντζάδα, για να ονειρεύεστε... πού σας αρέσει να περπατάτε; Μοιραστείτε το για να μάθουμε και οι υπόλοιποι αυτά τα υπέροχα μέρη! Και μην ξεχάσετε να μάθετε για νέες',NULL,'2016-01-22 10:43:47','2016-01-22 10:43:47',NULL,2,'cityrus_CN3TL1WsjadDnbn8'),(4,'Όμορφες διαδρομές για τρέξιμο','Η κίνηση είναι ζωή! Το τρέξιμο στην πόλη είναι ολοένα για περισσότερους από εμάς ένας υπέροχος τρόπος να ηρεμήσουμε, να αδειάσουμε το μυαλό μας από έγνοιες, να γυμναστούμε, να αποκτήσουμε αντοχή... Τα οφέλη είναι πάμπολλα και δύσκολα περιγράφονται! Καταγρ',NULL,'2016-01-22 10:43:48','2016-01-22 10:43:48',NULL,2,'cityrus_bOKPS5Sv8G8KR8WJ'),(5,'Όμορφες διαδρομές για ποδηλασία','Το ποδήλατο είναι ελευθερία! Ποιες διαδρομές είναι ωραίες για ποδηλατοβόλτες; Πού σας αρέσει να πηγαίνετε με το ποδήλατο; Και μην ξεχάσετε να μάθετε για νέες διαδρομές για ποδήλατο που έχουν συνεισφέρει άλλοι χρήστες από το χάρτη.',NULL,'2016-01-22 10:43:49','2016-01-22 10:43:49',NULL,2,'cityrus_nYXEN8s8P4PYEcCz');
/*!40000 ALTER TABLE `missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `observations`
--

DROP TABLE IF EXISTS `observations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `observations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `device_uuid` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `latitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `longitude` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `observation_date` datetime DEFAULT NULL,
  `device_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `observations_device_id_foreign` (`device_id`),
  CONSTRAINT `observations_device_id_foreign` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `observations`
--

LOCK TABLES `observations` WRITE;
/*!40000 ALTER TABLE `observations` DISABLE KEYS */;
INSERT INTO `observations` VALUES (1,'s.cityrus_O5m8eTmy5t7gkPak.23bc3fc9758b8f0','37.9677467','23.7150592','2016-01-25 11:41:19',6,'2016-01-25 09:41:33','2016-01-25 09:41:33',NULL),(2,'s.cityrus_CN3TL1WsjadDnbn8.23bc3fc9758b8f0','37.970149993896','23.722423553467','2016-01-25 11:49:46',6,'2016-01-25 09:49:59','2016-01-25 09:49:59',NULL),(3,'s.cityrus_O5m8eTmy5t7gkPak.450b56a8ef11328a','37.9758333','23.7183657','2016-01-25 12:22:23',2,'2016-01-25 10:22:26','2016-01-25 10:22:26',NULL),(4,'s.cityrus_O5m8eTmy5t7gkPak.b3c80029176a7ec9','37.9758205','23.7184398','2016-01-25 12:40:55',9,'2016-01-25 10:41:03','2016-01-25 10:41:03',NULL),(5,'s.cityrus_bOKPS5Sv8G8KR8WJ.23bc3fc9758b8f0','37.935394287109','23.647569656372','2016-01-25 02:27:29',6,'2016-01-25 12:27:31','2016-01-25 12:27:31',NULL);
/*!40000 ALTER TABLE `observations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_resets`
--

LOCK TABLES `password_resets` WRITE;
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'web'),(2,'mobile');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suggested_missions`
--

DROP TABLE IF EXISTS `suggested_missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suggested_missions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `suggested_missions_user_id_foreign` (`user_id`),
  CONSTRAINT `suggested_missions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suggested_missions`
--

LOCK TABLES `suggested_missions` WRITE;
/*!40000 ALTER TABLE `suggested_missions` DISABLE KEYS */;
INSERT INTO `suggested_missions` VALUES (1,'CFgff',2,'2016-01-22 13:37:06','2016-01-22 13:37:06',NULL);
/*!40000 ALTER TABLE `suggested_missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_invite_points`
--

DROP TABLE IF EXISTS `user_invite_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_invite_points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `points` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `invite_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_invite_points_user_id_foreign` (`user_id`),
  KEY `user_invite_points_invite_id_foreign` (`invite_id`),
  CONSTRAINT `user_invite_points_invite_id_foreign` FOREIGN KEY (`invite_id`) REFERENCES `invites` (`id`),
  CONSTRAINT `user_invite_points_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_invite_points`
--

LOCK TABLES `user_invite_points` WRITE;
/*!40000 ALTER TABLE `user_invite_points` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_invite_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_observation_points`
--

DROP TABLE IF EXISTS `user_observation_points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_observation_points` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `points` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `mission_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_observation_points_user_id_foreign` (`user_id`),
  KEY `user_observation_points_mission_id_foreign` (`mission_id`),
  CONSTRAINT `user_observation_points_mission_id_foreign` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`),
  CONSTRAINT `user_observation_points_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_observation_points`
--

LOCK TABLES `user_observation_points` WRITE;
/*!40000 ALTER TABLE `user_observation_points` DISABLE KEYS */;
INSERT INTO `user_observation_points` VALUES (1,'10',6,1,'2016-01-25 09:41:34','2016-01-25 09:41:34',NULL),(2,'20',6,3,'2016-01-25 09:50:01','2016-01-25 09:50:01',NULL),(3,'10',7,1,'2016-01-25 10:22:27','2016-01-25 10:22:27',NULL),(4,'10',9,1,'2016-01-25 10:41:04','2016-01-25 10:41:04',NULL),(5,'20',6,4,'2016-01-25 12:27:32','2016-01-25 12:27:32',NULL);
/*!40000 ALTER TABLE `user_observation_points` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','test@scify.org','$2y$10$LsbzlxrDepiaBzQR470zb.YZUvqqBBl83O7IGpOgZDpTvunW1BEhC','Op9Xr36wtxLvORPXp5VAKkA6ryAT42oZhk3ZsSdv0QlPDL9HXHTya3yLSFCr','2016-01-22 10:43:46','2016-01-25 13:08:08'),(2,'χριστ','xrist.ven@gmail.com','$2y$10$d7s3P/C219aFTbPW4WDW..kx1MuguUaEs32ltJwI6xTzjuMaDTJUu',NULL,'2016-01-22 13:33:45','2016-01-22 13:33:45'),(3,'Nick','Nick@nick.nick','$2y$10$neviG9qdLopxPCJpGeOcm.T4qrpZKRaEEgTrWJO66jpihhp2WqX0O',NULL,'2016-01-22 13:42:13','2016-01-22 13:42:13'),(4,'giannis','jkalimer13@gmail.com','$2y$10$voQ6m3S1SiI.bpQ118KKyevxlX106.0fWUJ4ncmbMQ0MUSXAbTjQC',NULL,'2016-01-22 23:09:01','2016-01-22 23:09:01'),(5,'Test','Test@test.test','$2y$10$3CZ6g6QmeE.3261PF19K.eTN9L6QVnK2lVEQFY9/jN9q057gL.oxi',NULL,'2016-01-25 08:31:21','2016-01-25 08:31:21'),(6,'xrist','test@tt.gr','$2y$10$hFZtICMjkRPcJkNtkUa3tuI9kKxHYzaBUIb3cz580C3I9EsguwpzO',NULL,'2016-01-25 09:41:19','2016-01-25 09:41:19'),(7,'zte','zte@tt.tt','$2y$10$hzOeP.YFjVasUcq.a1VWhO4aSg/TJ6JHD2XR/vrf82lfBptcyWa7u',NULL,'2016-01-25 09:43:15','2016-01-25 09:43:15'),(8,'alex','alex@a.aa','$2y$10$a4cFZwABQG6UStRsOkGDr.u9LrOuPlRrutmC007ZzDWHNDi5SJk6i',NULL,'2016-01-25 10:28:52','2016-01-25 10:28:52'),(9,'Aris','aris@aris.gr','$2y$10$iEbfP.9qSr8Kiesh3XbSiOQ7Yg1gdvtB8ocQkdl.9U4Zh5LpPOKdG',NULL,'2016-01-25 10:34:14','2016-01-25 10:34:14'),(10,'Tt','Tt@tt.tt','$2y$10$gN/aedDLhEallXgf5DlLneunMTAi.Nyfq4G3CGM.ajgcI46CXHPMC',NULL,'2016-01-25 11:45:22','2016-01-25 11:45:22');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_missions`
--

DROP TABLE IF EXISTS `users_missions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_missions` (
  `user_id` int(10) unsigned NOT NULL,
  `mission_id` int(10) unsigned NOT NULL,
  KEY `users_missions_user_id_foreign` (`user_id`),
  KEY `users_missions_mission_id_foreign` (`mission_id`),
  CONSTRAINT `users_missions_mission_id_foreign` FOREIGN KEY (`mission_id`) REFERENCES `missions` (`id`),
  CONSTRAINT `users_missions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_missions`
--

LOCK TABLES `users_missions` WRITE;
/*!40000 ALTER TABLE `users_missions` DISABLE KEYS */;
INSERT INTO `users_missions` VALUES (6,1),(6,3),(7,1),(9,1),(6,4);
/*!40000 ALTER TABLE `users_missions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_roles`
--

DROP TABLE IF EXISTS `users_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_roles` (
  `user_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  KEY `users_roles_user_id_foreign` (`user_id`),
  KEY `users_roles_role_id_foreign` (`role_id`),
  CONSTRAINT `users_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `users_roles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` VALUES (2,2),(3,2),(4,2),(5,2),(6,2),(7,2),(8,2),(9,2),(10,2);
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-25 13:12:18

-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: localhost    Database: chasingnostalgia
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chasingblogs`
--

DROP TABLE IF EXISTS `chasingblogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chasingblogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` date NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `preview_text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chasingblogs`
--

LOCK TABLES `chasingblogs` WRITE;
/*!40000 ALTER TABLE `chasingblogs` DISABLE KEYS */;
INSERT INTO `chasingblogs` VALUES (23,'Grand Reopening!','Howdy folks! Come check out our reopening this week. We\'ve EXPANDED to the store next to us! We now have much more vendors for people to find everything they\'re looking for!\r\n\r\nThis means we\'re ~ looking for new vendors ~\r\nSo please send us an email at chasingnolstagia@gmail.com to reserve a spot before they\'re gone!\r\n\r\nOutside we will have:\r\n- Love Morgue\r\n- Hate Morgue\r\n- Sad Morgue\r\n- Envious Morgue\r\n- Greedy Morgue\r\n- Morgue Tacos\r\n- Morgue Burgers\r\n- Gemzies\r\n- Video Game Vendor\r\n.. & MUCH MORE!!!','2024-10-01','/uploads/blogs/1725003819667-blog1-photo.jpg','We\'re having a grand reopening for our store expansion!','2024-08-30 07:43:39','2024-09-03 20:13:42');
/*!40000 ALTER TABLE `chasingblogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chasingevents`
--

DROP TABLE IF EXISTS `chasingevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chasingevents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `preview_text` text DEFAULT NULL,
  `title_photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chasingevents`
--

LOCK TABLES `chasingevents` WRITE;
/*!40000 ALTER TABLE `chasingevents` DISABLE KEYS */;
INSERT INTO `chasingevents` VALUES (1,'Scooby-Doo! 2024 Halloween Event','2024-10-31','10:00:00','Ruh-roh! It\'s spooky season and the ghouls are out! Come check out our scary vendors, take photos on the hay bales, and participate in our Scooby-Doo! Costume Contest (winner gets $100 store credit!)\r\n\r\nWe will be showing Scooby-Doo movies inside the building with complimentary popcorn.\r\n\r\nLook around and fine hidden zombie tokens to redeem for a prize!\r\n\r\nCome down on October 31st, 2024!','/uploads/events/1724209250000-scoobydoo-event.png','Visit us at our Scooby-Doo! Movie Fest and Costume Contest!','/uploads/events/1724209300000-scoobydoo-event-title'),(3,'Christmas','2024-12-25','12:30:00','Christmas','/uploads/events/1724284581143-gemzies-banner.png','Come check out our Christmas Event! Free hot chocolate for the kids! 40+ confirmed vendors!','/uploads/events/1724209350000-christmas-event-title');
/*!40000 ALTER TABLE `chasingevents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guestvendors`
--

DROP TABLE IF EXISTS `guestvendors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `guestvendors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `guestavatar` varchar(255) NOT NULL,
  `guestphoto` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `schedule` text NOT NULL,
  `break` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guestvendors`
--

LOCK TABLES `guestvendors` WRITE;
/*!40000 ALTER TABLE `guestvendors` DISABLE KEYS */;
INSERT INTO `guestvendors` VALUES (1,'Apprentice Danny','/uploads/vendors/guests/apprentice-thumbnail.png','/uploads/vendors/guests/apprentice-photo.png','$20 Apprentice Flash Tattoos','Open from 1:30 PM to 5:00 PM',0);
/*!40000 ALTER TABLE `guestvendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendorshops`
--

DROP TABLE IF EXISTS `vendorshops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendorshops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(6) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'images/avatar.png',
  `vendorphoto` varchar(255) DEFAULT NULL,
  `datecreated` date NOT NULL DEFAULT curdate(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendorshops`
--

LOCK TABLES `vendorshops` WRITE;
/*!40000 ALTER TABLE `vendorshops` DISABLE KEYS */;
INSERT INTO `vendorshops` VALUES (11,'Love Morgue','The one and only! Custom made graffiti and safety pin hats, ties, masks and so much more!','10A','Clothing','/uploads/vendors/1724206564095-lovemorgue-1.png','/uploads/vendors/1724207434908-lovemorgue-2.png','2023-12-01'),(12,'Fleaboard Skate Shop','Secondhand Skate & Thrift Shop! Skatewear and accessories\n\n@fleaboardshop on Instagram','1A','Skateboards','/uploads/vendors/1724209350000-fleaboardshop-1.png',NULL,'2024-09-01'),(13,'Gemzies Treasures','Handmade jewelry, art and more! based in the Bay Area\r\n\r\n@gemzies.treasure on Instagram\r\n@gemzies.treasure on Etsy','9A','Jewelry','/uploads/vendors/1724284581143-gemziestreasure-1.png',NULL,'2024-09-02'),(14,'Chasing Nostalgia','Checking AGAIN!','FRONT','Clothing','/uploads/vendors/1724209100000-chasingnostalgia-1.png',NULL,'2023-09-01'),(15,'Buck Lucky','Custom mad beautiful clothes for beautiful people! Come get find something lucky!\n\n@bucklucky on Instagram','5A','Fashion','/uploads/vendors/1724209100000-bucklucky1.png',NULL,'2024-08-02'),(16,'DVLSH','Sustainable Satanic Clothing\r\nSustainable Satanic Clothing\r\nSustainable Satanic Clothing\r\n\r\n@dvlsh on Instagram','3A','Clothing','/uploads/vendors/1724209100000-dvlish1.png',NULL,'2024-07-04'),(17,'Cherry on Top','Nonconformists to the core, they sell custom patches, ripped apparel, and punk accessories that scream defiance.','2A','Clothing','/uploads/vendors/1724209100000-cherryontop1.png',NULL,'2024-09-03'),(18,'Superinsaiyanfinds','Sick streetwear, vintage clothing & toys! Always stocking the store with something new.','7A','Clothing','/uploads/vendors/1724209100000-supersaiynfinds1.png',NULL,'2024-09-03'),(19,'The Lemonheads','The Lemonheads 🍋\n--THRIFT WITH A TWIST--\nOffering sustainable thrift and threds.\nCome shop our booth @chasingnostalgia__ off McHenry and Leveland behind the Nations Giant Burger in Modesto. See you there!','8A','Clothing','/uploads/vendors/1724209100000-lemonheadsthrift1.png',NULL,'2024-09-03'),(20,'GAMERB0YZ','Cloaked in secrecy, this vendor\'s goods are rare finds that you can only discover here. From cloaks to hidden trinkets, each item has a story.','6A','Video Games','/uploads/vendors/172420910000-gamerb0yz1.png',NULL,'2024-09-03'),(21,'Ambition Thrift','Favorite lesbian love couple with beautifully custom made waist beads, clothes and more!','4A','Fashion','/uploads/vendors/1724209100000-ambitionthrift1.png',NULL,'2024-05-05'),(22,'Retro Nani209','Front row shop! Plenty of stuff from Video Games, Vintage Merch, Magazines and Action Figures! Come check us out.','11A','Video Games','/uploads/vendors/1724209100000-retronani2091.png',NULL,'2024-07-17'),(23,'Test Vendor','Test Vendor','FRONT','Clothing','/uploads/vendors/1725677095396-lovemorgue-hat-1.png','/uploads/vendors/1725677095400-yapperlogo.png','2024-09-06'),(24,'Danny Duncan','YouTuber','11A','Test','/uploads/vendors/1725678017594-lovemorgue-tshirt-1.png','/uploads/vendors/1725678017598-lovemorgue-hat-2.png','2024-09-06');
/*!40000 ALTER TABLE `vendorshops` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-09-14 17:04:16

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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `preview_text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title_photo` varchar(255) DEFAULT NULL,
  `tickets_enabled` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chasingevents`
--

LOCK TABLES `chasingevents` WRITE;
/*!40000 ALTER TABLE `chasingevents` DISABLE KEYS */;
INSERT INTO `chasingevents` VALUES (1,'Scooby-Doo! 2024 Halloween Eventt','2024-10-31','10:00:00','Ruh-roh! It\'s spooky season and the ghouls are out! Come check out our scary vendors, take photos on the hay bales, and participate in our Scooby-Doo! Costume Contest (winner gets $100 store credit!)\n\nWe will be showing Scooby-Doo movies inside the building with complimentary popcorn.\n\nLook around and fine hidden zombie tokens to redeem for a prize!\n\nCome down on October 31st, 2024!','/uploads/events/1724209250000-scoobydoo-event.png','Visit us at our Scooby-Doo! Movie Fest and Costume Contest!','/uploads/events/1724209300000-scoobydoo-event-title',0),(5,'Private Dinner - Best Dressed!','2024-10-25','18:30:00','CHASING NOSTALGIA PRESENTS (our first):\nBEST DRESSED PRIVATE DINNER w/ @goselog_ 🇵🇭🤤\n\nSATURDAY / OCTOBER 5TH 🍂\n\n--~~oooOOOO@@@@@@@@@@@@@@OOOOooo~~--\n\nFILIPINO CUISINE\n*VEGETARIAN & NON-VEGETARIAN OPTIONS*\n\n- BEST DRESSED AWARDS 🎖️😻😉🤭\n- PHOTO OPS OF CHASING NOSTALGIA’S ART INSTALLATION @ 4:30PM\n- DINNER TO COMMENCE AT APPROXIMATELY 5:30PM\n\nYOU WON’T WANT TO MISS SUCH AN EVENTFUL AND DELICIOUS EVENING 💜💚😋 ','/uploads/events/1727906625614-bestdressed-dinner.jpg','Chasing Nostalgia\'s (first ever) Dinner Party!','/uploads/events/preview-dinnerparty.png',1),(6,'\'House Show\' Parking Lot Concert','2024-10-18','09:00:00','CHASING NOSTALGIA HOUSE SHOW 💀🎤⚡️🖤\nLIVE PERFORMANCES BY:\nDAVE WONT DIE\nTYLER LAFORCE\nROMANTICO\nAMAZON CRIMES\n& JUNEBUG\n🖤🤘\n\n10/4/24\nDOORS @ 5PM\nTUNES AROUND 6PM\nCOOL LOCAL VENDORS\nART WALK BEFORE 2-4PM\n•\n•\na special thank you to @lovemorgue for helping put this event together 🖤 luv u 2 death','/uploads/events/1727910404935-oct4-houseshow.jpg','CHASING NOSTALGIA HOUSE SHOW 💀🎤⚡️🖤','/uploads/events/1727910404940-chasingnostalgia-logo3.png',1);
/*!40000 ALTER TABLE `chasingevents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_code_usages`
--

DROP TABLE IF EXISTS `discount_code_usages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_code_usages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discount_code_id` int(11) NOT NULL,
  `ticket_purchase_id` int(11) NOT NULL,
  `user_email` varchar(255) DEFAULT NULL,
  `used_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `discount_code_id` (`discount_code_id`),
  KEY `ticket_purchase_id` (`ticket_purchase_id`),
  CONSTRAINT `discount_code_usages_ibfk_1` FOREIGN KEY (`discount_code_id`) REFERENCES `discount_codes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `discount_code_usages_ibfk_2` FOREIGN KEY (`ticket_purchase_id`) REFERENCES `ticket_purchases` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_code_usages`
--

LOCK TABLES `discount_code_usages` WRITE;
/*!40000 ALTER TABLE `discount_code_usages` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount_code_usages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_codes`
--

DROP TABLE IF EXISTS `discount_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_codes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `discount_percentage` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `expires_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_codes`
--

LOCK TABLES `discount_codes` WRITE;
/*!40000 ALTER TABLE `discount_codes` DISABLE KEYS */;
INSERT INTO `discount_codes` VALUES (1,'SAVE20','20% off on your next purchase',20,1,'2024-12-31 23:59:59','2024-10-07 14:02:54','2024-10-07 14:02:54');
/*!40000 ALTER TABLE `discount_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_ticket_types`
--

DROP TABLE IF EXISTS `event_ticket_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event_ticket_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `event_id` int(11) NOT NULL,
  `ticket_type` varchar(255) NOT NULL,
  `ticket_description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `available_tickets` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_ticket_types_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `chasingevents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_ticket_types`
--

LOCK TABLES `event_ticket_types` WRITE;
/*!40000 ALTER TABLE `event_ticket_types` DISABLE KEYS */;
INSERT INTO `event_ticket_types` VALUES (1,1,'General Admission','Includes free drinks and seating',20.00,0,'2024-10-07 16:49:39'),(2,1,'VIP Access','Includes 2 free drinks and seating',50.00,0,'2024-10-07 16:49:39'),(3,5,'3-Course Dinner!','The basic ticket for a wonderful 3-course meal provided by, Mario!\n\nTesting more text and see how long it goes',100.00,12,'2024-10-07 16:49:39'),(4,5,'5-Course Dinner!','For supporting us more you get an additional TWO courses!',150.00,1,'2024-10-07 16:49:39'),(5,6,'Early Bird Ticket','Includes free drinks and seating',10.00,29,'2024-10-07 16:49:39'),(6,6,'Regular Ticket','Includes free drinks and seating',20.00,49,'2024-10-07 16:49:39'),(7,6,'Backstage Pass','Includes free drinks and seating',75.00,8,'2024-10-07 16:49:39');
/*!40000 ALTER TABLE `event_ticket_types` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guestvendors`
--

LOCK TABLES `guestvendors` WRITE;
/*!40000 ALTER TABLE `guestvendors` DISABLE KEYS */;
INSERT INTO `guestvendors` VALUES (1,'Apprentice Danny','/uploads/vendors/guests/apprentice-thumbnail.png','/uploads/vendors/guests/apprentice-photo.png','$20 Apprentice Flash Tattoos','Open from 10:00 AM to 5:00 PM',0);
/*!40000 ALTER TABLE `guestvendors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scraped_posts`
--

DROP TABLE IF EXISTS `scraped_posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scraped_posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `post_id` text NOT NULL,
  `caption` text DEFAULT NULL,
  `media_url` text DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `scrape_date` datetime DEFAULT NULL,
  `video_url` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_id` (`post_id`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scraped_posts`
--

LOCK TABLES `scraped_posts` WRITE;
/*!40000 ALTER TABLE `scraped_posts` DISABLE KEYS */;
INSERT INTO `scraped_posts` VALUES (106,'lovemorgue','C9BsaGQRmpM','fuck amerikkka! today we wanted 2 drop a fundraiser airbrush tee to raise urgent evacuation funds for families who have reached out for help. Each tee is $60, $50 of that will be going directly to gofundmes for these families, the rest covering production cost. We have five slots open in all sizes (& will put more as we go!) THANK YOU SO MUCH AND GO DONATE TO THE FAMILIES LINKED IN OUR BIO 🖤❤️🤍💚','C9BsaGQRmpM_0.jpg,C9BsaGQRmpM_1.jpg','2024-07-05 03:47:48','2024-09-21 19:55:44',NULL),(107,'lovemorgue','Czxt9t8ONBa','here 2 scream LAND BACK 4 all indigenous ppl, all Palestinians, the Congolese, and all the tons of disenfranchised people worldwide going through silent genocides and colonialism STILL. land back is not a threat but a fucking right ! a necessity for functioning on behalf of the earth and all life! LAND BACK IS THE ONLY WAY 4 THE FUTURE! Fuck compliance, fuck neutrality, fuck standing by while genocide is all around us and we are directly funding it and paying taxes that make it possible. \n\nworkin on producing a zine w resources, local aid, basic ideas & all that to put everywhere we can so send us any good info if u know any! much luv <3','Czxt9t8ONBa_0.jpg,Czxt9t8ONBa_1.jpg','2023-11-18 06:11:00','2024-09-21 19:55:46',NULL),(108,'chasingnostalgia__','C_u_15ePNa7','Come out Sep 29th for the next installment of the Suikomi series! $15 entry fee per game, double elimination bracket with $100 pot bonuses per game title!','C_u_15ePNa7.jpg','2024-09-10 11:06:14','2024-09-21 19:55:52',NULL),(113,'chasingnostalgia__','C_T_UeNyMWQ','You don’t have much time left 👀 #theendisnear #smallbusiness #smallbusinessowner #modesto #mchenry #storeclosing #costruction #expansion #thrift #thriftstore #thriftshop #secondhand','C_T_UeNyMWQ_thumbnail.jpg','2024-08-30 23:24:27','2024-09-22 12:13:48','C_T_UeNyMWQ.mp4'),(114,'lovemorgue','C_oUtpRSw5v','some stuff available on our depop !!!! stay tuned 4 more …','C_oUtpRSw5v_thumbnail.jpg','2024-09-07 20:55:12','2024-09-26 14:16:38','C_oUtpRSw5v.mp4'),(116,'lovemorgue','DAcSUGxS8mn','✭ ✭ ✭WANT A CUSTOM DESIGNED AIRBRUSH TEE FOR JUST $5 ???? ✭ ✭ ✭\nwe can make ur dreams come true … \nenter our $5 raffle for a chance to win a custom airbrush shirt by us! \n$5 = 1 entry $10 = 3 entries . include your instagram handle or name/ number when sending to unluckydreams on Venmo! \n ☆ ☆ ☆\n1st prize will receive: A CUSTOM COLOR AIRBRUSH SHIRT OF THEIR CHOICE IN ANY SIZE OR STYLE ! ($50+ value) and other goodies!\n \n2nd prize will receive: A CUSTOM BLACK AND WHITE AIRBRUSH TEE OR SCREEN PRINTED TEE and other goodies!\n\n ☆ ENDS ON 10/4 WINNER WILL BE CHOSEN FOLLOWING DAY! ☆\n\nVenmo, zelle, and other payments accepted if needed, just message us (; \n\n#giveaway #airbrush #custom #raffle #luvu2thedeath','DAcSUGxS8mn_0.jpg,DAcSUGxS8mn_1.jpg,DAcSUGxS8mn_2.jpg','2024-09-28 01:13:28','2024-10-01 01:50:20',NULL),(117,'lovemorgue','C-1FEiJS8EM','OUR DAY IN CHASING NOSTALGIA!!! (it was so cool 2 chill n play shop simulator this last Thursday! ) \n\nwe r running a 20% SALE the rest of the month until we close for remodel! come in and say bye 2 chasing as u know it and grab something you’ll love 2 the death! \n\nif u wanna come see us again, we’ll be in store Thursday! don’t miss ur chance to shop chasing this month!','C-1FEiJS8EM_thumbnail.jpg','2024-08-18 23:18:20','2024-10-01 02:01:36','C-1FEiJS8EM.mp4'),(118,'lovemorgue','C9N6eACS-5G','✮ LOVEMORGUE X POISONGRL ZINE SPRING/SUMMER 24 ✮ \n\nso unbelievably honored 2 b featured in this issue along with some of the baddest bitches n baddest artists!!!! life is unreal 🍓🐞','C9N6eACS-5G_0.jpg,C9N6eACS-5G_1.jpg,C9N6eACS-5G_2.jpg','2024-07-09 21:41:33','2024-10-01 02:02:08',NULL),(119,'lovemorgue','C9BlWLExGA_','✭ MORE MORG AVAILABLE ON THE SITE!!! these designs + more made 2 order in all sizes!! LINK IN OUR BIO ✭\n\nuse code ILUVMORG for free shipping on orders over $50 <3 \n\nspecial thanks 2 models @tylerlaforce209 & @mywrld.444 ! tag us in ur pics/ send them in for a chance 2 be on the page <3\n\nif there’s any design you’ve seen us do that isn’t on the site, hit us up and we will put it up!','C9BlWLExGA__0.jpg,C9BlWLExGA__1.jpg,C9BlWLExGA__2.jpg','2024-07-05 02:46:05','2024-10-01 02:03:16',NULL),(120,'lovemorgue','C8h9seuSIiu','☆☆☆LIVE ON OUR SITE NOW! LINK IN OUR BIO OR VISIT WWW.LOVEMORGUE.COM 💻 ☆☆☆ \n\nfirst three orders get special gifts to celebrate this official drop!','C8h9seuSIiu_0.jpg,C8h9seuSIiu_1.jpg,C8h9seuSIiu_2.jpg','2024-06-22 20:03:09','2024-10-01 02:04:38',NULL),(121,'chasingnostalgia__','DAgzhyryx7U','WE’RE BAAACCCKK!🤪 *well, almost 😉* \n\nWe’ve made you wait long enough… so I guess we’ll finally tell you … if you REALLLLYYY want to know …. \n\nWE WILL BE REOPENING OUR NEWLY EXPANDED HOME AWAY FROM HOME \non OCTOBER 12TH 💜💚\nAND WILL BE CELEBRATING WITH A GRAND REOPENING PARKING LOT POP UP EVENT 🥳 \n\nOctober 12th will be the first day we are open to the public for retail but be sure to keep an eye out for the other fun activities we have in store for you all in the meantime! 🤗 \n\nSEE YOU ALL SOON 🥰😘🤪 \n•\n•\n•\n•\n#chasingnostalgia #wereback #grandreopening #expansionpack','DAgzhyryx7U.jpg','2024-10-01 00:05:00','2024-10-01 02:04:57',NULL),(122,'chasingnostalgia__','DAjV8iWy61c','Part 2 will definitely be worth the wait 👀 #spiderman #opening #grandopening #construction #expansion #secondhand #thrift #thrifting','DAjV8iWy61c_thumbnail.jpg','2024-09-30 19:07:07','2024-10-01 02:08:16','DAjV8iWy61c.mp4'),(123,'chasingnostalgia__','DAhE7kONhZ5','What if 👀 #construction #expansion #secondhand #thrift #shoplocal #shopsmall #supportlocal #modesto #chasingnostalgia','DAhE7kONhZ5_thumbnail.jpg','2024-09-29 21:58:57','2024-10-01 02:13:14','DAhE7kONhZ5.mp4');
/*!40000 ALTER TABLE `scraped_posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ticket_purchases`
--

DROP TABLE IF EXISTS `ticket_purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ticket_purchases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `event_id` int(11) NOT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `total_paid` decimal(10,2) NOT NULL,
  `stripe_fee` decimal(10,2) DEFAULT NULL,
  `tax_amount` decimal(10,2) DEFAULT NULL,
  `net_payment` decimal(10,2) DEFAULT NULL,
  `confirm_email` tinyint(1) DEFAULT 0,
  `purchase_date` datetime DEFAULT current_timestamp(),
  `confirmation_code` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ticket_purchases`
--

LOCK TABLES `ticket_purchases` WRITE;
/*!40000 ALTER TABLE `ticket_purchases` DISABLE KEYS */;
INSERT INTO `ticket_purchases` VALUES (22,'Matthew','Wattson','haydencjanes@gmail.com','2095521564',6,'\'House Show\' Parking Lot Concert',1,10.00,NULL,NULL,NULL,1,'2024-10-07 16:19:34',')3qaKkvUuM'),(24,'Kevin','Hart','haydencjanes@gmail.com','2095521564',6,'Backstage Pass',2,150.00,NULL,NULL,NULL,0,'2024-10-07 17:54:20','jDGe9lT0gb'),(27,'Ned','Janes','haydencjanes@gmail.com','2095521564',6,'Early Bird Ticket',1,10.00,NULL,NULL,NULL,1,'2024-10-07 23:48:07','lvpEx9!PwA');
/*!40000 ALTER TABLE `ticket_purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendorshops`
--

DROP TABLE IF EXISTS `vendorshops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendorshops` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(6) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'images/avatar.png',
  `vendorphoto` varchar(255) DEFAULT NULL,
  `datecreated` date NOT NULL DEFAULT curdate(),
  `website_url` varchar(255) NOT NULL,
  `instagram_username` varchar(255) NOT NULL,
  `etsy` varchar(255) DEFAULT NULL,
  `sale` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendorshops`
--

LOCK TABLES `vendorshops` WRITE;
/*!40000 ALTER TABLE `vendorshops` DISABLE KEYS */;
INSERT INTO `vendorshops` VALUES (11,'Love Morgue','The one and only! Custom made graffiti and safety pin hats, ties, masks and so much more!','1A','Clothing','/uploads/vendors/1724206564095-lovemorgue-1.png','/uploads/vendors/1724207434908-lovemorgue-2.png','2023-12-01','www.lovemorgue.com','lovemorgue',NULL,1),(12,'Fleaboard Skate Shop','Secondhand Skate & Thrift Shop! Skatewear and accessories\n\n@fleaboardshop on Instagram','2A','Skateboards','/uploads/vendors/1724209350000-fleaboardshop-1.png',NULL,'2024-09-01','','',NULL,0),(13,'Gemzies Treasures','Handmade jewelry, art and more! based in the Bay Area\r\n\r\n@gemzies.treasure on Instagram\r\n@gemzies.treasure on Etsy','3C','Jewelry','/uploads/vendors/1724284581143-gemziestreasure-1.png',NULL,'2024-09-02','','@gem.zies',NULL,0),(14,'Chasing Nostalgia','The one and only!','6A','Clothing','/uploads/vendors/1724209100000-chasingnostalgia-1.png','/uploads/vendors/banner-placeholder-2.png','2023-09-01','www.chasingnostalgia.com','chasingnostalgia__',NULL,0),(15,'Buck Lucky','Custom mad beautiful clothes for beautiful people! Come get find something lucky!\r\n\r\n@bucklucky on Instagram','5A','Clothing','/uploads/vendors/1724209100000-bucklucky1.png',NULL,'2024-08-02','','',NULL,0),(16,'DVLSH','Sustainable Satanic Clothing\r\nSustainable Satanic Clothing\r\nSustainable Satanic Clothing\r\n\r\n@dvlsh on Instagram','7A','Clothing','/uploads/vendors/1724209100000-dvlish1.png',NULL,'2024-07-04','','',NULL,0),(17,'🍒 Cherry on Top 🍒','Nonconformists to the core, they sell custom patches, ripped apparel, and punk accessories that scream defiance.','3A','Clothing','/uploads/vendors/1724209100000-cherryontop1.png','/uploads/vendors/1727810819355-banner-placeholder-2.png','2024-09-03','www.cherryontop.com','chasingnostalgia__',NULL,0),(18,'Superinsaiyanfinds','Sick streetwear, vintage clothing & toys! Always stocking the store with something new.','8C','Clothing','/uploads/vendors/1724209100000-supersaiynfinds1.png',NULL,'2024-09-03','','',NULL,0),(19,'The Lemonheads','The Lemonheads 🍋\r\n--THRIFT WITH A TWIST--\r\nOffering sustainable thrift and threds.\r\nCome shop our booth @chasingnostalgia__ off McHenry and Leveland behind the Nations Giant Burger in Modesto. See you there!','8A','Clothing','/uploads/vendors/1724209100000-lemonheadsthrift1.png',NULL,'2024-09-03','','',NULL,0),(20,'GAMERB0YZ','Cloaked in secrecy, this vendor\'s goods are rare finds that you can only discover here. From cloaks to hidden trinkets, each item has a story.','10A','Video Games','/uploads/vendors/172420910000-gamerb0yz1.png',NULL,'2024-09-03','','',NULL,1),(21,'Ambition Thrift','Favorite lesbian love couple with beautifully custom made waist beads, clothes and more!','4A','Fashion','/uploads/vendors/1724209100000-ambitionthrift1.png',NULL,'2024-05-05','','',NULL,0),(22,'Retro Nani209','Front row shop! Plenty of stuff from Video Games, Vintage Merch, Magazines and Action Figures! Come check us out.','12A','Video Games','/uploads/vendors/1724209100000-retronani2091.png',NULL,'2024-07-17','','',NULL,0),(42,'Valley3DPrints','3D Printing Company','13A','Electronics','/uploads/vendors/1726685522656-Valley-3d-FINAL.png','/uploads/vendors/1726685522659-Untitl3ed.png','2024-09-18','','valley3dprints',NULL,1);
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

-- Dump completed on 2024-10-13 12:15:37

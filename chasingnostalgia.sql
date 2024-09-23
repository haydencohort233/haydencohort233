-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 24, 2024 at 01:44 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `chasingnostalgia`
--

-- --------------------------------------------------------

--
-- Table structure for table `chasingblogs`
--

CREATE TABLE `chasingblogs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `date` date NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `preview_text` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chasingblogs`
--

INSERT INTO `chasingblogs` (`id`, `title`, `content`, `date`, `photo_url`, `preview_text`, `created_at`, `updated_at`) VALUES
(23, 'Grand Reopening!', 'Howdy folks! Come check out our reopening this week. We\'ve EXPANDED to the store next to us! We now have much more vendors for people to find everything they\'re looking for!\r\n\r\nThis means we\'re ~ looking for new vendors ~\r\nSo please send us an email at chasingnolstagia@gmail.com to reserve a spot before they\'re gone!\r\n\r\nOutside we will have:\r\n- Love Morgue\r\n- Hate Morgue\r\n- Sad Morgue\r\n- Envious Morgue\r\n- Greedy Morgue\r\n- Morgue Tacos\r\n- Morgue Burgers\r\n- Gemzies\r\n- Video Game Vendor\r\n.. & MUCH MORE!!!', '2024-10-01', '/uploads/blogs/1725003819667-blog1-photo.jpg', 'We\'re having a grand reopening for our store expansion!', '2024-08-30 07:43:39', '2024-09-03 20:13:42');

-- --------------------------------------------------------

--
-- Table structure for table `chasingevents`
--

CREATE TABLE `chasingevents` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `description` text NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `preview_text` text DEFAULT NULL,
  `title_photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chasingevents`
--

INSERT INTO `chasingevents` (`id`, `title`, `date`, `time`, `description`, `photo_url`, `preview_text`, `title_photo`) VALUES
(1, 'Scooby-Doo! 2024 Halloween Eventt', '2024-10-31', '10:00:00', 'Ruh-roh! It\'s spooky season and the ghouls are out! Come check out our scary vendors, take photos on the hay bales, and participate in our Scooby-Doo! Costume Contest (winner gets $100 store credit!)\n\nWe will be showing Scooby-Doo movies inside the building with complimentary popcorn.\n\nLook around and fine hidden zombie tokens to redeem for a prize!\n\nCome down on October 31st, 2024!', '/uploads/events/1724209250000-scoobydoo-event.png', 'Visit us at our Scooby-Doo! Movie Fest and Costume Contest!', '/uploads/events/1724209300000-scoobydoo-event-title'),
(3, 'Christmas', '2024-12-25', '12:30:00', 'Christmas', '/uploads/events/1724284581143-gemzies-banner.png', 'Come check out our Christmas Event! Free hot chocolate for the kids! 40+ confirmed vendors!', '/uploads/events/1724209350000-christmas-event-title');

-- --------------------------------------------------------

--
-- Table structure for table `guestvendors`
--

CREATE TABLE `guestvendors` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `guestavatar` varchar(255) NOT NULL,
  `guestphoto` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `schedule` text NOT NULL,
  `break` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guestvendors`
--

INSERT INTO `guestvendors` (`id`, `name`, `guestavatar`, `guestphoto`, `description`, `schedule`, `break`) VALUES
(1, 'Apprentice Danny', '/uploads/vendors/guests/apprentice-thumbnail.png', '/uploads/vendors/guests/apprentice-photo.png', '$20 Apprentice Flash Tattoosss', 'Open from 10:00 AM to 5:00 PM', 0);

-- --------------------------------------------------------

--
-- Table structure for table `scraped_posts`
--

CREATE TABLE `scraped_posts` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `post_id` text NOT NULL,
  `caption` text DEFAULT NULL,
  `media_url` text DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  `scrape_date` datetime DEFAULT NULL,
  `video_url` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `scraped_posts`
--

INSERT INTO `scraped_posts` (`id`, `username`, `post_id`, `caption`, `media_url`, `timestamp`, `scrape_date`, `video_url`) VALUES
(106, 'lovemorgue', 'C9BsaGQRmpM', 'fuck amerikkka! today we wanted 2 drop a fundraiser airbrush tee to raise urgent evacuation funds for families who have reached out for help. Each tee is $60, $50 of that will be going directly to gofundmes for these families, the rest covering production cost. We have five slots open in all sizes (& will put more as we go!) THANK YOU SO MUCH AND GO DONATE TO THE FAMILIES LINKED IN OUR BIO 🖤❤️🤍💚', 'C9BsaGQRmpM_0.jpg,C9BsaGQRmpM_1.jpg', '2024-07-05 03:47:48', '2024-09-21 19:55:44', NULL),
(107, 'lovemorgue', 'Czxt9t8ONBa', 'here 2 scream LAND BACK 4 all indigenous ppl, all Palestinians, the Congolese, and all the tons of disenfranchised people worldwide going through silent genocides and colonialism STILL. land back is not a threat but a fucking right ! a necessity for functioning on behalf of the earth and all life! LAND BACK IS THE ONLY WAY 4 THE FUTURE! Fuck compliance, fuck neutrality, fuck standing by while genocide is all around us and we are directly funding it and paying taxes that make it possible. \n\nworkin on producing a zine w resources, local aid, basic ideas & all that to put everywhere we can so send us any good info if u know any! much luv <3', 'Czxt9t8ONBa_0.jpg,Czxt9t8ONBa_1.jpg', '2023-11-18 06:11:00', '2024-09-21 19:55:46', NULL),
(108, 'chasingnostalgia__', 'C_u_15ePNa7', 'Come out Sep 29th for the next installment of the Suikomi series! $15 entry fee per game, double elimination bracket with $100 pot bonuses per game title!', 'C_u_15ePNa7.jpg', '2024-09-10 11:06:14', '2024-09-21 19:55:52', NULL),
(113, 'chasingnostalgia__', 'C_T_UeNyMWQ', 'You don’t have much time left 👀 #theendisnear #smallbusiness #smallbusinessowner #modesto #mchenry #storeclosing #costruction #expansion #thrift #thriftstore #thriftshop #secondhand', 'C_T_UeNyMWQ_thumbnail.jpg', '2024-08-30 23:24:27', '2024-09-22 12:13:48', 'C_T_UeNyMWQ.mp4');

-- --------------------------------------------------------

--
-- Table structure for table `scrape_history`
--

CREATE TABLE `scrape_history` (
  `id` int(11) NOT NULL,
  `username` text NOT NULL,
  `last_scraped` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `vendorshops`
--

CREATE TABLE `vendorshops` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(6) NOT NULL,
  `category` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'images/avatar.png',
  `vendorphoto` varchar(255) DEFAULT NULL,
  `datecreated` date NOT NULL DEFAULT curdate(),
  `website` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `etsy` varchar(255) DEFAULT NULL,
  `discount` tinyint(3) UNSIGNED DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vendorshops`
--

INSERT INTO `vendorshops` (`id`, `name`, `description`, `location`, `category`, `avatar`, `vendorphoto`, `datecreated`, `website`, `instagram`, `etsy`, `discount`) VALUES
(11, 'Love Morgue', 'The one and only! Custom made graffiti and safety pin hats, ties, masks and so much more!', '10A', 'Clothing', '/uploads/vendors/1724206564095-lovemorgue-1.png', '/uploads/vendors/1724207434908-lovemorgue-2.png', '2023-12-01', 'www.lovemorgue.com', 'lovemorgue', NULL, 50),
(12, 'Fleaboard Skate Shop', 'Secondhand Skate & Thrift Shop! Skatewear and accessories\n\n@fleaboardshop on Instagram', '1A', 'Skateboards', '/uploads/vendors/1724209350000-fleaboardshop-1.png', NULL, '2024-09-01', NULL, NULL, NULL, 0),
(13, 'Gemzies Treasures', 'Handmade jewelry, art and more! based in the Bay Area\r\n\r\n@gemzies.treasure on Instagram\r\n@gemzies.treasure on Etsy', '9A', 'Jewelry', '/uploads/vendors/1724284581143-gemziestreasure-1.png', NULL, '2024-09-02', NULL, '@gem.zies', NULL, 0),
(14, 'Chasing Nostalgia', 'The one and only!', 'FRONT', 'Clothing', '/uploads/vendors/1724209100000-chasingnostalgia-1.png', NULL, '2023-09-01', 'www.chasingnostalgia.com', 'chasingnostalgia__', NULL, 0),
(15, 'Buck Lucky', 'Custom mad beautiful clothes for beautiful people! Come get find something lucky!\n\n@bucklucky on Instagram', '5A', 'Fashion', '/uploads/vendors/1724209100000-bucklucky1.png', NULL, '2024-08-02', NULL, NULL, NULL, 0),
(16, 'DVLSH', 'Sustainable Satanic Clothing\r\nSustainable Satanic Clothing\r\nSustainable Satanic Clothing\r\n\r\n@dvlsh on Instagram', '3A', 'Clothing', '/uploads/vendors/1724209100000-dvlish1.png', NULL, '2024-07-04', NULL, NULL, NULL, 0),
(17, 'Cherry on Top', 'Nonconformists to the core, they sell custom patches, ripped apparel, and punk accessories that scream defiance.', '2A', 'Clothing', '/uploads/vendors/1724209100000-cherryontop1.png', NULL, '2024-09-03', NULL, NULL, NULL, 0),
(18, 'Superinsaiyanfinds', 'Sick streetwear, vintage clothing & toys! Always stocking the store with something new.', '7A', 'Clothing', '/uploads/vendors/1724209100000-supersaiynfinds1.png', NULL, '2024-09-03', NULL, NULL, NULL, 0),
(19, 'The Lemonheads', 'The Lemonheads 🍋\n--THRIFT WITH A TWIST--\nOffering sustainable thrift and threds.\nCome shop our booth @chasingnostalgia__ off McHenry and Leveland behind the Nations Giant Burger in Modesto. See you there!', '8A', 'Clothing', '/uploads/vendors/1724209100000-lemonheadsthrift1.png', NULL, '2024-09-03', NULL, NULL, NULL, 0),
(20, 'GAMERB0YZ', 'Cloaked in secrecy, this vendor\'s goods are rare finds that you can only discover here. From cloaks to hidden trinkets, each item has a story.', '6A', 'Video Games', '/uploads/vendors/172420910000-gamerb0yz1.png', NULL, '2024-09-03', NULL, NULL, NULL, 0),
(21, 'Ambition Thrift', 'Favorite lesbian love couple with beautifully custom made waist beads, clothes and more!', '4A', 'Fashion', '/uploads/vendors/1724209100000-ambitionthrift1.png', NULL, '2024-05-05', NULL, NULL, NULL, 0),
(22, 'Retro Nani209', 'Front row shop! Plenty of stuff from Video Games, Vintage Merch, Magazines and Action Figures! Come check us out.', '11A', 'Video Games', '/uploads/vendors/1724209100000-retronani2091.png', NULL, '2024-07-17', NULL, NULL, NULL, 0),
(42, 'Valley3DPrints', '3D Printing Company', '16A', 'Electronics', '/uploads/vendors/1726685522656-Valley-3d-FINAL.png', '/uploads/vendors/1726685522659-Untitl3ed.png', '2024-09-18', NULL, 'valley3dprints', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chasingblogs`
--
ALTER TABLE `chasingblogs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `chasingevents`
--
ALTER TABLE `chasingevents`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `guestvendors`
--
ALTER TABLE `guestvendors`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `scraped_posts`
--
ALTER TABLE `scraped_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_id` (`post_id`) USING HASH;

--
-- Indexes for table `scrape_history`
--
ALTER TABLE `scrape_history`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vendorshops`
--
ALTER TABLE `vendorshops`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chasingblogs`
--
ALTER TABLE `chasingblogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `chasingevents`
--
ALTER TABLE `chasingevents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `guestvendors`
--
ALTER TABLE `guestvendors`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `scraped_posts`
--
ALTER TABLE `scraped_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `scrape_history`
--
ALTER TABLE `scrape_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendorshops`
--
ALTER TABLE `vendorshops`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

USE test;

-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: savorly_db
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.20.04.1

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Vegetarian','2025-01-17 14:50:12','2025-01-17 14:50:12'),(2,'Vegan','2025-01-17 14:50:12','2025-01-17 14:50:12'),(3,'Dessert','2025-01-17 14:50:12','2025-01-17 14:50:12'),(4,'Main Course','2025-01-17 14:50:12','2025-01-17 14:50:12'),(5,'Appetizer','2025-01-17 14:50:12','2025-01-17 14:50:12'),(11,'New category','2025-05-06 14:54:53','2025-05-06 14:54:53');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipe_id` int NOT NULL,
  `user_id` int NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratings`
--

DROP TABLE IF EXISTS `ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipe_id` int NOT NULL,
  `user_id` int NOT NULL,
  `ratings` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `recipe_id` (`recipe_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ratings_chk_1` CHECK (((`ratings` >= 1) and (`ratings` <= 5)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratings`
--

LOCK TABLES `ratings` WRITE;
/*!40000 ALTER TABLE `ratings` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_categories`
--

DROP TABLE IF EXISTS `recipe_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_categories` (
  `recipe_id` int NOT NULL,
  `category_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recipe_id`,`category_id`),
  KEY `fk_category` (`category_id`),
  CONSTRAINT `fk_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_recipe` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_categories`
--

LOCK TABLES `recipe_categories` WRITE;
/*!40000 ALTER TABLE `recipe_categories` DISABLE KEYS */;
INSERT INTO `recipe_categories` VALUES (1,2,'2025-04-23 11:59:12'),(2,3,'2025-04-19 02:06:50'),(2,5,'2025-04-29 17:56:54'),(3,1,'2025-04-19 19:41:49'),(3,4,'2025-04-29 18:26:50'),(6,3,'2025-04-29 18:35:57'),(45,3,'2025-04-14 11:41:03'),(47,4,'2025-04-15 09:45:42'),(49,1,'2025-04-15 09:58:26'),(50,3,'2025-04-15 10:08:04'),(51,2,'2025-04-15 10:43:07');
/*!40000 ALTER TABLE `recipe_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipe_ingredients`
--

DROP TABLE IF EXISTS `recipe_ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipe_ingredients` (
  `recipe_id` int NOT NULL,
  `ingredient_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `recipe_ingredients_ibfk_1` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipe_ingredients`
--

LOCK TABLES `recipe_ingredients` WRITE;
/*!40000 ALTER TABLE `recipe_ingredients` DISABLE KEYS */;
INSERT INTO `recipe_ingredients` VALUES (45,'ingredienta'),(45,'ingredients2'),(47,'Tomatoes'),(47,'Onions'),(47,'\"Onions'),(47,'Garlic'),(47,'Cumin'),(49,'Bread'),(49,'Avocado'),(49,'Tomato'),(49,'Egg'),(50,'Berries'),(50,'Oats'),(50,'Banana'),(50,'Yogurt'),(50,'Honey'),(51,'coconut'),(51,'riice'),(51,'Pepper'),(2,'dddddddddddddddd'),(2,'kkkkkkkkkkkkkkk'),(3,'ingredients 1'),(3,'ingredient 2'),(1,'1 cup long grain white rice (e.g., basmati or jasmine)'),(1,'1 cup canned coconut milk (full fat)'),(1,'1 cup water'),(1,'1/2 teaspoon salt'),(1,'1 tablespoon sugar (optional, for a slightly sweet flavor)'),(1,'1 tablespoon shredded coconut (optional, for garnish)'),(1,'1 tablespoon chopped cilantro or parsley (optional, for garnish)'),(2,'ingredient 1'),(2,'ingredient 2'),(3,'Ingredient 1'),(3,'ingredient 2'),(6,'Recorder');
/*!40000 ALTER TABLE `recipe_ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `prep_time` int DEFAULT NULL,
  `cook_time` int DEFAULT NULL,
  `calories` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,1,'Coconut Rice','Coconut rice is a fragrant and creamy rice dish made by cooking rice in coconut milk instead of water. Popular in tropical regions, it pairs perfectly with spicy or savory dishes like curries, jerk chicken, grilled fish, or stir-fried vegetables. The rich coconut flavor adds a comforting twist to your typical rice side.','https://res.cloudinary.com/du0zlwc0s/image/upload/v1745402349/recipe_images/g49pukretnowijqzmb3m.jpg','2025-04-23 11:59:12','2025-04-23 11:59:12',5,20,300),(2,1,'Title of recipee','Lorem lorem nkkjkfk dkfnkjfkjkd fkenfknknf fnknkv','https://res.cloudinary.com/du0zlwc0s/image/upload/v1745942213/recipe_images/v2kpwgrxn5d5xqgqabld.jpg','2025-04-29 17:56:54','2025-04-29 17:56:54',20,40,198),(3,1,'Recipe title 2 ','Loremmmmmm kkkkkkk kkkkkk ffefefefef','https://res.cloudinary.com/du0zlwc0s/image/upload/v1745944009/recipe_images/a9phvhj02mapejgibxu3.jpg','2025-04-29 18:26:50','2025-04-29 18:26:50',30,37,180),(6,1,'Recipe New','RECIPES des fffffffffff hhhhhhhhhhh gggggggggggd gesgfsfsf gdgdgdgd','https://res.cloudinary.com/du0zlwc0s/image/upload/v1746136997/recipe_images/w1f6hqodii2n2kkstwlz.jpg','2025-04-29 18:35:57','2025-05-02 00:03:17',10,45,190);
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `saved_recipes`
--

DROP TABLE IF EXISTS `saved_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_recipes` (
  `user_id` int NOT NULL,
  `recipe_id` int NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`,`recipe_id`),
  KEY `recipe_id` (`recipe_id`),
  CONSTRAINT `saved_recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `saved_recipes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_recipes`
--

LOCK TABLES `saved_recipes` WRITE;
/*!40000 ALTER TABLE `saved_recipes` DISABLE KEYS */;
INSERT INTO `saved_recipes` VALUES (1,1,'2025-04-23 12:45:57'),(1,3,'2025-04-19 19:42:11'),(1,6,'2025-04-29 23:14:39'),(163,45,'2025-04-14 17:37:06'),(163,47,'2025-04-15 10:00:14'),(163,49,'2025-04-15 10:00:00'),(163,50,'2025-04-15 10:08:14');
/*!40000 ALTER TABLE `saved_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_profiles`
--

DROP TABLE IF EXISTS `user_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_profiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `bio` text,
  `avatar_url` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `user_profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=119 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_profiles`
--

LOCK TABLES `user_profiles` WRITE;
/*!40000 ALTER TABLE `user_profiles` DISABLE KEYS */;
INSERT INTO `user_profiles` VALUES (1,10,'','',NULL,NULL),(2,11,'','',NULL,NULL),(6,1,'This is  my bio....','https://res.cloudinary.com/du0zlwc0s/image/upload/v1745932608/user_avatars/kw0klo0l3rywgbmf8j0s.jpg','Funmi','Tall'),(8,12,'','',NULL,NULL),(9,8,'','',NULL,NULL),(10,6,'','',NULL,NULL),(11,7,'','',NULL,NULL),(12,9,'','',NULL,NULL),(16,13,'I love to try new recipes. Eating Healthy is Health','',NULL,NULL),(17,14,'','http://localhost:5001/uploads/default_avatar.png',NULL,NULL),(18,15,'','http://localhost:5001/uploads/default_avatar.png',NULL,NULL),(19,16,'I love coding!','http://localhost:5001/uploads/default_avatar.png',NULL,NULL),(20,17,'Lola Bio Data is Here Yes!','http://localhost:5001/uploads/1738313308548.jpg',NULL,NULL),(21,18,'','http://localhost:5001/uploads/default_avatar.png',NULL,NULL),(113,163,'','https://res.cloudinary.com/du0zlwc0s/image/upload/v1744258805/user_avatars/dbmoqlwojarv69ned7is.jpg','Funmi','Tall'),(114,164,NULL,NULL,'Elizy','Tall'),(115,1,'This is  my bio....','https://res.cloudinary.com/du0zlwc0s/image/upload/v1745932608/user_avatars/kw0klo0l3rywgbmf8j0s.jpg','Funmi','Tall'),(116,1,'This is  my bio....','https://res.cloudinary.com/du0zlwc0s/image/upload/v1745932608/user_avatars/kw0klo0l3rywgbmf8j0s.jpg','Funmi','Tall');
/*!40000 ALTER TABLE `user_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `email_verified` tinyint(1) DEFAULT '0',
  `verification_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verification_token_expires_at` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_verification_token` (`verification_token`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'funmi4universe@yahoo.com','$2a$10$/6W1ZEsIXYmUDFu7VBhhSukzoEgQwu5TykHRggZEKPG369I0URFzi','Funmi','Tall','admin','2025-04-23 11:17:05','2025-05-05 16:57:41',0,'4ebdc808-873c-4eab-ae3d-f2c823730a8e',NULL,1);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-20 13:32:29

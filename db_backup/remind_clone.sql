-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost:3307
-- Thời gian đã tạo: Th12 05, 2020 lúc 01:25 PM
-- Phiên bản máy phục vụ: 10.4.14-MariaDB-log
-- Phiên bản PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `remind_clone`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `announcement_schedule`
--

CREATE TABLE `announcement_schedule` (
  `scheduleId` bigint(32) NOT NULL,
  `senderId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `file` text DEFAULT NULL,
  `type` tinyint(4) NOT NULL DEFAULT 1,
  `target` text NOT NULL DEFAULT 'all',
  `done` tinyint(1) NOT NULL DEFAULT 0,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  `createAtMs` bigint(32) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `announcement_schedule`
--

INSERT INTO `announcement_schedule` (`scheduleId`, `senderId`, `roomId`, `content`, `file`, `type`, `target`, `done`, `time`, `createAtMs`) VALUES
(1606209101798, 21, 31, '<p>dwdw</p>', NULL, 1, 'all', 1, '2020-11-24 09:12:00', 1606209101798),
(1606209101798, 21, 32, '<p>dwdw</p>', NULL, 1, 'all', 1, '2020-11-24 09:12:00', 1606209101798),
(1606209594267, 21, 31, '<p>qqqqqq</p>', NULL, 1, 'all', 1, '2020-11-24 09:20:00', 1606209594267),
(1606209594267, 21, 32, '<p>qqqqqq</p>', NULL, 1, 'all', 1, '2020-11-24 09:20:00', 1606209594267),
(1606212133951, 21, 31, '<p>after edit after</p>', 'http://localhost:5000/images/18020033_Nguyen-TrongQuoc-1606212151496.sql', 1, 'all', 1, '2020-11-24 10:04:00', 0),
(1606212133951, 21, 32, '<p>after edit after</p>', 'http://localhost:5000/images/18020033_Nguyen-TrongQuoc-1606212151496.sql', 1, 'all', 1, '2020-11-24 10:04:00', 0),
(1606216476060, 22, 29, '<p>hello</p>', NULL, 1, 'all', 1, '2020-11-24 11:15:00', 1606216476060),
(1606298980025, 50, 36, '<p>hello<strong> hello </strong><i><strong>hello </strong></i><a href=\"helllo.hello\">helllo.hello</a>&nbsp;</p>', 'http://localhost:5000/images/560858-1606298980010.jpg', 1, 'all', 1, '2020-11-25 10:15:00', 1606298980025),
(1606650557353, 57, 38, '<p>d</p>', NULL, 1, 'all', 1, '2020-11-29 11:51:00', 0),
(1606721679527, 57, 38, '<p>heyy</p>', NULL, 1, 'all', 0, '2020-12-01 07:34:00', 1606721679527),
(1607163745122, 57, 39, '<p>dqwdwdd</p>', NULL, 1, 'student', 0, '2020-12-06 10:22:00', 1607163745122),
(1607163831643, 57, 39, '<p>test</p>', NULL, 1, 'parent', 1, '2020-12-05 10:24:00', 1607163831643);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `class`
--

CREATE TABLE `class` (
  `classId` int(11) NOT NULL,
  `name` text NOT NULL,
  `owner` int(11) NOT NULL,
  `school` int(11) NOT NULL DEFAULT 0,
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `avatar` text DEFAULT 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `class`
--

INSERT INTO `class` (`classId`, `name`, `owner`, `school`, `createAt`, `avatar`) VALUES
(39, 'This is classname', 50, 0, '2020-11-25 10:07:15', 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'),
(40, 'hello thầy', 51, 0, '2020-11-25 10:29:01', 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'),
(41, 'ffff', 57, 0, '2020-11-27 14:17:01', 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'),
(42, 'dddd', 57, 0, '2020-11-27 14:54:48', 'https://avataaars.io/?avatarStyle=Circle&topType=LongHairStraight&accessoriesType=Blank&hairColor=BrownDark&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Default&mouthType=Default&skinColor=Light'),
(44, 'hello', 57, 0, '2020-11-27 15:03:41', 'http://localhost:5000/images/dsklogo-1606489421809.jpg'),
(45, 'dsk', 57, 0, '2020-11-29 09:23:21', 'http://localhost:5000/images/Untitled-1-1606641801270.png'),
(46, 'hello', 50, 0, '2020-12-04 07:31:00', 'http://localhost:5000/images/bibeo-1607067060667.png'),
(47, 'dddd', 50, 0, '2020-12-04 07:31:51', 'http://localhost:5000/images/bibeo-1607067111249.png');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `class_member`
--

CREATE TABLE `class_member` (
  `classId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `joinAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `class_member`
--

INSERT INTO `class_member` (`classId`, `userId`, `type`, `joinAt`) VALUES
(39, 50, NULL, '2020-11-25 10:07:15'),
(40, 51, NULL, '2020-11-25 10:29:01'),
(40, 52, NULL, '2020-11-25 10:30:25'),
(41, 28, NULL, '2020-12-05 10:37:45'),
(41, 29, NULL, '2020-12-04 03:36:24'),
(41, 57, NULL, '2020-11-27 14:17:01'),
(41, 63, NULL, '2020-11-30 08:59:22'),
(42, 57, NULL, '2020-11-27 14:54:48'),
(44, 29, NULL, '2020-12-04 03:38:41'),
(44, 57, NULL, '2020-11-27 15:03:41'),
(44, 63, NULL, '2020-12-03 13:37:29'),
(45, 29, NULL, '2020-12-04 03:35:24'),
(45, 57, NULL, '2020-11-29 09:23:21'),
(45, 63, NULL, '2020-11-30 08:59:05'),
(46, 50, NULL, '2020-12-04 07:31:00'),
(47, 50, NULL, '2020-12-04 07:31:51');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `senderId` int(11) NOT NULL,
  `roomId` int(11) NOT NULL,
  `content` text NOT NULL,
  `file` text DEFAULT NULL,
  `type` tinyint(1) NOT NULL DEFAULT 0,
  `target` text NOT NULL DEFAULT 'all',
  `createAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `senderId`, `roomId`, `content`, `file`, `type`, `target`, `createAt`) VALUES
(540, 28, 34, 'dd', NULL, 0, 'all', '2020-11-24 13:54:15'),
(543, 28, 34, '', 'http://localhost:5000/images/package-1606227808568.xml', 0, 'all', '2020-11-24 14:23:28'),
(550, 50, 36, 'hello guys', NULL, 0, 'all', '2020-11-25 10:07:42'),
(551, 50, 36, 'd', NULL, 0, 'all', '2020-11-25 10:14:46'),
(552, 50, 36, '<p>hello<strong> hello </strong><i><strong>hello </strong></i><a href=\"helllo.hello\">helllo.hello</a>&nbsp;</p>', 'http://localhost:5000/images/560858-1606298980010.jpg', 1, 'all', '2020-11-25 10:15:00'),
(553, 51, 37, 'đấ', NULL, 0, 'all', '2020-11-25 10:29:06'),
(554, 52, 37, 'đwd', NULL, 0, 'all', '2020-11-25 10:30:29'),
(555, 52, 37, 'realtime', NULL, 0, 'all', '2020-11-25 10:30:34'),
(556, 51, 37, '<p>ddd</p>', 'http://localhost:5000/images/286177-1606300287848.jpg', 1, 'all', '2020-11-25 10:31:27'),
(557, 57, 39, '', 'http://localhost:5000/images/bienlop7-1606489008429.jpg', 0, 'all', '2020-11-27 14:56:48'),
(558, 57, 41, 'x', NULL, 0, 'all', '2020-11-28 05:38:29'),
(559, 57, 41, '', 'http://localhost:5000/images/bienlop7-1606541923713.jpg', 0, 'all', '2020-11-28 05:38:43'),
(560, 57, 41, 'dd', NULL, 0, 'all', '2020-11-28 05:40:54'),
(561, 57, 39, 'd', NULL, 0, 'all', '2020-11-28 05:41:21'),
(562, 57, 38, '<p>d</p>', NULL, 1, 'all', '2020-11-29 11:51:00'),
(563, 57, 38, '<p>dwqdw</p>', NULL, 1, 'all', '2020-11-29 11:56:00'),
(564, 57, 38, '', 'http://localhost:5000/images/100thanivesary-1606666262812.png', 0, 'all', '2020-11-29 16:11:02'),
(565, 57, 38, 'hello guys ', 'http://localhost:5000/images/100thanivesary-1606723965901.png', 0, 'all', '2020-11-30 08:12:45'),
(566, 57, 38, '<p>hehq</p><ol><li>dhqwdh<i> dwdwddqwdqwddqwdw</i></li><li><i>dqwdd</i></li><li><i>dw</i><a href=\"helo.com\"><i>helo.com</i></a></li></ol>', NULL, 1, 'all', '2020-11-30 08:46:37'),
(567, 57, 38, '<p>dwd</p><ul><li>dwdwd</li><li>dwd</li></ul><ol><li>dqwd</li><li>dqwd</li><li><a href=\"dqwdwq\">dqwdwq</a></li></ol>', 'http://localhost:5000/images/MesloLGS-NF-Regular-1606726019813.ttf', 1, 'all', '2020-11-30 08:47:00'),
(568, 57, 42, 'e', NULL, 0, 'all', '2020-11-30 08:52:55'),
(569, 57, 42, 'e', NULL, 0, 'all', '2020-11-30 08:52:57'),
(570, 57, 42, 'e', NULL, 0, 'all', '2020-11-30 08:52:58'),
(571, 57, 42, '', 'http://localhost:5000/images/bibeo-1606726390342.png', 0, 'all', '2020-11-30 08:53:10'),
(572, 63, 38, 'hello', NULL, 0, 'all', '2020-11-30 14:46:00'),
(573, 57, 41, '<p>dqwd</p>', NULL, 1, 'all', '2020-12-01 09:37:21'),
(574, 57, 41, '<p>d</p>', NULL, 1, 'all', '2020-12-01 09:37:34'),
(575, 57, 38, '<ol><li>1</li><li>2</li><li>3</li><li>4</li><li>5</li></ol><p>6</p><p>7</p><p>8</p><p>&nbsp;</p><p>9</p><p>9</p><p>&nbsp;</p>', 'http://localhost:5000/images/bibeo-1606823213777.png', 1, 'all', '2020-12-01 11:46:53'),
(576, 57, 42, '<p>dwdwd</p>', NULL, 1, 'all', '2020-12-03 15:26:02'),
(577, 29, 46, 'hello', NULL, 0, 'all', '2020-12-04 08:06:30'),
(578, 29, 41, 'dqwd', NULL, 0, 'all', '2020-12-04 08:07:17'),
(579, 29, 46, 'hey', NULL, 0, 'all', '2020-12-04 08:25:57'),
(580, 29, 46, 'hey', 'http://localhost:5000/images/bibeo-1607070468009.png', 0, 'all', '2020-12-04 08:27:48'),
(581, 29, 45, 'hey', NULL, 0, 'all', '2020-12-04 08:29:58'),
(582, 29, 45, 'hey', NULL, 0, 'all', '2020-12-04 08:48:53'),
(583, 29, 45, 'dd', NULL, 0, 'all', '2020-12-04 08:49:05'),
(584, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 08:49:48'),
(585, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 08:50:41'),
(586, 57, 45, 'dqwd', NULL, 0, 'all', '2020-12-04 08:56:13'),
(587, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 08:59:08'),
(588, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 08:59:20'),
(589, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 08:59:24'),
(590, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 09:00:15'),
(591, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 09:00:50'),
(592, 29, 45, 'd', NULL, 0, 'all', '2020-12-04 09:01:15'),
(593, 57, 45, 'hey', NULL, 0, 'all', '2020-12-04 09:01:33'),
(594, 29, 45, 'hey', NULL, 0, 'all', '2020-12-04 09:01:40'),
(595, 57, 45, 'd', NULL, 0, 'all', '2020-12-04 09:02:11'),
(596, 29, 45, 'dwqdqw', NULL, 0, 'all', '2020-12-04 09:02:22'),
(597, 29, 45, 'dqd', NULL, 0, 'all', '2020-12-04 09:03:00'),
(598, 29, 45, 'dqd', NULL, 0, 'all', '2020-12-04 09:03:05'),
(599, 57, 45, 'dqd', NULL, 0, 'all', '2020-12-04 09:09:09'),
(600, 57, 45, 'dqd', NULL, 0, 'all', '2020-12-04 09:09:22'),
(601, 57, 45, 'dwd', NULL, 0, 'all', '2020-12-04 09:11:19'),
(602, 29, 45, 'dqdw', 'http://localhost:5000/images/bibeo-1607073206041.png', 0, 'all', '2020-12-04 09:13:26'),
(603, 29, 45, 'this is private chat', NULL, 0, 'all', '2020-12-04 09:26:53'),
(605, 29, 45, 'hey', NULL, 0, 'all', '2020-12-04 09:48:21'),
(606, 29, 45, 'test real time', NULL, 0, 'all', '2020-12-04 09:48:31'),
(607, 57, 38, '<p>dwqdqwd</p>', NULL, 1, 'all', '2020-12-05 09:25:11'),
(608, 57, 38, '<p>dwqdqwdqw</p>', NULL, 1, 'all', '2020-12-05 09:28:12'),
(609, 57, 39, '<p>dwqdqwdqw</p>', NULL, 1, 'all', '2020-12-05 09:28:12'),
(610, 57, 41, '<p>dwqdqwdqw</p>', NULL, 1, 'all', '2020-12-05 09:28:12'),
(611, 57, 38, '<p>dwdwd</p>', NULL, 1, 'all', '2020-12-05 09:28:43'),
(754, 57, 38, '<p>dqqdq</p>', NULL, 1, 'all', '2020-12-05 09:57:54'),
(755, 57, 39, '<p>dqqdq</p>', NULL, 1, 'all', '2020-12-05 09:57:54'),
(756, 57, 38, '<p>test</p>', NULL, 1, 'all', '2020-12-05 09:59:30'),
(757, 57, 39, '<p>test</p>', NULL, 1, 'all', '2020-12-05 09:59:30'),
(758, 57, 41, '<p>test</p>', NULL, 1, 'all', '2020-12-05 09:59:30'),
(759, 57, 38, '<p>wdqdqwdqd</p>', NULL, 1, 'all', '2020-12-05 10:10:37'),
(760, 57, 39, '<p>wdqdqwdqd</p>', NULL, 1, 'all', '2020-12-05 10:10:37'),
(761, 57, 41, '<p>wdqdqwdqd</p>', NULL, 1, 'all', '2020-12-05 10:10:37'),
(762, 57, 38, '<p>dqdqwd</p>', NULL, 1, 'all', '2020-12-05 10:21:17'),
(763, 57, 39, '<p>dqdqwd</p>', NULL, 1, 'student', '2020-12-05 10:21:17'),
(764, 57, 41, '<p>dqdqwd</p>', NULL, 1, 'parent', '2020-12-05 10:21:17'),
(765, 57, 39, '<p>test</p>', NULL, 1, 'parent', '2020-12-05 10:24:00'),
(766, 57, 38, '<p>hello</p>', NULL, 1, 'parent', '2020-12-05 10:37:57'),
(767, 57, 38, '<p>hello student</p>', NULL, 1, 'student', '2020-12-05 10:38:31'),
(768, 57, 38, 'dqwdqwd', NULL, 0, 'all', '2020-12-05 10:41:03'),
(769, 57, 38, '<p>dqwdqwd</p>', NULL, 1, 'all', '2020-12-05 10:41:13'),
(770, 57, 38, '<p>heplo student</p>', NULL, 1, 'student', '2020-12-05 10:41:30'),
(771, 57, 38, '<p>helo parents</p>', NULL, 1, 'parent', '2020-12-05 10:41:42'),
(772, 57, 38, 'dqwdq', NULL, 0, 'all', '2020-12-05 10:46:22'),
(773, 57, 38, '<p>all</p>', NULL, 1, 'all', '2020-12-05 10:46:38'),
(774, 57, 38, '<p>student</p>', NULL, 1, 'student', '2020-12-05 10:46:52'),
(775, 28, 38, 'd', NULL, 0, 'all', '2020-12-05 10:50:11'),
(776, 57, 38, '<p>student</p>', NULL, 1, 'student', '2020-12-05 10:50:20'),
(777, 57, 38, '<p>student</p>', NULL, 1, 'student', '2020-12-05 10:50:45'),
(778, 57, 38, '<p>std</p>', NULL, 1, 'student', '2020-12-05 10:51:12'),
(779, 57, 38, 'dqwdwd', NULL, 0, 'all', '2020-12-05 11:05:05'),
(780, 57, 38, '<p>dqdwd</p>', NULL, 1, 'student', '2020-12-05 11:05:12'),
(781, 57, 38, '<p>parents</p>', NULL, 1, 'parent', '2020-12-05 11:52:38'),
(782, 57, 52, 'hello', NULL, 0, 'all', '2020-12-05 11:53:14'),
(783, 57, 52, 'dqwdq', NULL, 0, 'all', '2020-12-05 11:54:52'),
(784, 57, 52, 'dqwdq', NULL, 0, 'all', '2020-12-05 11:55:03'),
(785, 57, 52, 'dqwdw', NULL, 0, 'all', '2020-12-05 11:55:14'),
(786, 28, 52, 'dwqdw', NULL, 0, 'all', '2020-12-05 11:55:16'),
(787, 57, 52, 'hey', NULL, 0, 'all', '2020-12-05 11:56:26'),
(788, 28, 52, 'hey', NULL, 0, 'all', '2020-12-05 11:56:31'),
(789, 28, 52, 'hh', NULL, 0, 'all', '2020-12-05 12:10:12'),
(790, 57, 52, 'dwqdwq', NULL, 0, 'all', '2020-12-05 12:10:23'),
(791, 57, 52, 'dqdw', NULL, 0, 'all', '2020-12-05 12:13:01'),
(792, 28, 52, 'helo quoc', NULL, 0, 'all', '2020-12-05 12:22:43');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `message_room`
--

CREATE TABLE `message_room` (
  `roomId` int(11) NOT NULL,
  `socketId` varchar(50) NOT NULL DEFAULT 'dummysocketid',
  `createAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `classId` int(11) NOT NULL,
  `privateMember` text DEFAULT NULL,
  `member1` int(11) DEFAULT NULL,
  `member2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `message_room`
--

INSERT INTO `message_room` (`roomId`, `socketId`, `createAt`, `classId`, `privateMember`, `member1`, `member2`) VALUES
(34, 'dummysocketid', '2020-11-24 13:39:11', 37, NULL, NULL, NULL),
(35, 'dummysocketid', '2020-11-24 13:43:00', 38, NULL, NULL, NULL),
(36, 'dummysocketid', '2020-11-25 10:07:15', 39, NULL, NULL, NULL),
(37, 'dummysocketid', '2020-11-25 10:29:01', 40, NULL, NULL, NULL),
(38, 'dummysocketid', '2020-11-27 14:17:01', 41, NULL, NULL, NULL),
(39, 'dummysocketid', '2020-11-27 14:54:48', 42, NULL, NULL, NULL),
(41, 'dummysocketid', '2020-11-27 15:03:41', 44, NULL, NULL, NULL),
(42, 'dummysocketid', '2020-11-29 09:23:21', 45, '28,29', 28, 29),
(44, 'dummysocketid', '2020-12-04 05:23:00', 0, '29,49', 29, 49),
(45, 'dummysocketid', '2020-12-04 06:51:10', 0, '29,57', 29, 57),
(46, 'dummysocketid', '2020-12-04 06:55:22', 0, '29,63', 29, 63),
(47, 'dummysocketid', '2020-12-04 07:31:00', 46, NULL, NULL, NULL),
(48, 'dummysocketid', '2020-12-04 07:31:51', 47, NULL, NULL, NULL),
(50, 'dummysocketid', '2020-12-04 10:32:19', 0, '57,63', 57, 63),
(51, 'dummysocketid', '2020-12-05 11:49:35', 0, '28,63', 28, 63),
(52, 'dummysocketid', '2020-12-05 11:53:10', 0, '57,28', 57, 28);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `region`
--

CREATE TABLE `region` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `region`
--

INSERT INTO `region` (`id`, `name`) VALUES
(84, 'Viet Nam');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `relationship`
--

CREATE TABLE `relationship` (
  `parentId` int(11) NOT NULL,
  `childId` int(11) NOT NULL,
  `createAt` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `relationship`
--

INSERT INTO `relationship` (`parentId`, `childId`, `createAt`) VALUES
(29, 63, '2020-12-04 02:14:04');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `school`
--

CREATE TABLE `school` (
  `id` int(11) NOT NULL,
  `name` int(11) NOT NULL,
  `region` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `school`
--

INSERT INTO `school` (`id`, `name`, `region`) VALUES
(0, 0, 84);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` text NOT NULL,
  `password` text DEFAULT NULL,
  `create_at` datetime NOT NULL DEFAULT current_timestamp(),
  `verified` tinyint(1) NOT NULL DEFAULT 0,
  `verifyCode` int(11) DEFAULT 1807,
  `refresh_token` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`id`, `email`, `password`, `create_at`, `verified`, `verifyCode`, `refresh_token`) VALUES
(28, 'test2@gmail.com', '123456', '2020-11-24 12:51:46', 1, 1807, '0'),
(29, 'test3@gmail.com', '123456', '2020-11-24 12:54:19', 1, 9260, '0'),
(49, 'sehome9523@1981pc.com', '123456', '2020-11-25 09:44:16', 1, 7352, '0'),
(50, 'test12@gmail.com', '123456', '2020-11-25 10:06:00', 1, 4061, '0'),
(51, 'instouwd@rmtmarket.ru', '123456', '2020-11-25 10:28:03', 1, 6902, '0'),
(52, 'instouwd@cokils.com', '123456', '2020-11-25 10:29:48', 1, 9641, '0'),
(57, 'nguyentrongquocbk@gmail.com', NULL, '2020-11-27 09:14:38', 1, 1807, '1//0eZkqLwJxLeWrCgYIARAAGA4SNwF-L9IrcHD9jJqoz39loN1kLmyQbMZGFht7ozFSBmwi1xheFjr1yGhrPtcuCM1FSO3mDuKF6mM'),
(59, 'jojikax447@xhypm.com', 'jjjjjj', '2020-11-27 10:00:02', 1, 1998, NULL),
(60, 'skleyto@kittiza.com', '123456', '2020-11-27 14:00:37', 1, 7567, NULL),
(61, 'misstyling@virginiaintel.com', '123456', '2020-11-27 14:14:30', 1, 4845, NULL),
(63, 'iambronzeiii@gmail.com', NULL, '2020-11-30 08:58:06', 1, 1807, '1//0ebV-3Uu7ARrQCgYIARAAGA4SNwF-L9Ir7Gn5ol-FNMOYdzXWg92dbOIOUP5984N5C7Lrm8-koHW8kSwR6tHLMHFG5YnoYk1hsIc'),
(64, 'genderizing@shopwalmarte.com', '123456', '2020-12-02 14:13:55', 1, 5407, NULL),
(65, 'miortvyk@chatur21bate.com', '123456', '2020-12-04 07:37:14', 1, 4064, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user_info`
--

CREATE TABLE `user_info` (
  `id` int(11) NOT NULL,
  `firstName` text NOT NULL,
  `lastName` text NOT NULL,
  `role` tinyint(4) DEFAULT NULL,
  `region` int(11) NOT NULL DEFAULT 84,
  `school` int(11) DEFAULT 0,
  `birthday` date NOT NULL DEFAULT '2000-11-12',
  `gender` varchar(10) NOT NULL DEFAULT 'Male',
  `avatar` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `user_info`
--

INSERT INTO `user_info` (`id`, `firstName`, `lastName`, `role`, `region`, `school`, `birthday`, `gender`, `avatar`) VALUES
(28, 'NGUYỄN', 'QUỐC STUDENT', 1, 84, 0, '2000-11-12', 'Male', NULL),
(29, 'Nguyen ', 'Quoc Parent', 2, 84, 0, '2000-11-12', 'Male', NULL),
(49, 'Jax', 'Sparrow', NULL, 84, 0, '2000-11-12', 'Male', NULL),
(50, 'Jax', 'Sparrow', 0, 84, 0, '2000-11-12', 'Male', NULL),
(51, 'Jax', 'Sparrow', 0, 84, 0, '2000-11-12', 'Male', NULL),
(52, 'Jax', 'Sparrow2', 1, 84, 0, '2000-11-12', 'Male', NULL),
(57, 'Nguyễn', 'Trọng Quốc', 0, 84, 0, '2000-07-18', 'Male', 'https://lh3.googleusercontent.com/-owgqgzTgIws/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckRk-fa4qCLfgWpeeglBZ9LzxgMCw/s96-c/photo.jpg'),
(59, 'NGUYỄN', 'QUỐC', NULL, 84, 0, '2000-11-12', 'Male', NULL),
(60, 'skleyto', 'kittiza', NULL, 84, 0, '2015-11-27', 'Male', NULL),
(61, 'NGUYỄN', 'QUỐC', NULL, 84, 0, '2015-11-24', 'Female', NULL),
(63, 'Devil', 'Cris', 1, 84, 0, '1999-07-18', 'Male', 'https://lh3.googleusercontent.com/-FqvJAcO4sng/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucloiON5yNcol-3tAjF4EM70Yt-f5w/s96-c/photo.jpg'),
(64, 'NGUYỄN', 'QUỐC', NULL, 84, 0, '2015-12-02', 'Male', NULL),
(65, 'NGUYỄN', 'QUỐC', 0, 84, 0, '2015-11-20', 'Male', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `announcement_schedule`
--
ALTER TABLE `announcement_schedule`
  ADD PRIMARY KEY (`scheduleId`,`roomId`) USING BTREE;

--
-- Chỉ mục cho bảng `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`classId`),
  ADD KEY `owner` (`owner`),
  ADD KEY `school` (`school`);
ALTER TABLE `class` ADD FULLTEXT KEY `name` (`name`);

--
-- Chỉ mục cho bảng `class_member`
--
ALTER TABLE `class_member`
  ADD PRIMARY KEY (`classId`,`userId`),
  ADD KEY `userId` (`userId`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `senderId` (`senderId`),
  ADD KEY `roomId` (`roomId`);

--
-- Chỉ mục cho bảng `message_room`
--
ALTER TABLE `message_room`
  ADD PRIMARY KEY (`roomId`);

--
-- Chỉ mục cho bảng `region`
--
ALTER TABLE `region`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `relationship`
--
ALTER TABLE `relationship`
  ADD PRIMARY KEY (`childId`,`parentId`) USING BTREE;

--
-- Chỉ mục cho bảng `school`
--
ALTER TABLE `school`
  ADD PRIMARY KEY (`id`),
  ADD KEY `region` (`region`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `user_info`
--
ALTER TABLE `user_info`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_info_ibfk_2` (`school`),
  ADD KEY `region` (`region`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `class`
--
ALTER TABLE `class`
  MODIFY `classId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=793;

--
-- AUTO_INCREMENT cho bảng `message_room`
--
ALTER TABLE `message_room`
  MODIFY `roomId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT cho bảng `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `class`
--
ALTER TABLE `class`
  ADD CONSTRAINT `class_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_ibfk_2` FOREIGN KEY (`school`) REFERENCES `school` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `class_member`
--
ALTER TABLE `class_member`
  ADD CONSTRAINT `class_member_ibfk_1` FOREIGN KEY (`classId`) REFERENCES `class` (`classId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `class_member_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`roomId`) REFERENCES `message_room` (`roomId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `school`
--
ALTER TABLE `school`
  ADD CONSTRAINT `school_ibfk_1` FOREIGN KEY (`region`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Các ràng buộc cho bảng `user_info`
--
ALTER TABLE `user_info`
  ADD CONSTRAINT `user_info_ibfk_1` FOREIGN KEY (`id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_info_ibfk_2` FOREIGN KEY (`school`) REFERENCES `school` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_info_ibfk_3` FOREIGN KEY (`region`) REFERENCES `region` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

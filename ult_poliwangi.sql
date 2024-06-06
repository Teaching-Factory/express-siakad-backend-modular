-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 11 Bulan Mei 2024 pada 15.55
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ult_poliwangi`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admins`
--

CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_user` bigint(20) UNSIGNED NOT NULL,
  `id_divisi` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `admins`
--

INSERT INTO `admins` (`id`, `id_user`, `id_divisi`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 2, 2, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 3, 3, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 4, 4, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 5, 5, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(6, 6, 6, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(7, 7, 7, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(8, 8, 8, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(9, 9, 9, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(10, 10, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `berkas`
--

CREATE TABLE `berkas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_berkas` varchar(255) NOT NULL,
  `jenis_berkas` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `berkas`
--

INSERT INTO `berkas` (`id`, `nama_berkas`, `jenis_berkas`, `created_at`, `updated_at`) VALUES
(1, 'Proposal Rancang Mutu Perkuliahan', 'Wajib', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 'Daftar Materi Perkuliahan', 'Wajib', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 'Bahan Ajar dan Materi Pendukung', 'Wajib', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 'Rencana Evaluasi dan Penilaian', 'Wajib', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 'Jadwal Pelaksanaan Perkuliahan', 'Wajib', '2024-03-24 15:17:10', '2024-03-24 15:17:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `berkas_layanans`
--

CREATE TABLE `berkas_layanans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_berkas` bigint(20) UNSIGNED NOT NULL,
  `id_layanan` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `berkas_layanans`
--

INSERT INTO `berkas_layanans` (`id`, `id_berkas`, `id_layanan`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 2, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 3, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 4, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 5, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(6, 4, 2, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(7, 5, 2, '2024-03-24 15:17:10', '2024-03-24 15:17:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `divisis`
--

CREATE TABLE `divisis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_divisi` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `divisis`
--

INSERT INTO `divisis` (`id`, `nama_divisi`, `created_at`, `updated_at`) VALUES
(1, 'Unit Layanan Terpadu', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(2, 'Sekretaris', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(3, 'Keuangan', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(4, 'Akademik dan Kemahasiswaan', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(5, 'Umum dan Kepegawaian', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(6, 'Pengadaan', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(7, 'Barang Milik Negara', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(8, 'Konsultasi', '2024-03-24 15:17:09', '2024-03-24 15:17:09'),
(9, 'Other', '2024-03-24 15:17:09', '2024-03-24 15:17:09');

-- --------------------------------------------------------

--
-- Struktur dari tabel `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `layanans`
--

CREATE TABLE `layanans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_layanan` varchar(255) NOT NULL,
  `estimasi_layanan` tinyint(4) NOT NULL DEFAULT 1,
  `id_divisi` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `layanans`
--

INSERT INTO `layanans` (`id`, `nama_layanan`, `estimasi_layanan`, `id_divisi`, `created_at`, `updated_at`) VALUES
(1, 'Rancang Mutu Perkuliahan', 3, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 'Permohonan Rekomendasi MBKM (MSIB)', 4, 4, '2024-03-24 15:17:10', '2024-03-24 15:17:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2023_08_04_071155_create_divisis_table', 1),
(6, '2023_08_04_071223_create_layanans_table', 1),
(7, '2023_08_04_071225_create_berkas_table', 1),
(8, '2023_08_04_072923_create_admins_table', 1),
(9, '2023_08_04_073033_create_berkas_layanans_table', 1),
(10, '2023_08_04_073033_create_prodis_table', 1),
(11, '2023_08_04_074705_create_pengajuans_table', 1),
(12, '2023_08_09_030213_create_progress_pengajuans_table', 1),
(13, '2023_08_25_021210_create_pertanyaans_table', 1),
(14, '2023_08_25_021742_create_surveis_table', 1),
(15, '2023_08_25_022839_create_pertanyaan_surveis_table', 1),
(16, '2023_08_25_023823_create_sarans_table', 1),
(17, '2023_08_25_024619_create_skors_table', 1),
(18, '2023_09_01_024501_create_panduans_table', 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `panduans`
--

CREATE TABLE `panduans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_file` varchar(255) NOT NULL,
  `dokumen_file` varchar(255) NOT NULL,
  `size_file` double(8,2) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengajuans`
--

CREATE TABLE `pengajuans` (
  `id` varchar(255) NOT NULL,
  `kode_tiket` varchar(7) NOT NULL,
  `nama_pemohon` varchar(255) NOT NULL,
  `nomor_identitas` varchar(16) NOT NULL,
  `email` varchar(255) NOT NULL,
  `jenis_permohonan` varchar(100) NOT NULL,
  `tanggal_permohonan` date NOT NULL,
  `nomor_telepon` varchar(15) NOT NULL,
  `submission_confirmed` varchar(20) NOT NULL DEFAULT 'No',
  `id_prodi` bigint(20) UNSIGNED DEFAULT NULL,
  `id_layanan` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pengajuans`
--

INSERT INTO `pengajuans` (`id`, `kode_tiket`, `nama_pemohon`, `nomor_identitas`, `email`, `jenis_permohonan`, `tanggal_permohonan`, `nomor_telepon`, `submission_confirmed`, `id_prodi`, `id_layanan`, `created_at`, `updated_at`) VALUES
('b9586829-502a-4fd7-a656-f0ed108561f3', 'XNpxei6', 'Taufik Hidayat', '362055401019', 'taufikhidayat09121@gmail.com', 'Mahasiswa', '2024-05-11', '082332743884', 'Accept', 1, 2, '2024-05-11 06:47:10', '2024-05-11 06:49:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaans`
--

CREATE TABLE `pertanyaans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pertanyaan` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pertanyaans`
--

INSERT INTO `pertanyaans` (`id`, `pertanyaan`, `created_at`, `updated_at`) VALUES
(1, 'Seberapa puaskah Anda dengan proses pengajuan melalui Unit Layanan Terpadu?', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 'Sejauh mana tingkat keterbukaan dan informasi yang diberikan oleh petugas layanan kepada Anda?', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 'Bagaimana pengalaman Anda dalam berinteraksi dengan sistem pengajuan online yang disediakan?', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 'Apakah Anda merasa waktu respons dari Unit Layanan Terpadu sudah cukup memadai?', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 'Bagaimana pendapat Anda tentang kualitas komunikasi antara Anda dan petugas layanan selama proses ini?', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(6, 'Apakah Anda merasa kebutuhan dan pertanyaan Anda terpenuhi dengan baik selama proses pengajuan?', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(7, 'Seberapa efisien menurut Anda sistem pengajuan ini dalam memproses permohonan Anda?', '2024-03-24 15:17:10', '2024-03-24 15:17:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan_surveis`
--

CREATE TABLE `pertanyaan_surveis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `id_survei` bigint(20) UNSIGNED NOT NULL,
  `id_pertanyaan` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `pertanyaan_surveis`
--

INSERT INTO `pertanyaan_surveis` (`id`, `id_survei`, `id_pertanyaan`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 1, 7, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 3, 2, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 3, 5, '2024-03-24 15:17:11', '2024-03-24 15:17:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `prodis`
--

CREATE TABLE `prodis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_prodi` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `prodis`
--

INSERT INTO `prodis` (`id`, `nama_prodi`, `created_at`, `updated_at`) VALUES
(1, 'S1 Terapan Teknologi Rekayasa Perangkat Lunak', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 'S1 Terapan dan Bisnis Digital', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 'S1 Terapan Teknologi Rekayasa Komputer', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 'D3 Teknik Sipil', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 'S1 Terapan Teknologi Rekayasa Konstruksi Jalan & Jembatan', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(6, 'S1 Terapan Teknologi Rekayasa Manufaktur', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(7, 'S1 Terapan Teknik Manufaktur Kapal', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(8, 'S1 Terapan Agribisnis', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(9, 'S1 Terapan Teknologi Pengolahan Hasil Ternak', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(10, 'S1 Terapan Manajemen Bisnis Pariwisata', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(11, 'S1 Terapan Destinasi Pariwisata', '2024-03-24 15:17:10', '2024-03-24 15:17:10');

-- --------------------------------------------------------

--
-- Struktur dari tabel `progress_pengajuans`
--

CREATE TABLE `progress_pengajuans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `pesan` text NOT NULL,
  `file_dokumen` varchar(255) DEFAULT NULL,
  `tanggal` date NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `id_pengajuan` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `progress_pengajuans`
--

INSERT INTO `progress_pengajuans` (`id`, `pesan`, `file_dokumen`, `tanggal`, `status`, `id_pengajuan`, `created_at`, `updated_at`) VALUES
(1, 'Dokumen Berhasil Diunggah', NULL, '2024-05-11', 'Formulir Pengajuan Berhasil Terkirim', 'b9586829-502a-4fd7-a656-f0ed108561f3', '2024-05-11 06:47:10', '2024-05-11 06:47:10'),
(2, 'Sedang Menunggu Direktur', NULL, '2024-05-11', 'Dokumen Diproses', 'b9586829-502a-4fd7-a656-f0ed108561f3', '2024-05-11 06:52:34', '2024-05-11 06:52:34'),
(3, 'Dokumen Telah Selesai Ditanda tangani', NULL, '2024-05-11', 'Dokumen Selesai', 'b9586829-502a-4fd7-a656-f0ed108561f3', '2024-05-11 06:53:44', '2024-05-11 06:53:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `sarans`
--

CREATE TABLE `sarans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `saran` text DEFAULT NULL,
  `id_pengajuan` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `sarans`
--

INSERT INTO `sarans` (`id`, `nama`, `email`, `saran`, `id_pengajuan`, `created_at`, `updated_at`) VALUES
(1, 'Taufik Hidayat', 'taufikhidayat09121@gmail.com', 'Bagus', 'b9586829-502a-4fd7-a656-f0ed108561f3', '2024-05-11 06:48:36', '2024-05-11 06:48:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `skors`
--

CREATE TABLE `skors` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `skor` tinyint(4) NOT NULL DEFAULT 1,
  `id_pengajuan` varchar(255) NOT NULL,
  `id_pertanyaan_survei` bigint(20) UNSIGNED NOT NULL,
  `id_saran` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `skors`
--

INSERT INTO `skors` (`id`, `skor`, `id_pengajuan`, `id_pertanyaan_survei`, `id_saran`, `created_at`, `updated_at`) VALUES
(1, 4, 'b9586829-502a-4fd7-a656-f0ed108561f3', 1, 1, '2024-05-11 06:48:36', '2024-05-11 06:48:36'),
(2, 4, 'b9586829-502a-4fd7-a656-f0ed108561f3', 2, 1, '2024-05-11 06:48:36', '2024-05-11 06:48:36'),
(3, 5, 'b9586829-502a-4fd7-a656-f0ed108561f3', 3, 1, '2024-05-11 06:48:36', '2024-05-11 06:48:36'),
(4, 5, 'b9586829-502a-4fd7-a656-f0ed108561f3', 4, 1, '2024-05-11 06:48:36', '2024-05-11 06:48:36');

-- --------------------------------------------------------

--
-- Struktur dari tabel `surveis`
--

CREATE TABLE `surveis` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nama_survei` varchar(255) NOT NULL,
  `tahun` smallint(6) NOT NULL,
  `status` enum('Aktif','Tidak Aktif') NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `surveis`
--

INSERT INTO `surveis` (`id`, `nama_survei`, `tahun`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Kepuasan Umum', 2023, 'Aktif', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 'Proses Pengajuan', 2023, 'Tidak Aktif', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 'Kualitas Informasi', 2023, 'Aktif', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 'Saran dan Umpan Balik', 2023, 'Tidak Aktif', '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 'Tes Survei Baru', 2024, 'Aktif', '2024-05-11 06:34:13', '2024-05-11 06:34:13');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'ultpoliwangi', 'ultpoliwangi@gmail.com', NULL, '$2y$10$Zst/FK1qQ1htG.s2bdlAF.4Q5xmZ84gjAoTak9soK5C9dk.G/oefi', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(2, 'sekretaris', 'sekretaris@gmail.com', NULL, '$2y$10$ip7KYOX4arNkdArSE1FbQe6fe7CQ4vbQVNDmsgsVEMHxo8vaYXV/S', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(3, 'keuangan', 'keuangan@gmail.com', NULL, '$2y$10$/XS7i/aWCv7GtfSqFdSKHuL/GPvyQFWYbC9kBP4uD3KmAyomtpXYC', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(4, 'akademikdankemahasiswaan', 'akademikdankemahasiswaan@gmail.com', NULL, '$2y$10$sDSbJaQ5CL1.yzigRGSjE.KJOB9m7bSMPrw/MrrXFboLAznQJlRmC', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(5, 'umumdankepegawaian', 'umumdankepegawaian@gmail.com', NULL, '$2y$10$vLcD9DBCBaE3w0AMAZA51.Jm0ToEQnMvKPj1pvrULPxEqajX6JkkW', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(6, 'pengadaan', 'pengadaan@gmail.com', NULL, '$2y$10$gF41NYizjhqY1LpQcKg43.jdTayLRyvYsrGbJnA5KFyw24xUmRoJW', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(7, 'barangmiliknegara', 'barangmiliknegara@gmail.com', NULL, '$2y$10$aZT8Al7jQXZSMjReCP1AVeegGt.yXMSnk4TRpNpM6zQXRT8UfrM8y', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(8, 'konsultasi', 'konsultasi@gmail.com', NULL, '$2y$10$ydUz8UIQLuj1JmLWYtjp.O2j8z9tehHLDWpxqq0OgWAJofo7iEQm.', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(9, 'other', 'other@gmail.com', NULL, '$2y$10$3LwrQ8jlTa7X.LP7cThZleLclaLaYficYo63Fei2pWUUdrOEYCmNe', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(10, 'tefa', 'magangti2023@gmail.com', NULL, '$2y$10$M8n3d7a1i6LjQLEdyzQB5escqV3Ib.fYukrrOaGYZIYn9tKwYo/gm', NULL, '2024-03-24 15:17:10', '2024-03-24 15:17:10'),
(11, 'tesuserbaru', 'test@gmail.com', NULL, '$2y$10$L/F6D9Dob9i1zgIum5NfxuW.Ftsu3BxIkgCPUtsHFTYHM4IMnBzkm', NULL, '2024-05-11 06:39:13', '2024-05-11 06:39:13');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admins_id_user_foreign` (`id_user`),
  ADD KEY `admins_id_divisi_foreign` (`id_divisi`);

--
-- Indeks untuk tabel `berkas`
--
ALTER TABLE `berkas`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `berkas_layanans`
--
ALTER TABLE `berkas_layanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `berkas_layanans_id_berkas_foreign` (`id_berkas`),
  ADD KEY `berkas_layanans_id_layanan_foreign` (`id_layanan`);

--
-- Indeks untuk tabel `divisis`
--
ALTER TABLE `divisis`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indeks untuk tabel `layanans`
--
ALTER TABLE `layanans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `layanans_id_divisi_foreign` (`id_divisi`);

--
-- Indeks untuk tabel `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `panduans`
--
ALTER TABLE `panduans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- Indeks untuk tabel `pengajuans`
--
ALTER TABLE `pengajuans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pengajuans_kode_tiket_unique` (`kode_tiket`),
  ADD KEY `pengajuans_id_prodi_foreign` (`id_prodi`),
  ADD KEY `pengajuans_id_layanan_foreign` (`id_layanan`);

--
-- Indeks untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indeks untuk tabel `pertanyaans`
--
ALTER TABLE `pertanyaans`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pertanyaan_surveis`
--
ALTER TABLE `pertanyaan_surveis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pertanyaan_surveis_id_survei_foreign` (`id_survei`),
  ADD KEY `pertanyaan_surveis_id_pertanyaan_foreign` (`id_pertanyaan`);

--
-- Indeks untuk tabel `prodis`
--
ALTER TABLE `prodis`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `progress_pengajuans`
--
ALTER TABLE `progress_pengajuans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `progress_pengajuans_id_pengajuan_foreign` (`id_pengajuan`);

--
-- Indeks untuk tabel `sarans`
--
ALTER TABLE `sarans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sarans_id_pengajuan_foreign` (`id_pengajuan`);

--
-- Indeks untuk tabel `skors`
--
ALTER TABLE `skors`
  ADD PRIMARY KEY (`id`),
  ADD KEY `skors_id_pengajuan_foreign` (`id_pengajuan`),
  ADD KEY `skors_id_pertanyaan_survei_foreign` (`id_pertanyaan_survei`),
  ADD KEY `skors_id_saran_foreign` (`id_saran`);

--
-- Indeks untuk tabel `surveis`
--
ALTER TABLE `surveis`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admins`
--
ALTER TABLE `admins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `berkas`
--
ALTER TABLE `berkas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `berkas_layanans`
--
ALTER TABLE `berkas_layanans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `divisis`
--
ALTER TABLE `divisis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `layanans`
--
ALTER TABLE `layanans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT untuk tabel `panduans`
--
ALTER TABLE `panduans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pertanyaans`
--
ALTER TABLE `pertanyaans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan_surveis`
--
ALTER TABLE `pertanyaan_surveis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `prodis`
--
ALTER TABLE `prodis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT untuk tabel `progress_pengajuans`
--
ALTER TABLE `progress_pengajuans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `sarans`
--
ALTER TABLE `sarans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `skors`
--
ALTER TABLE `skors`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `surveis`
--
ALTER TABLE `surveis`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `admins`
--
ALTER TABLE `admins`
  ADD CONSTRAINT `admins_id_divisi_foreign` FOREIGN KEY (`id_divisi`) REFERENCES `divisis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `admins_id_user_foreign` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `berkas_layanans`
--
ALTER TABLE `berkas_layanans`
  ADD CONSTRAINT `berkas_layanans_id_berkas_foreign` FOREIGN KEY (`id_berkas`) REFERENCES `berkas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `berkas_layanans_id_layanan_foreign` FOREIGN KEY (`id_layanan`) REFERENCES `layanans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `layanans`
--
ALTER TABLE `layanans`
  ADD CONSTRAINT `layanans_id_divisi_foreign` FOREIGN KEY (`id_divisi`) REFERENCES `divisis` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengajuans`
--
ALTER TABLE `pengajuans`
  ADD CONSTRAINT `pengajuans_id_layanan_foreign` FOREIGN KEY (`id_layanan`) REFERENCES `layanans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pengajuans_id_prodi_foreign` FOREIGN KEY (`id_prodi`) REFERENCES `prodis` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pertanyaan_surveis`
--
ALTER TABLE `pertanyaan_surveis`
  ADD CONSTRAINT `pertanyaan_surveis_id_pertanyaan_foreign` FOREIGN KEY (`id_pertanyaan`) REFERENCES `pertanyaans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pertanyaan_surveis_id_survei_foreign` FOREIGN KEY (`id_survei`) REFERENCES `surveis` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `progress_pengajuans`
--
ALTER TABLE `progress_pengajuans`
  ADD CONSTRAINT `progress_pengajuans_id_pengajuan_foreign` FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `sarans`
--
ALTER TABLE `sarans`
  ADD CONSTRAINT `sarans_id_pengajuan_foreign` FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuans` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `skors`
--
ALTER TABLE `skors`
  ADD CONSTRAINT `skors_id_pengajuan_foreign` FOREIGN KEY (`id_pengajuan`) REFERENCES `pengajuans` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `skors_id_pertanyaan_survei_foreign` FOREIGN KEY (`id_pertanyaan_survei`) REFERENCES `pertanyaan_surveis` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `skors_id_saran_foreign` FOREIGN KEY (`id_saran`) REFERENCES `sarans` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

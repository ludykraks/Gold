---
layout: "layouts/blog-base.html"
title: "How to Download Website Files Faster Using FTP"
---

Downloading a website through FTP can take hours, even when the site is only a few gigabytes. The problem is often not your internet speed.

Websites, especially WordPress sites, can contain thousands of small files. Your FTP client has to process each one individually.

A much faster approach is to **compress the website files on the server first, then download the archive as a single file**.

## 1. Compress Your Website Files

Open your hosting control panel and go to **File Manager**.

Common locations include:

- **SiteGround:** Site Tools → Site → File Manager
- **Namecheap/cPanel:** cPanel → File Manager
- **Hostinger:** hPanel → File Manager
- **Bluehost:** Hosting → File Manager

Find your website folder. For WordPress, this is often `public_html` or a folder inside it.

Select the folder and choose **Compress**, **Archive**, or the equivalent option provided by your host.

Create a ZIP or TAR.GZ file, such as:

`website-backup.zip`

Instead of downloading thousands of individual files, you now have one archive to transfer.

## 2. Download the Archive Using FTP or SFTP

Connect to your hosting account using an FTP client such as:

- WinSCP
- FileZilla
- Cyberduck
- Transmit
- ForkLift

You will normally need your hostname, username, password and port.

If your host supports **SFTP**, use it instead of standard FTP because the connection is encrypted.

Locate the archive you created and download it to your computer. Once the download is complete, extract it locally.

## Why Is This Faster?

FTP has overhead for every file it transfers.

A WordPress installation containing 50,000 files requires thousands of individual file operations.

Compressing the site changes the process to:

`50,000 files → 1 archive → 1 download`

This can significantly reduce transfer time, especially for sites with many plugins, themes, cached files and media.

## Don't Forget the WordPress Database

If you are downloading a WordPress website for backup or migration, the website files alone are not enough. You should also export its MySQL or MariaDB database.

First, open your site's `wp-config.php` file and find:

~~~php
define( 'DB_NAME', 'your_database_name' );
~~~

The value of `DB_NAME` tells you which database belongs to that WordPress installation.

Open **phpMyAdmin** from your hosting control panel, select that database and choose **Export**.

For a standard backup:

1. Select **Quick** as the export method.
2. Select **SQL** as the format.
3. Click **Export** or **Go**.

Your browser should download a file similar to:

`database.sql`

Your backup should now contain:

~~~text
wordpress-backup/
├── website-files.zip
└── database.sql
~~~

These two files contain the core components needed for a manual WordPress backup or migration.

**Important:** If your hosting account contains multiple databases, don't export all of them. Export the specific database identified by `DB_NAME` in that website's `wp-config.php`.

## Quick Tip

Before downloading a large website through FTP, check whether your hosting provider lets you compress the website folder first.

Spending a few minutes creating an archive on the server can save a significant amount of transfer time.

## Safety

Delete the Archived and Database Files from Your Public Folder after downloading them locally for your safety. 
---
title: "Installing (encrypted) Arch Linux on an Apple MacBook Pro"
displayTitle: "Installing (encrypted) Arch Linux on an Apple MacBook Pro"
date: 2016-03-05 11:35:00
metaDescription: "A howto guide for installing encrypted Arch Linux on an Apple MacBook Pro with battery optimization and the Awesome window manager."
metaKeywords: Apple, MacBook, MacBook Pro, encryption, linux, Arch Linux, GNU/Linux,
metaOgType: "article"
author: "0xADADA"
license: cc-by-nc-sa
tags: [projects, open-source, linux]
---


In the style of [Michael Chladek](https://mchladek.me/post/arch-mbp/),
I thought it would be useful to my future-self and others, if I wrote up
a summary of installing Arch Linux on Apple MacBook hardware. Of course
there are other guides out there, but this one is specific to the needs
of someone looking for a minimalist, reproducible, secure, performance oriented
installation of Arch Linux.

In following this guide, I've made some decisions that are entirely based
on my own (subjective) opinions. These opinions are based on my experiences
with other operating systems and distros, and a number of window
managers I've tried.

My decisions (take them or leave them):

* Distribution: Arch Linux
* Full disk encryption: On
* Window Manager: Awesome
* Typography: infinality-bundle with the "Free" preset

This article assumes you're currently running on a MacBook Pro between
generation 7,1 (Mid-2010), 8,2 (Early-2011) or 11,3 (Late-2013). It assumes you're running
OS X and already have some experience with Linux commands, disk partitions
and GNU/Linux. I've tested this guide on both of the above generations, but
I'm assuming it'll work on anything in between. However, I make no guarantees.

If you just want to get on to the installation, skip to this link:
[Installing Arch](#installing-arch).

**Contents**:

* [Background](#background)
  * [Why Apple?](#why-apple)
  * [Why Arch?](#why-arch)
  * [Why Awesome?](#why-awesome)
* [Preparing to Install Arch](#preparing-to-install-arch)
  * [Getting the Installation Media](#getting-the-installation-media)
  * [Preparing the Installation USB Drive](#preparing-the-installation-usb-drive)
* [Installing Arch](#installing-arch)
  * [Test Internet](#test-internet) and [Set the System Clock](#set-the-system-clock)
  * [Partition the Hard Drive](#partition-the-hard-drive)
  * [Configuring Drive Encryption and LVM](#configuring-drive-encryption-and-lvm)
  * [Select a Mirror](#select-a-mirror)
  * [Install the Base System](#install-the-base-system)
  * [Generate the fstab](#generate-the-fstab)
  * [Configure The System](#configure-the-system)
  * [Boot Loader](#boot-loader)
  * [Reboot into New Installation](#reboot-into-new-installation)
* [Configuring Arch](#configuring-arch)
  * [Install an Arch User Repository Package Manager](#install-an-arch-user-repository-package-manager)
  * [Configure Sound](#configure-sound)
  * [Install X and Video Drivers](#install-x-and-video-drivers)
  * [Some GUI Applications](#some-gui-applications)
  * [Improved Typography](#improved-typography)
  * [Window Manager Awesome](#window-manager-awesome)
  * [Touchpad Support](#touchpad-support)
  * [Configuring Wireless](#configuring-wireless)
  * [Done!](#done)
* [Fine Tuning](#fine-tuning)
  * [Display Color Profile](#display-color-profile)
  * [Display Color Correction](#display-color-correction)
  * [Power Management](#power-management)
  * [Laptop Mode Tools](#laptop-mode-tools)
  * [acpid](#acpid)
  * [CPU Frequency Scaling](#cpu-frequency-scaling)
  * [Temperature Management](#temperature-management)
  * [Fan Control](#fan-control)
  * [Apple Keyboard](#apple-keyboard)
  * [Apple Trackpad](#apple-trackpad)
* [Conclusion](#conclusion)
* [References](#references)
* [Footnotes](#footnotes)


This article will be installing Arch Linux alongside OS X, dual-booting such
that you can easily boot into either. I recommend this, even if you’re not
going to be using OS X at all, because right now (and likely for the foreseeable
future) the only way to get firmware updates installed on your machine will be via OS X.
There have been Linux kernel–MacBook Pro firmware compatibility issues in the
past that have been fixed by OS X updates that installed firmware fixes.

I assume you have already repartitioned your drive giving you plenty of free
space for Arch. On my 500GB drive, I left 80GB for OS X (probably much more
than really necessary) and the rest I left free for Arch.

**Conventions**

For commands typed as the normal user, I will not prefix them:

```bash
uname -a
```

For commands that need to be executed as a root account, i will prefix
them with a hash-mark: `#`

```bash
# uname -a
```


## Background

### Why Apple

I've been using OS X as my primary OS since 2011 when I bought my first
Apple product, the 15" MacBook Pro 8,2− which I still use today (March 2016,
on which I'm writing this article). This alone is a testament to its' longevity
as a computing platform. The industrial design of the hardware is a pleasure
to the eyes and is much imitated. The hardware feels
wonderful to the touch. I've disassembled a few of them, and despite the
security screws, they're fairly easy to repair or upgrade. Only recently had
I felt that its' age was starting to show, so last week I doubled the ram
from 8GB to 16GB and upgraded the hard drive to a 512GB SSD. This should
provide at least another two years of life for this hardware.

Recently however, Apple has
changed their hardware design philosophy from a fairly open platform to a
more proprietary and disposable one. They've eliminated the ability to
change or upgrade components. The
[3rd generation MacBooks](https://en.wikipedia.org/wiki/MacBook_Pro#3rd_generation_.28Retina.29)
have a battery that is glued in place, the memory is soldered
directly to the logic board. Later models would come with the hard drive
soldered down as well.

[Lyle Wiens of iFixIt, said it best in 2012](http://ifixit.org/blog/2763/the-new-macbook-pro-unfixable-unhackable-untenable/)

> When Apple dropped the MacBook Air to $999 in 2010 to match the price
> point of the MacBook, they gave users a clear choice: the thin, light,
> and un-upgradeable MacBook Air or the heavier, longer lasting, [upgradable],
> more rugged, and more powerful MacBook. Same price, two very different
> products. At the time, I wasn’t very happy with the non-upgradeable RAM
> on the MacBook Air, but I respected that Apple had given their users a
> choice. It was up to us: Did we want a machine that would be stuck with
> 2GB of RAM forever? Would we support laptops that required replacement
> every year or two as applications required more memory and batteries
> atrophied?
>
> Consumers overwhelmingly voted yes, and the Air grew to take 40 percent
> of Apple’s notebook sales by the end of 2010.

This sort of vendor-lock down and
[planned-obsolecence](https://en.wikipedia.org/wiki/Planned_obsolescence)
has bothered me to such an extent that the next laptop I buy won't be Apple
hardware.

Meanwhile, Apple has secured an
[oligopoly](https://en.wikipedia.org/wiki/Oligopoly) in the market, they
have such a dominant position with hardware manufacturers that they seem
to be squeezing competitors out of getting access to top-quality
components (or their competitors don't care about quality).
These manufacturers seem to be building computers with "Apples' scraps
and leftovers".

Put simply; I don't see any manufacturers building laptops at the same
level of quality that Apple does, and yet, I can't buy a
product<sup class="Ref" id="ref:cite:1">[[1](#cite:1)]</sup>
that is so tightly controlled. Finally, I refuse to buy a product that is
designed to be obsolete in two years.


### Why Arch?

I first started using Linux in 1997 when I bought a [shrink-wrapped box
of RedHat Linux 5.2](https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Redhat_5.2_box.jpg/220px-Redhat_5.2_box.jpg).
At the time, my internet connection was fast but not reliable enough
to download the ISO image over a 1-day dial-up session. Since then I've
tried Slackware, SuSE, Mandrake, Debian, Fedora,
Ubuntu, CentOS, and Mint. I customized the hell out of my distros, I performance
tweaked, secured and customized the GUI. Back then, information
was hard to come by, the community was still small and poorly documented,
and that hardly mattered when I couldn't access the internet because my
ethernet card drivers wouldn't compile.

[Jen Andre sums it up
best](https://medium.com/@fun_cuddles/linux-of-the-90s-or-why-i-have-linux-desktop-ptsd-1f276a7887fb#.jwg8up61m)

> You kids these days. You have it easy.

It was enjoyable for a while, but I got very busy and eventually came
to the conclusion that "Linux is free if your time is worth nothing" and
stuck with OS X. I would occasionally install and try a different distro
just to see if the OSS operating system world had changed, but that was
about it.

Arch is different however. Arch gets it, Arch gets it right. Arch is what
I was searching for all those years.

1. A rolling release cycle keeps everything fresh
1. I'm a huge advocate for their KISS Principal: Keep it Simple…
1. The documentation is widely regarded as the best source of info on GNU/linux
1. The Core package repository is very well maintained and trusted
1. The User package repository is great at providing pretty much
   everything you could need or want
1. Its designed for people who want to understand and build a system from
   the ground up. Install only what you know, only what you understand.
   It doesn't hide anything behind assumptions, scripts or fancy installers.

> Arch is like a sandbox, they provide the box and a source of sand (the
  Core and User package repos), but it's up to you to fill it and
  build your castle.


### Why Awesome?

Like the topic of GNU/Linux distros, I could spend an entire post talking
about why I settled on Awesome. I've tried GNOME, KDE, even Enlightenment.
They all are trying to do more than I need, are too influenced by the design
of the Big Desktop players and pander to novices at the expense of the
power users.

All I really need is a quick way to switch between windows and resize
them as needed and for it to be fast. The focus of the window manager is
the application contents, not the chrome eye-candy around the edges of the
window.

Awesome was designed for this.

So, this guide is going to install Awesome as it's window manager. Feel
free to switch it out for whatever you prefer. i3, xmonad and DWM are all
similar in design.


## Preparing to Install Arch

When doing this article, I found many other articles very useful. They are
listed in [References](#references). Please refer to them if needed. I will
attempt to both update and condense these articles to a single
"Be-all End-all Guide" to MacBook installation.

### Getting the Installation Media

First, we need to get Arch Linux ISO from Arch Linux, [Go here to
download it](https://www.archlinux.org/download/)

I usually go with the torrent option. It's the fastest.

Next, we’re just going to make sure the download wasn’t corrupted or
tampered with in transit. To make this possible, the Arch Linux ISO publisher
has posted a cryptographic hash of the ISO. We can compare the hash
of the ISO they published against the hash of the ISO we downloaded. If the
hash is identical, we know the contents are exactly the same. Start the
terminal and run the following:

```bash
sha1sum <FILE>.iso
```

Next, we want to make sure the the ISO we've downloaded is provably supplied
by the Arch Linux team. We can do this by verifying the cryptographic
signature they provided with the ISO. The Arch team cryptographically signs their ISO
images using public-key cryptography. This ensures that the ISO file we've
downloaded is verifiably provided by the Arch Linux team, and not an impostor.

This assumes you have GnuPG installed on your
system (`brew install gnupg`). On the ISO download page, there is a link
under “Checksums” to get the PGP signature as a `.sig` file. Download
that into the same directory as your Arch ISO. Then run the
following, replacing the filename (here i use `archlinux-2016-02-01-dual.iso`)
with the name of the files you've downloaded:

```bash
gpg --verify \
    archlinux-2016.02.01-dual.iso.sig \
    archlinux-2016.02.01-dual.iso 2>&1 | \
    grep 'key ID' | \
    gpg --recv-keys 2>&1 `awk '{print $NF}'` && \
gpg --verify archlinux-2016.02.01-dual.iso.sig \
    archlinux-2016.02.01-dual.iso 2>&1 | grep 'signature from'
```

This will first attempt to verify the signature, and if you don't have the
signers key, it'll retrieve it. It'll then try to verify it again, and
should print out "Good signature" if it succeeds. If you get "Bad signature"
this means the ISO has either been forged by an impostor pretending to be
the Arch linux team, or someone has tampered with the ISO stored on their
servers or in transit. If thats the case, you need to find an alternate
source to download the ISO.


### Preparing the Installation USB Drive

This installation method will first create a bootable USB stick, which is
used to boot into a "Live" Arch Linux session. From there, we use the Live
Arch Linux to install Arch onto your MacBook hard drive, then make that
partition bootable.

If you're currently running a GNU/Linux system, follow the instructions
in [Part A](#part-a---preparing-the-installation-usb-drive-for-linux). If
you're running OS X, [jump one section ahead to
Part B](#part-b---preparing-the-installation-usb-drive-for-osx).


#### Part A - Preparing the Installation USB Drive for Linux

If you're already on a GNU/Linux system, use these instructions to create
USB bootable Arch Linux live system.

Now we’re ready to get that ISO onto a USB drive so we can boot the computer
from it. Before inserting the thumb drive, run `lsblk` and take note of the
drives listed. Insert the drive and run `lsblk` again. Take note of the
new letter in the `sdX` list of drives.

Replace the `X` with the letter on your system. Be sure to unmount the new
drive.

```bash
umount /dev/sdX
```

Next, run the following command, it reads the ISO file you downloaded earlier
and writes the contents directly to the USB drive, without the operating
system buffering the writes. Replace the `X` with the letter of the USB
stick you took note of earlier, and `ARCHLINUX` with the name of the image
file you downloaded.

```bash
dd if=ARCHLINUX.iso of=/dev/sdX bs=4M
```

After that’s run, the USB drive should be ready to boot from.


#### Part B - Preparing the Installation USB Drive for OSX

Now we’re ready to get that ISO onto a USB drive so we can boot the computer
from it. Before inserting the thumb drive, run `diskutil list` and take note of the
drives listed. You should see output similar to this:

    /dev/disk0
       #:                       TYPE NAME          SIZE       IDENTIFIER
       0:      GUID_partition_scheme               500.1 GB   disk0
       1:                        EFI               209.7 MB   disk0s1
       2:          Apple_CoreStorage               399.5 GB   disk0s2
       3:                 Apple_Boot Recovery HD   650.0 MB   disk0s3
       5:                 Apple_Boot Boot OS X     134.2 MB   disk0s5
    /dev/disk1
       #:                       TYPE NAME          SIZE       IDENTIFIER
       0:                  Apple_HFS MacOSX        399.2 GB   disk1

Insert the drive and run `diskutil list` again. Take note of the new letter
in the `sdX` list of drives.

    /dev/disk0
       #:                       TYPE NAME          SIZE       IDENTIFIER
       0:      GUID_partition_scheme               500.1 GB   disk0
       1:                        EFI               209.7 MB   disk0s1
       2:          Apple_CoreStorage               399.5 GB   disk0s2
       3:                 Apple_Boot Recovery HD   650.0 MB   disk0s3
       5:                 Apple_Boot Boot OS X     134.2 MB   disk0s5
    /dev/disk1
       #:                       TYPE NAME          SIZE       IDENTIFIER
       0:                  Apple_HFS MacOSX        399.2 GB   disk1
    /dev/diskX
       #:                       TYPE NAME          SIZE       IDENTIFIER
       0:      GUID_partition_scheme               2.0 GB     disk2
       1:       Microsoft Basic Data UNTITLED 1    2.0 GB     disk2s1

Note `/dev/diskX` has appeared ('X' will be a number on your system), this
new disk is the USB thumb drive. **Important** *take note of the number
of this drive*.

We're going to remove the existing partitions and erase all the data so its
clean for our Arch Linux installer. This will delete all the data on the
USB drive. Make sure to substitute `/dev/diskX` for the drive number you
noted above.

```bash
diskutil partitionDisk /dev/diskX 1 "Free Space" "unused" "100%"
```

Now<sup class="Ref" id="ref:note:4">[[4](#note:4)]</sup> we can write the iso file to the USB
drive. **Note** We use `/dev/rdisk*` instead of `/dev/disk` because
it provides Raw disk access without the typical buffering the operating
systemprovides. Substitute `DESTINATION` with the name of the `iso` file
you downloaded earlier, and substitute the `X` with the number of the drive.

```bash
dd if=DESTINATION.iso of=/dev/rdiskX bs=1m
```

The `dd` command does not show any output before it has finished the copy
process, so be patient and wait for it to complete, it can take around
1 - 5 minutes. When the command does complete OS X will try to mount the
drive and fail as it won't recognize the formatting. Click ignore.


## Installing Arch

With the USB drive plugged in, restart the MacBook and press+hold down the
left `option/alt` key when you hear the startup chime. Hold the `option`
key down until the drive screen appears.

The USB drive should be one of the options. Pick it along with the first option
the following boot screen lists. Now you should be at the Arch live install
prompt and it'll look like this:

    Arch Linux 3.17.6-1-ARCH (tty1)

    archiso login: root (automatic login)
    root@archiso ~ #

You are now running a "Live" session of Arch Linux from the USB stick.

If you're on a HiDPI / "Retina" display MacBook, the prompt is really small.
Increase the font-size using `setfont sun12x22`.


### Test Internet

You'll need a working Internet connection to do the post-install. My MacBook
Pro 7,1 and 8,2 both have Ethernet ports, but some of you will have later
models without one. You should get a USB-Ethernet adapter. Its much easier
than fiddling with wireless drivers as it works out of the box. We'll setup
the wireless drivers later in this article.

First, we need to get an IP address from your router:

```bash
dhcpcd
```

With the adapter plugged in and an IP address, make sure internet is flowing
by pinging Google:

```bash
ping -c 3 www.google.com
```

You should get a response that all three packets were sent and received.


### Set the System Clock

The system clock should be just fine. The general Arch wiki recommends ensuring
the system clock is accurate, and I’ve found it doesn’t seem to break anything.
So, I run it:

```bash
timedatectl set-ntp true
```


### Partition the Hard Drive

A partition is basically a box on the hard drive to put files into. OS X
has a box for its files, and we're going to create box(es) for GNU/Linux.
Partitioning the hard drive takes existing data on the
drive and moves or erases it to make space available for other file systems.

This part is the trickiest because it can erase data on the disk, so take
care.

Apple uses the GUID Partition Table (GPT), and we're going to
keep that partition table.

In order to proceed you'll need to know the drive mapping scheme,
we'll use `fdisk` to check the scheme:

```bash
fdisk -l
```

This lists the existing partitions. If you created two partitions when
preparing the MacBook, you should see a partition with a Type of `Apple
HFS/HFS+` with a size that matches the size you set aside for Arch. In
my case this was `/dev/sda5`. All the partitioning commands below will use
`/dev/sda5`, **you should substitute the designation for your drive**.

Lets use `cgdisk` to view the partition table on the attached devices:
Replace the `Y` with the drive you'll be using to install Arch Linux.

```bash
cgdisk /dev/sdY
```

At the end of the partition table should be the free space you set aside
for installing Arch. With that space, we're going to create a new
partition. You just need to make one partition; we’re going to break it
into sub-partitions later; after encryption is setup.

I added 128MB between the last partition and my new partition [because of
this explanation by Apple](https://developer.apple.com/library/mac/technotes/tn2166/_index.html).

> Note: We leave free space after each partition to make it easier for
> future system software to manipulate the partition map in ways that we
> can’t anticipate currently.

Begin by deleting the `HFS` partition created when you set aside space
in OS X for Arch Linux.

In order to leave additional space, just type `+128M` when you create the
new partition, and it'll set the starting sector at a point 128M away from
the ending sector of the partition before it.

You’ll want to use Linux LVM (`8e00`) as the partition type id. The final
partition table will look something like this:

    Part. #     Size        Partition Type            Partition Name
    ----------------------------------------------------------------
    3.0 KiB      free space
    1        200.0 MiB      EFI System                EFI System Partition
    2         74.5 GiB      Apple HFS/HFS+            Macintosh HD
    128.0 MiB      free space
    3        391.1 GiB      Linux LVM                 ArchLinux

Then use the utility to select Write and then confirm that you want to
overwrite the disk. Once the display returns you can Quit.

Running `fdisk -l` again should show your new partition scheme. If it doesn't
look like you want or expected, repeat the `cgdisk` process to fix things
until you're satisfied.


### Configuring Drive Encryption and LVM

You’ll want to make note of the partition number you just created. For me
it’s partition `5`, and the drive is `sda`, so my Arch Linux partition can
be found at `/dev/sda5`. I'll be using that as an example going forward,
**but you should substitute your own drive path**.

We’re going to encrypt `/dev/sda5` using DM-Crypt and then the LVM partitions
are going to be created over that LUKS encryption layer. This system is called
"LVM on LUKS." Both LUKS encryption and LVM support are provided by the
GNU/Linux kernel.

**Note** This will just encrypt the system `/` and `/home` directories. The
`/boot` directory will not be encrypted because we’re going to keep the existing
`/boot` partition: That’s `/dev/sda1` in my partition table above.

If you want to use custom ciphers, there are some great notes
[available on GitHub](https://github.com/NoviceLive/unish/blob/master/doc/arch-install.sh#L101).
You can also use the following command for speed benchmarking to help
determine which ciphers and key-sizes are fast enough for your
particular use case:

```bash
cryptsetup benchmark
```

Time to pick the encryption flavors! The default values for the cipher and
key sizes were a bit too light for my tastes (in light of the NSA spying
scandal). I've increased these numbers above the defaults, I've chosen to
balance my principals for privacy
and security with practical usability and speed. Feel free to [read more
on these settings](https://wiki.archlinux.org/index.php/Dm-crypt/Device_encryption#Encryption_options_for_LUKS_mode).

```bash
cryptsetup --cipher aes-xts-plain64 \
  --key-size 512 \
  --hash sha256 \
  --iter-time 3000 \
  --use-random \
  --verify-passphrase \
  luksFormat /dev/sda5
```

Enter in a good passphrase (twice), and we should be good to go.

Now with the encryption setup, we’re going to create the necessary volumes
and filesystems within the LVM.

First, let’s open up our encrypted partition:

```bash
cryptsetup luksOpen /dev/sda5 lvm
```

This is going to map our encrypted device (`/dev/sda5` in my case) to
`/dev/mapper/lvm`. Now we’re going to create the physical and logical volumes
for the `/` and `/home` directories. I gave the `/` directory 40GB (hopefully
enough for all my programs. As of writing this, and with a full
install, I’m using 10GB on my `/` directory. So, I think I’m good.

Create the physical volume:

```bash
pvcreate /dev/mapper/lvm
```

Now create the volume with the name `vgcrypt`:

```bash
vgcreate vgcrypt /dev/mapper/lvm
```

We're ready to create the logical volumes now, `40GB` for root and the rest for
users’ home, change `40GB` accordingly:

```bash
lvcreate --size 40G --name root vgcrypt
lvcreate --extents +100%FREE --name home vgcrypt
```

We now have our two volumes `vgcrypt-root` and `vgcrypt-home`. They need
to be formatted to a particular filesystem. I’ve been happy with the
`ext4` filesystem.

```bash
mkfs.ext4 /dev/mapper/vgcrypt-root
mkfs.ext4 /dev/mapper/vgcrypt-home
```

We can now mount these new partitions. Make sure to mount the root partition
first so we can create the `/home` directory inside of it for the home
partition:

```bash
mount /dev/mapper/vgcrypt-root /mnt
mkdir -p /mnt/home
mount /dev/mapper/vgcrypt-home /mnt/home
```

Lets also mount our boot partition, while we're here. This is required so
our bootable initramfs can be written to the boot drive:

```bash
mkdir -p /mnt/boot
mount /dev/sda1 /mnt/boot
```

If you're interested in swap partition schemes, [check this script
out](https://github.com/NoviceLive/unish/blob/master/doc/arch-install.sh#L127)
− although I'm fine without swap partitions (Its faster with enough RAM).

And with that, Arch is now ready to be installed on the disk.


### Select a Mirror

This step can optionally be skipped, but I prefer to choose a US server
just in case it may be faster. Open up the mirrorlist:

```bash
vi /etc/pacman.d/mirrorlist
```

Delete or comment out all the servers except one or two near you that seem
good.


### Install the Base System

Actually installing Arch Linux onto the drive is the easiest part:

```bash
pacstrap -i /mnt base base-devel terminus-font
```

The `-i` flag asks for confirmation before installing packages. I like
using it just so I can see what’s being installed. (After all that's part
of the reason for using GNU/Linux, right? To know what’s being installed
on your system.)

This installation includes `terminus-font`, which we'll configure to be the
default console font later on.


### Generate the fstab

If all went according to plan, Arch has been written to the hard drive and
is now installed. Before rebooting into our installation, though, we need
to tell the system where to find the filesystems we created earlier for
root and home directories.

While it’s normally a good idea to use UUIDs to find disks, we’re going to use
labels. This is because our encryption setup generates random IDs for the disks
when they’re decrypted. Let’s create the `fstab` file:

```bash
genfstab -L -p /mnt >> /mnt/etc/fstab
```

The `-L` flag will generate the fstab file with labels instead of UUIDs.
The `-p` flag prevents pseudo-filesystems from being added.

Always check the generated fstab:

```bash
cat /mnt/etc/fstab
```

It should look something like this:

    #
    # /etc/fstab: static file system information
    #
    # <file system>    <dir><type><options>             <dump><pass>
    # /dev/mapper/vgcrypt-root
    /dev/mapper/vgcrypt-root    /           ext4   discard,rw,relatime,data=ordered    0 1

    # /dev/mapper/vgcrypt-home
    /dev/mapper/vgcrypt-home    /home       ext4   discard,rw,relatime,data=ordered    0 2

**Note** If your hard drive is a solid-state drive (SSD) and the `discard`
option isn’t there, edit the fstab file and add it. It's used for
optimizing for the speed of SSDs.


### Configure The System

We’re now ready to configure our new system. Let’s change root into it:

```bash
arch-chroot /mnt /bin/bash
```

Set our system locale. I'm in the US, so I'll only uncomment that locale
from `/etc/locale.gen`:

    ...
    en_US.UTF-8 UTF-8
    en_US ISO-8859-1
    ...

Now generate the locales:

```bash
locale-gen
```

Make English UTF-8 the default:

```bash
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

The default font in the virtual console is not very readable, so lets use
one that is far more readable. We're going to use the typeface "Terminus"
in size 18 that we installed with the base system earlier.
`ter-118n` basically means "Terminus latin-1 size 18 Normal".
There are other sizes available: 12, 14, 16, 20, 22, 24, 28, 32 as well
as support for multiple non-English code pages.

```bash
echo FONT=ter-118n > /etc/vconsole.conf
```

Set the timezone accordingly. (I live on the east coast):

```bash
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime
```

And set the time to the standard UTC:

```bash
hwclock --systohc --utc
```

Because we've encrypted our root disk, we need to make sure the kernel
loads the proper modules to decrypt it on startup. Otherwise we won’t be
able to boot from the unencrypted drive. We're also going to tell the
boot-sequence to load our custom font and keyboard module so we can type
our passwords during boot. Edit `/etc/mkinitcpio.conf` and add
the hooks `consolefont keyboard encrypt lvm2` **BEFORE** `filesystems` so the
HOOKS line looks like this:

    HOOKS="base udev autodetect modconf block consolefont keyboard usbinput encrypt lvm2 filesystems fsck"

Now we need to regenerate the initramfs image:

```bash
mkinitcpio -p linux
```

So that Internet will work on reboot, we need to enable the `dhcpcd` service.
We’re going to keep using the ethernet-USB adapter for right now. We'll get
wireless setup later. Get the name of the ethernet interface:

```bash
ip link
```

It should be `enp`-something. With that, enable the service, make sure you
replace INTERFACE with your interfaces name.

```bash
systemctl enable dhcpcd@INTERFACE.service
```


Finally, let’s configure the machine’s hostname. You can change `macbook`
to whatever you'd like:

```bash
echo macbook > /etc/hostname
```

Add this hostname to the list of hosts. Edit `/etc/hosts` and edit so it
looks something like this:

    #
    # /etc/hosts: static lookup table for host names
    #

    #<ip-address>   <hostname.domain.org>   <hostname>
    127.0.0.1   localhost.localdomain   localhost   macbook
    ::1     localhost.localdomain   localhost   macbook

Set a root password:

```bash
passwd
```

Create a non-root user for yourself and set the user’s password, replace
USER with the username of your choosing:

```bash
useradd --create-home --groups wheel --shell /bin/bash USER
passwd USER
```

This will create the user, add it to the group wheel (traditional group
of users who can run `sudo` commands), create a home
directory under `/home/USER/` and make his default shell `bash` then set
a default password for the user.

Don't switch to the new user yet, because we'e added USER to the group
`wheel`, lets grant the wheel group `sudo` privileges. Run:

```bash
visudo
```

And uncomment the following line so it looks like so:

    %wheel ALL=(ALL) ALL


### Boot Loader

Now we need to let the boot loader know where to find our new Arch Linux
installation. `systemd` (was recently renamed, was Gummiboot) is a nice,
simple boot loader.

```bash
# pacman -S systemd              # May be systemd-boot, included in core?
mkdir -p /boot/loader/entries
```

Setup the loader to default to arch and set the number of seconds to timeout in
the file `/boot/loader/loader.conf`:

```bash
default arch
timeout 3
```

Make sure the correct boot partition (`/dev/sda1` in my case) is mounted on
`/boot` by running:

    findmnt /boot
    -------------------------
    TARGET SOURCE    FSTYPE OPTIONS
    /boot  /dev/sda1 vfat   rw,relatime,fmask=0022,dmask=0022,codepage=437,iocharset=iso8859-1,shortname=mixed,err


Now we’re going to create an entry called `/boot/loader/entries/arch.conf`
that looks like this:

    # /boot/loader/entries/arch.conf
    title   Arch Linux
    linux   /vmlinuz-linux
    initrd  /initramfs-linux.img
    options cryptdevice=/dev/sdaX:vgcrypt:allow-discards root=/dev/mapper/vgcrypt-root rw

**Note**:<sup class="Ref" id="ref:note:7">[[7](#note:7)]</sup> On the options
line, make sure you replace `/dev/sdaX` with the
path to the encrypted linux partition we previously created on your device (It was
`/dev/sda5` in this guide). Additionally, if your drive is *not* a SSD, make sure to
remove `:allow-discards`.

**Note**:<sup class="Ref" id="ref:note:9">[[9](#note:9)]</sup> Its been
reported by some users that when booting to USB, the
USB drive is assigned device id `/dev/sda` and the hard drive to `/dev/sdb`. When rebooting
without USB drive (boot to new encrypted linux drive partition), the hard drive is reassigned
to device id `/dev/sda` which may invalidate the above `arch.conf` boot loader entry. In this
case, the encrypted linux partition will not boot because the boot loader config `arch.conf`
is configured to boot from `/dev/sdb`. In this case you can reboot to USB again, and edit the
options line in `arch.conf` to read `/dev/sdaX`. Replace X with your partition id.

Check the boot tree with `tree /boot/` (If `tree` isn’t installed, install it
with `pacman -S tree`). It should look something like this:

    /boot/
    ├── EFI
    │   ├── APPLE
    │   │   └── EXTENSIONS
    │   │       └── Firmware.scap
    │   ├── Boot
    │   │   └── BOOTX64.EFI
    │   └── gummiboot
    │       └── gummibootx64.efi
    ├── initramfs-linux-fallback.img
    ├── initramfs-linux.img
    ├── loader
    │   ├── entries
    │   │   └── arch.conf
    │   └── loader.conf
    └── vmlinuz-linux

**Note**: At this point, you may want to enable suspend-to-disk (No power
consumption aka "Hibernate" mode). I've chosen not to enable this
functionality, but if you're interested, you can
[read about it here](http://loicpefferkorn.net/2015/01/arch-linux-on-macbook-pro-retina-2014-with-dm-crypt-lvm-and-suspend-to-disk/#suspend-to-disk-uswsusp:385892e3ac2613dca78d22bd09dbae7d).

Now we can have the bootloader write the initramfs onto the boot
partition using `bootctl`, part of the systemd-boot package.

```bash
bootctl install
```


### Reboot into New Installation

Let’s leave the chroot environment we used for the install:

    exit

You can umount and close the encrypted volume:

```bash
umount -R /mnt
cryptsetup close vgcrypt
```

It’s not a bad idea to just double check the encryption to make sure it opens
and mounts properly:

```bash
cryptsetup open /dev/sda5 vgcrypt
mount /dev/mapper/vgcrypt /mnt
```

If all goes accordingly, you can unmount and close the encryption again.
And finally…

```bash
reboot
```

On reboot you should be greeted with the boot menu. After selecting Arch
(or waiting for it to timeout), you should be prompted for your password to
decrypt the drive, and then it should boot into the console.


## Configuring Arch

You should now be running Arch Linux! Lets customize it and make it
more useful.


### Install an Arch User Repository Package Manager

Now we're about to dive deep into customizing Arch Linux installation with
the utilities and application we'll be using on a day-to-day basis. To
facilitate installing packages from the wider Arch User Repository (AUR),
we'll install a utility named `yaourt`. You can (of course) maintain AUR
package installations manually, but I like
a helper to help me manage them. yaourt is like the Homebrew of Arch
Linux. I use [yaourt](https://wiki.archlinux.org/index.php/Yaourt)
because it’s easy to install, takes the same optional flags as `pacman`,
and works well.

You need to use the "official" and manual way of installing AUR packages to get
yaourt installed. It also requires `package-query` from the AUR, so we’re going
to install that first.

Now we’re going to download the `package-query` AUR package, unarchive it,
and use pacman to build and install the package. This allows us to manage
the package as if it was installed with pacman, although we're manually
installing it.

```bash
$ cd ~
$ curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/package-query.tar.gz
$ tar -xvzf package-query.tar.gz
$ cd package-query
```

Within the packages' folder, we’re going to run the following to build it:

```bash
$ makepkg -s
```

This will run as your regular user only asking you for your root password if
necessary. With the package made, we can install it via pacman:

```bash
# pacman -U package-query-1.6.2-1-x86_64.pkg.tar.xz
```

Now we’ll do the same for yaourt:

```bash
$ cd ~
$ curl -L -O https://aur.archlinux.org/cgit/aur.git/snapshot/yaourt.tar.gz
$ tar -xvzf yaourt.tar.gz
$ cd yaourt
$ makepkg -s
# pacman -U yaourt-1.6-1-any.pkg.tar.xz
```

From now on you can use `pacman` and `yaourt` interchangeably… for the most
part. `yaourt` will install Arch repository packages and AUR packages.
`pacman`, though, will continue to only install Arch repository packages.


### Configure Sound

ALSA works out of the box with Macs so install it via:

```bash
# pacman -S alsa-utils
```

Then use:

```bash
alsamixer
```

to control the speakers. Make sure to disable channels for speakers you
don't have. Test your speakers with:

```bash
speaker-test -c 2
```

where 2 is the number of speakers.


### Install X and Video Drivers

As this is going to be a graphical interface, we need are graphics card
up and running with the proper drivers. Luckily this machine uses Intel
graphics, and Intel is pretty good about providing Linux (and sometimes
open-source) drivers.

For Macbookpro 7,1 (Mid-2010 or 8,2 (Early-2011):

```bash
# pacman -S xf86-video-intel mesa-libgl libva-intel-driver libva
```

For Macbookpro 11,3 (Late-2013)<sup class="Ref" id="ref:note:8">[[8](#note:8)]</sup>

```bash
# pacman -S nvidia mesa-libgl libva-intel-driver libva
```

The `-S` flag tells pacman to install the subsequent packages listed.
(Again, you can use yaourt if you’d like.) This will install the Intel video
driver, the Mesa OpenGL graphics library, and video acceleration API for
Intel graphics chipsets. It'll likely ask you to install additional
dependencies. Get all the dependencies!

With the necessary drivers installed, we can get Xorg (or the X Window System)
installed.

```bash
# pacman -S xorg-server xorg-server-utils xorg-xinit xterm
```

I like to install the Xorg utilities, too, because there are at least a couple
I'll use later (either in this guide or another) that are helpful in improving
HiDPI support for the MacBook’s HiDPI Retina display.


### Some GUI Applications

Next we'll install a browser. This will install some typeface dependencies
and font- rendering libraries that we'll be tweaking later.

```bash
# pacman -S firefox
```


### Improved Typography

**Update<sup class="Ref" id="ref:note:10">[[10](#note:10)]</sup>**

**It appears [the package maintainer for Infinality has gone
dark](https://github.com/bohoomil/fontconfig-ultimate/issues/191)**. Skip this
section and [continue to the next](#window-manager-awesome) until there is a
solution for better typography on the linux desktop.

If you use the web and appreciate typography, you'll want to install a
set of decent fonts.

Infinality is a package group that has been meticulously crafted from the
ground-up to provide beautifully rendered typography to the Linux platform.
The package maintainer spent a ton of time tearing down the existing font
stack, and carefully rebuilding it to provide fast-rendering fonts that
more faithfully present the typography than either Windows, OS X or Ubuntu
systems. It also provides a set of preset-configurations that allow the
user to switch to a Windows-like or OS X-like configuration. I highly
recommend [reading the documentation](http://bohoomil.com/doc/) if you'd
like to know more about typography rendering on GNU/Linux.

First add the following package repositories to `/etc/pacman.conf`.

    [infinality-bundle]
    Server = http://bohoomil.com/repo/$arch
    [infinality-bundle-fonts]
    Server = http://bohoomil.com/repo/fonts

Next we'll add the [package maintainers PGP
key](https://bbs.archlinux.org/viewtopic.php?id=162098) to the package
database, update the package database and install the packages.

```bash
# pacman-key -r 962DDE58
# pacman-key --lsign-key 962DDE58
# pacman -Syyu
# pacman -S infinality-bundle
# pacman -S infinality-bundle-fonts
```

Make sure to select the option `fontconfig-infinality-ultimate` as that
configuration [is the most clean, efficient and looks the best out of the
box](http://bohoomil.com/doc/01-overview/). The installation may ask to
use the Infinality packages in place of the dependencies installed by
Firefox. Choose the Infinality packages.

To enable selection of predefined font substitution styles and antialiasing
settings, apart from the rendering settings of the engine itself. After
doing so, you can select the font style (win7, winxp, osx, linux, ...)
with:

```bash
# fc-presets set
```


### Window Manager Awesome

Awesome is a tiling window manager for the user that prefers keyboard
commands to mouse or touchpad, and treats window chrome as needless
ornamentation. Your application content is king, and efficiency is the goal.
Its quick and light. Lets install the window manager (WM), awesome.

To install:

```bash
# pacman -S awesome
```

Added this<sup class="Ref" id="ref:note:5">[[5](#note:5)]</sup> to run `awesome`
when x starts:

    echo exec awesome > .xinitrc


### Touchpad Support

You’ll probably want to use your MacBook’s touchpad when you have a GUI. The
simplest driver is the synaptics driver:

```bash
# pacman -S xf86-input-synaptics
```

The following config at /usr/share/X11/xorg.conf.d/70-synaptics.conf works well
for me, it uses the same "Natural Motion" that OS X does. Copy that file to the
following location `/etc/X11/xorg.conf.d/70-synaptics.conf` and add the options
between the `START` and `END` comments.

    Section "InputClass"
        MatchIsTouchpad "on"
        Identifier      "touchpad catchall"
        Driver          "synaptics"

        # START: Add these options
        # 1 = left, 2 = right, 3 = middle
        Option          "TapButton1" "1"  
        Option          "TapButton2" "3"
        Option          "TapButton3" "2"
        # Palm detection
        Option          "PalmDetect" "1"
        # Horizontal scrolling
        Option "HorizTwoFingerScroll" "1"
        Option "VertTwoFingerScroll" "on"
        # Natural Scrolling (and speed)
        Option "VertScrollDelta" "-450"
        Option "HorizScrollDelta" "-450"
        # END
    EndSection


### Configuring Wireless

Before rebooting into our lovely new GUI, let's get wireless setup to work
when we reboot.

This particular machine has the Broadcom BCM4360 wireless chipset. Broadcom has
been pretty mixed in the FLOSS support it seems. The BCM4360 is not supported
by the kernel itself, so we’ll need to use Broadcom’s non-free, non-open
driver: `broadcom-wl`. I actually don’t think this even officially supports the
BCM4360 chipset, but it works well enough. We’ll need to install the AUR
package:

```bash
$ yaourt -S broadcom-wl dialog wpa_supplicant
```

And activate the kernel module:

```bash
# modprobe wl
```

**Note**: If you update to a newer kernel in the future, you may need to
uninstall and reinstall the `broadcom-wl` package so it updates with the new
linux-header.

We need to stop the dhcpcd service we were using for the ethernet and start
the `wifi-menu`<sup class="Ref" id="ref:note:1">[[1](#note:1)]</sup> utility.
Keeping both running can cause conflicts.

```bash
# systemctl disable dhcpcd.service
# wifi-menu
```

This will create and enable a systemd service that will start when the
computer boots. Changes to the profile file will not propagate to the service
file automatically. After such changes, it is necessary to reenable the
profile:

```bash
# netctl reenable PROFILE
```

After enabling a profile, it will be started at next boot.

Finally, if you find your wireless is dropping connections, you may find
turning off Wi-Fi power management. Simply create this as an executable (
chmod +x `/etc/pm/wireless` and add the following contents:

    #!/bin/sh
    iwconfig wlp2s0 power off


### Done!

Now when you reboot, you should be all set to go start customizing to your
heart’s content, adding applications as you’d like, and playing around with
your new Arch Linux box with Awesome.s

## Fine Tuning

Power settings took quite a bit of tweaking. Without these setting, the laptop
ran very hot, and drained battery life very fast. I would recommend following
these steps to improve battery life. There still may be room for improvement,
though.

One more thing: If you search "MacBook Pro and Arch Linux" you’ll probably read
some things about disabling ACPI interrupts that were causing overheating and
high CPU usage. If you have updated to the latest version of OS X 10.10
"Yosemite" then you should be OK to skip.


### Display Color Profile

I noticed that colors seemed washed-out in Arch Linux, so this task will
attempt to color-correct the display. Luckily a utility `xcalib` exists
that can load color profiles from OS X as X options. This should give
you true color-parity between operating systems.

First, boot into OS X and copy the color profiles located in
`/Library/ColorSync/Profiles/Displays` to somewhere so you can boot into
GNU/Linux and copy them into your home directory. I created a directory
named `~/.colorprofiles` for these files.

Second, install the `xcalib` package from the Arch AUR.

```bash
yaourt -S xcalib
```

Finally you can activate it by running:

```bash
xcalib ~/.colorprofiles/FILENAME.icc
```

Where `FILENAME` is the path to your color profile file.

To load this color profile when X starts, I also added this command to
the `.xinitrc` file in my home directory. Just make sure you replace `FILENAME`
with the name of your color-profile `.icc` file exported from OS X.

```bash
if [ `type -P xcalib` ]; then
  # Use the color profile
  xcalib ~/.colorprofiles/FILENAME.icc
fi;
```


### Display Color Correction

If you spend as many hours looking at the display as I do, you'll quickly
appreciate a display that adapts its colors to the time of day.
[F.lux](https://justgetflux.com) adjusts monitor color temperature
adaptively to ease eye strain.

```bash
yaourt -S xfluxd
```

Then edit `/etc/xfluxd.conf` to set your rough lat/long coordinates (in
decimal format) in order to correctly shift the color correction with the
sunrise and sunset.

Finally, enable and start the `xfluxd` service. **Note** you should run
this as your normal user, not as root.

```bash
systemctl enable --user xfluxd
systemctl start --user xfluxd
```


### Power Management

The power management from Arch out of the box is not very good.
There are a few good tools out there, but `PowerTOP` is nice because of
its benchmarking utilities<sup class="Ref" id="ref:note:2">[[2](#note:2)]</sup>.

> PowerTOP is a tool provided by Intel to enable various powersaving modes
> in userspace, kernel and hardware. It is possible to monitor processes
> and show which of them are utilizing the CPU and wake it from its
> Idle-States, allowing you to identify applications with particular high
> power demands.

```bash
yaourt -S powertop
```

You may want to put your laptop on battery power and calibrate powertop:

```bash
# powertop --calibrate
```

That’ll cause the screen to blackout from time to time. Just let it run. It
takes a few minutes then your screen will come back on.

You can create a systemd service that will launch powertop's autotune
settings on startup.

    # /etc/systemd/system/powertop.service

    [Unit]
    Description=Powertop tunings

    [Service]
    Type=oneshot
    ExecStart=/usr/bin/powertop --auto-tune

    [Install]
    WantedBy=multi-user.target

And enable it to automatically start at boot time, then start it for your
current boot session.

```bash
# systemctl enable powertop.service
# systemctl start powertop.service
```


### Laptop Mode Tools

Laptop Mode Tools<sup class="Ref" id="ref:note:6">[[6](#note:6)]</sup> is a
laptop power saving package for
Linux systems. It is the primary way to enable the Laptop Mode feature of
the Linux kernel, which allows you to tweak a number of other power-related
settings using a simple configuration file. Combined with `acpid` and CPU
frequency scaling, LMT provides a complete notebook power management suite.

```bash
$ yaourt -S laptop-mode-tools
```

If you want to enable laptop mode even on AC power, because you run the laptop
attached to an external keyboard and monitor, edit:

    # /etc/laptop-mode/laptop-mode.conf`:
    ...
    ENABLE_LAPTOP_MODE_ON_AC=1
    ...
    ENABLE_LAPTOP_MODE_WHEN_LID_CLOSED=1

We're going to disable LMT from handling CPU frequency scaling since
we've setup `cpupower` to handle that:

    # /etc/laptop-mode/conf.d/cpufreq.conf
    ... 
    # CONTROL_CPU_FREQUENCY="AUTO"
    CONTROL_CPU_FREQUENCY=0

and disable Intel pstate handling as well:

    # /etc/laptop-mode/conf.d/intel_pstate.conf
    # CONTROL_INTEL_PSTATE="auto"
    CONTROL_INTEL_PSTATE=0


Finally, enable and start the systemd service:

```bash
# systemctl enable laptop-mode.service
# systemctl start  laptop-mode.service
```


### acpid

A very useful tool is from the `acpi` package, which provides battery
information using the command `acpi -v`. To install:

```bash
# pacman -S acpi
```

`acpid` is an extensible daemon for handling ACPI events. It can run
commands when the laptop lid is closed, etc.

```bash
# pacman -S acpid
# systemctl enable acpid.service
# systemctl start  acpid.service
```


### CPU Frequency Scaling

Another utility that will help with CPU frequency scaling is `cpupower`,
it provides useful CLI utilities and a systemd service to change the CPU
governor at boot.

```bash
$ yaourt -S cpupower
# systemctl enable cpupower
# systemctl start cpupower
```

I use cpupower to modulate the CPU’s speeds. This keeps CPU in check from
maxing out at all times. My cpupower config file at `/etc/default/cpupower`
has the following line changed:

    governor='powersave'

You should adjust this setting to your own needs.


### Temperature Management

Intel provides a daemon that will keep tabs on the CPUs’ temperature and
adjust settings to keep it from getting too hot, its called `thermald`.

```bash
$ yaourt -S thermald
# systemctl enable thermald.service
# systemctl start thermald.service
```


### Fan Control

Finally, the kernel doesn’t seem to have very fine control over the MacBook’s
fan. The following script helps add fine-tuning for the fan that will
increase its baseline speed and ramp it up gently, so it’s not an
all-or-nothing kind of setup.

```bash
$ yaourt -S mbpfan-git
# systemctl enable mbpfan.service
# systemctl start mbpfan.service
```

By default the service runs in verbose mode which adds tons of output to the
system journal. It basically works by measuring the CPU temp, adjusting the fan
speed accordingly, and then sleeping for a given number of seconds. With
verbose mode on, it logs its wakeup every few seconds. That means a lot of
writing to the journal. So I changed the service under
`/usr/lib/systemd/system/mbpfan.service` so the following line reads like so:

    ExecStart=/usr/sbin/mbpfan -f


### Apple Keyboard

To get the `fn` keys working in X, we will install `xbindkeys` which helps
bind keyboard keys to commands. We will bind keys for volume, keyboard and
display brightness.

    ```bash
    # pacman -S xbindkeys
    yaourt -S xorg-xbacklight kbdlight
    ```

Create your configuration file for xbindkeys: `.xbindkeysrc`

    # Increase volume 5% with Apple volume up
    "amixer set Master playback 5%+"
        m:0x0 + c:123
        XF86AudioRaiseVolume
    # Increase volume 5% with F12
    "amixer set Master playback 5%+"
        m:0x0 + c:96


    # Decrease volume 5% with Apple volume down
    "amixer set Master playback 5%-"
        m:0x0 + c:122
        XF86AudioLowerVolume
    # Decrease volume 5% with F11
    "amixer set Master playback 5%-"
        m:0x0 + c:95


    # Mute with Apple mute
    "amixer set Master toggle"
        m:0x0 + c:121
        XF86AudioMute
    # Mute with F10
    "amixer set Master toggle"
        m:0x0 + c:76


    # Suspend system
    "systemctl suspend"
        m:0x0 + Mod4 + c:107
        Mod4 + XF86Eject


    # Dim keyboard
    "kbdlight down"
        m:0x0 + c:237
        XF86KbdBrightnessUp


    # Brighten keyboard
    "kbdlight up"
        m:0x0 + c:238
        XF86KbdBrightnessDown


Next we'll auto-start xbindkeys when X starts, add this to your `.xinitrc`
file:

```bash
if [ `type -P xbindkeys` ]; then
  # Load custom keyboard key bindings
  xbindkeys
fi;
```


### Apple Trackpad

Finally<sup class="Ref" id="ref:note:3">[[3](#note:3)]</sup>, we'll setup a
Bluetooth Apple Trackpad. To do this, we'll install some bluetooth core
utilities

```bash
# pacman -S bluez bluez-utils
# modprobe btusb  # Make sure bluetooth kernel module is loaded
# systemctl enable bluetooth.service  # Start bluetooth on reboot
# systemctl start bluetooth.service
```
    
To actually connect to the Trackpad, we'll use the `bluetoothctl` interactive 
utility to scan-for, discover, pair and connect to the Trackpad. (If your Trackpad
is already paired with another device, make sure to turn it off, then long-hold
the power button until the LED flashes.)

    $ bluetoothctl
    > power on
    > scan on
    > agent on
    > devices    # You should see the MAC address of your Trackpad appear if its in discoverable mode
    > pair mac 28:37:37:2B:42:7A
    > connect 28:37:37:2B:42:7A

Then we'll setup some `udev` rules so USB Bluetooth is activated and loade when
the system boots up.

    # /etc/udev/rules.d/10-local.rules
    # Set bluetooth power up
    ACTION=="add", KERNEL=="hci0", RUN+="/usr/bin/hciconfig hci0 up"


## Conclusion

Wrapping up, I have nothing to add other than what you do with your system
is up to you.


## References

The following articles were very useful in providing some help and
inspiration.

* [Installing Arch Linux on a MacBook
   Pro - Michael Chladek](https://mchladek.me/post/arch-mbp/)
* [Introductory MacBook
  Arch Guide - Zanshin](http://zanshin.net/2015/02/05/arch-linux-on-a-macbook-pro-part-1-creating-a-usb-installer/)
* [Arch Linux on MacBook Pro Retina 2014 with DM-Crypt, LVM and suspend
  to disk - Loïc Pefferkorn](http://loicpefferkorn.net/2015/01/arch-linux-on-macbook-pro-retina-2014-with-dm-crypt-lvm-and-suspend-to-disk/)
* [ArchWiki MacBook](https://wiki.archlinux.org/index.php/MacBook)
* [ArchWiki MacBookPro11,x](https://wiki.archlinux.org/index.php/MacBookPro11,x)
* [Arch Linux Running on my
   MacBook - Phil Plückthun](https://medium.com/@philpl/arch-linux-running-on-my-macbook-2ea525ebefe3#.ai90cnihe)
* <cite id="cite:1">
  <a href="https://www.youtube.com/watch?v=Fzmm87oVQ6c">My personal fight
    against the modern laptop</a>
  A talk discussing our decreasing ability to change our hardware to suit
  our needs.
  <a class="RefBack" href="#ref:cite:1"></a>
  </cite>


## Footnotes

Any changes to this article will be annotated with a footnote and explained here.

1. <div id="note:1">
   March 6, 2016: Previously used <code>NetworkManager</code> to detect
   and connect to WiFi networks, but have changed to use
   <code>netctl</code> and <code>wifi-menu</code> as these commands are
   more low-level and have fewer dependencies.
   <a class="RefBack" href="#ref:note:1"></a>
   </div>

1. <div id="note:2">
   March 8, 2016: Previously omitted the <code>-S</code> option in
   yaourt, fixed.
   <a class="RefBack" href="#ref:note:2"></a>
   </div>

1. <div id="note:3">
   March 8, 2016: Added a section covering the Apple Trackpad.
   <a class="RefBack" href="#ref:note:3"></a>
   </div>

1. <div id="note:4">
   March 14, 2016: Thanks
   <a href="https://www.reddit.com/r/archlinux/comments/493k4n/installing_encrypted_arch_linux_on_an_apple/d0y36h4?context=3">Fr0gm4n</a>
   for suggestions simplifying the writing of <code>iso</code>
   images to USB.
   <a class="RefBack" href="#ref:note:4"></a>
   </div>

1. <div id="note:5">
   March 18, 2016: Changed references to <code>.Xinitrc</code> to the
   correct filename, <code>.xinitrc</code>.
   <a class="RefBack" href="#ref:note:5"></a>
   </div>

1. <div id="note:6">
   March 24, 2016: Added two new sections documenting Laptop Mode Tools
   and <code>acpid</code>.
   <a class="RefBack" href="#ref:note:5"></a>
   </div>

1. <div id="note:7">
   April 2, 2016: Thanks
   <a href="https://www.reddit.com/r/archlinux/comments/493k4n/installing_encrypted_arch_linux_on_an_apple/d1mleow?context=3">Perceptes</a>
   for helping to clarify the text explaining how to configure the bootloader.
   <a class="RefBack" href="#ref:note:7"></a>
   </div>

1. <div id="note:8">
   July 28, 2016: Updated to support Macbookpro 11,3 devices with NVidia cards. This device uses NVIDIA GeForce GT 750M (Codename NVE7/GK107).
   <a class="RefBack" href="#ref:note:8"></a>
   </div>

1. <div id="note:9">
   December 2, 2016: Thanks to Joshua Brown for clarifications to writing the bootloader line.
   <a class="RefBack" href="#ref:note:9"></a>
   </div>

1. <div id="note:10">
   February 6, 2017: If anyone has a solution to the loss of Infinality bundle
   typography, please drop me a line.
   <a class="RefBack" href="#ref:note:10"></a>
   </div>

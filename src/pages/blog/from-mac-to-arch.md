---
author: 'ren'
title: 'From MacOS to Arch Linux'
description: 'First impressions'
category: 'arch'
layout: '../../layouts/BlogPost.astro'
publishedDate: '05 Nov 2021'
heroImage: 'macos-to-arch.jpg'
tags:
  - 'juxt'
---

At JUXT we try to master the tools we use. As a practice, it helps us
maintain our vision and be in control of our future. When it comes to
operating systems, Linux is a great choice to understand the meaning of
computing (short of creating your own hardware), allowing the user a
closer look into how hardware cooperates with software to deliver an
application. For this reason JUXT provides their employees with all the
necessary support to get productive quickly on their
[Arch-based](https://archlinux.org/) laptops. I collected these notes to
document my journey through the setup of the new laptop, hoping it might
be useful to colleagues and friends in the future.

The main goal of the blog post is to give a rough idea of the amount of
work required to setup a new Linux laptop coming from a Mac OS user
perspective. The article doesn't give step-by-step instructions to setup
everything you need (there are entire articles for every aspect), but it
gives the reader all the relevant links to follow for a more detailed
explanation. So let's get started!

My brand new Dell XPS just arrived, it's time to set it up! I've been
using Mac OS since 2005 and before that I had experience of both Windows
and Linux. I started on Slackware a long time ago, then used Debian for
some time and Ubuntu over the years when I needed a virtualized
environment. I consider myself a Linux newbie and I'm sure I'm about to
make many questionable choices. Nevertheless, I'm curious to see what
the Linux experience is like nowadays. Frankly I expect some pain, but
perhaps not the same extremes of the early 2000s. Fingers crossed!

To begin with, I'm currently writing from my spare laptop, a mid-2010
MacBook that works pretty decently considering its age. The new laptop
arrives with Arch Linux pre-installed and a root account. So my
adventure starts from a blinking prompt and some internal documentation
that JUXT provides to set up a basic working environment. It's already
great that I don't have to partition the disk! The documentation
suggests a tiling manager called [i3wm](https://i3wm.org/), which I've
never heard of but I'm happy to use. The last time I had to pick a
graphical environment on Linux it was [Xfce](https://www.xfce.org/)
because Gnome or KDE were so heavy and painful to use. i3wm is instead
so lightweight it reminds me of
[Tmux](https://github.com/tmux/tmux/wiki). Of course I'm happy to see
simplicity as a guiding principle and I'm going with it. After a few
days, I had no problem getting used to it except for the choice of using
`j,k,l,;` to move left, down, up and right respectively, instead of the
usual vim-like `h,j,k,l`. I fixed this by changing the i3wm
configuration file at `~/.config/i3/config`. I'm planning to keep using
Tmux as my development environment and i3wm at the core for all other
applications. I also made a few customization to
[Alacritty](https://github.com/alacritty/alacritty#configuration), the
terminal emulator I found after installing i3wm.

A minor problem I had was that I couldn't find the required dependency
`yay` (a helper for the AUR packaging system), so I proceeded with the
following instructions:

    git clone https://aur.archlinux.org/yay.git
    cd yay
    makepkg -si

The internal guide is perfect to get you started, but for everything
else other than the very essential, the [Arch
Wiki](https://wiki.archlinux.org/title/USB_storage_devices) is a very
complete source of information. I was able to find instructions for the
most common applications, devices and every dependency needed to set up
the system. In only a couple of cases I found better instructions
elsewhere, for example how to setup the WiFi so it [automatically
reconnects](https://unix.stackexchange.com/questions/80470/arch-linux-wifi-works-manually-how-to-make-it-automatic).

I then proceeded to configure the laptop the way I wanted, for example
installing [Iosevska](https://github.com/be5invis/Iosevka),
[Zenburn](https://github.com/jnurmine/Zenburn) and using them
throughout. It should be probably clear by now that I use Vim and that
influences many of the choices you see here. I installed both Firefox
and Chrome (which I tend to use for different use cases) and decided to
try using Thunderbird to manage email (I will eventually move to Mutt I
think, but I need some time to absorb all the other changes first). When
I have the choice between using the same application in the browser or
native, I normally prefer the desktop version. For this reason I
preferred to install both Slack and Discord from their AUR packages.
Something that I still don't have a clear story for is the calendar: I'm
using a couple of Google calendars from the browser, but I'd rather have
a native desktop solution. Unfortunately I don't have an answer for that
yet. Finally, after one final installation of Dropbox, I had all I
needed to abandon the old MacBook and switch completely to the new
laptop, from where I'm writing right now.

Be aware that not everything was straightforward. I had some trouble
understanding how to connect a pair of Bose QC 35 II bluetooth
headphones. Before making any attempt at using bluetooth, I made sure
the audio system was working properly using the internal speakers. I
followed the [Pulse audio setup
guide](https://wiki.archlinux.org/title/PulseAudio) from the Wiki and
decided to use the [ncpamixer
frontend](https://github.com/fulhax/ncpamixer) to select devices and
turn the volume up and down. Bluetooth interaction is based on
[Bluez](https://wiki.archlinux.org/title/Bluetooth) and it consists of a
series of low level operations to first start the bluetooth server,
connect to a discoverable device and trust it for future use. There are
higher level option tools, but I decided to stay with the instructions
in the Wiki, which are pretty clear. You have to be careful to follow
the steps exactly as described and make sure every step is successful
before moving to the next. A couple of steps returned an error but
luckily the solution was just below in the \"troubleshooting\" section.
Now the headphones are working flawlessly, even after a reboot, they
just connect when I turn them on.

I normally work using an external monitor, so I started looking at my
options to configure the external display including the external
keyboard and mouse. After connecting the external monitor I installed
[xrandr and xlayoutdisplay](https://wiki.archlinux.org/title/Xrandr) as
suggested on the Wiki. `xlayoutdisplay` when invoked spits out the line
that configures all the connected monitors using their best
configurations. I just had to copy paste the line to use both monitors
at the same time. At this point you get an independent i3 window on the
external monitor while the laptop continues working as before. To use it
with the laptop lid closed, I tweaked the command line to set up the
external monitor as the primary display. After producing the desired
`xrandr` configurations, I added them up as aliases to my bash_profile
with something like:

    alias home='xrandr --dpi 168 --output eDP-1 --off --output DP-1 --primary --mode 3440x1440 --rate 60 --pos 1920x0  --output HDMI-1 --off  --output DP-2 --off  --output DP-3 --off  --output DP-4 --off'

Something else that you also do with `xrandr` is tweaking the screen
luminosity. From the related [Wiki
page](https://wiki.archlinux.org/title/backlight) I got all the basic
information and then added the following alias to my `bash_profile` so I
could use something like `bright 0.5` from the command line to change
brightness:

    bright(){ xrandr --output eDP-1 --brightness $1; }

In terms of keyboards, I wanted something that was as close as possible
to the internal Dell XPS keyboard, so I could switch comfortably between
the two setups without altering my finger memory. The keyboard I found
is a wired [Perixx](https://www.amazon.co.uk/dp/B08C5LX743) that you can
find for a few bucks on Amazon. I didn't have to do anything special to
use the keyboard after connecting it to the USB port, same goes for my
USB camera and external microphone that were correctly recognized and
working out of the box. Way to go Linux!

There are still many things I need to set up on the new laptop, for
example: suspension/hibernation on closing the lid doesn't always work,
Vim problems with the system clipboard, printing setup, etc. But I guess
I can continue my learning while being productive with my normal tasks.
Overall I'm pleased with the results after only 4 days. It's a great
start, with no major obstacles, and I'm looking forward to my new Linux
life in the following weeks!

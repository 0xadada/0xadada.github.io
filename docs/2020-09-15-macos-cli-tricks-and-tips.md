---
title: "macOS command line tricks and tips"
description: "Set current user profile image, display 24H time in the menubar and more."
tags: notes, software-engineering, command-line
---

Set the current user accounts profile photo (displayed on the login UI) using a
local JPG image.

```bash
dscl . delete "${HOME}" JPEGPhoto
dscl . delete "${HOME}" Picture
sudo dscl . create "${HOME}" Picture "${PWD}/avatar.jpg"
```

Replace Time Machine with Volume on the menu bar

```bash
defaults write com.apple.systemuiserver menuExtras -array \
  "/System/Library/CoreServices/Menu Extras/AirPort.menu" \
  "/System/Library/CoreServices/Menu Extras/Volume.menu" \
  "/System/Library/CoreServices/Menu Extras/Battery.menu" \
  "/System/Library/CoreServices/Menu Extras/Clock.menu"
```

Show day of week, date time in 24H time in menu bar e.g. "13 Fri 16:49"

```bash
defaults write com.apple.menuextra.clock \
  DateFormat -string "d EEE HH:mm"
```

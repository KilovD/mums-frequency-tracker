# Mum's frequency tracker

A simple fluid intake and urination diary, made for phones, tablets and computers.

**Open the app:** https://KilovD.github.io/mums-frequency-tracker/

## Install on a phone

Open the app link on the phone and let the first load finish.

- **iPhone / iPad:** open in Safari, tap Share, then **Add to Home Screen**.
- **Android:** open in Chrome, then choose **Install app** or **Add to Home screen** from the browser menu.
- **Computer:** use the install option in Chrome or Edge when available.

The app works offline after the first complete load. No account or app-store download is needed.

## What it does

- Records the date and time when you tap Add a drink or Add urination.
- Records drink type and fluid volumes in millilitres (mL).
- Lets you correct times, add notes, and edit or delete entries.
- Shows daily intake, urine output and urination frequency.
- Creates a frequency-volume chart and a detailed diary for a selected date range.
- Exports a CSV diary, prints charts or saves them as PDF through the print dialogue.
- Downloads and restores JSON backups; restore merges entries without duplicating matching IDs.

## Your data

Diary entries are stored in IndexedDB in the browser on your device. The app does not upload entries, use analytics or synchronise between devices. This repository contains app code and icons only.

Use **Backup & help → Download backup** regularly. Clearing browser data, using private browsing, changing browser or losing the device can lose the diary. Export before changing devices or app addresses, then restore the backup in the new location. CSV files are for sharing; JSON backups are for restoring.

This app records what you enter. It provides no fluid targets or medical interpretation.

## Development and hosting

All app HTML, CSS and vanilla JavaScript are in `index.html`. There is no framework, build step, external font or dependency. The manifest, service worker and icons support PWA installation and offline use.

GitHub Pages serves the root of the `main` branch. Increment `VERSION` in `sw.js` when changing app files. The service worker caches only this app's assets and removes only caches with its own prefix.

Do not commit diary exports or backups to this public repository.

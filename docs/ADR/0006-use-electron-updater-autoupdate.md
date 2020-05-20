# 6. Use electron-updater for auto-update

Date: 2019-12-20

## Status

Accepted

## Context

There are multiple packages available for handling auto-update on Electron apps, and one was already installed in the project but not used - which package should the project use?

## Decision

We will use [electron-updater](https://github.com/electron-userland/electron-builder) as the package for auto-update.

The package already installed in the project was replaced. It was decided earlier to use it instead of electron-updater because support for platforms was limited - but with new versions that has been added.

Electron-updater is the most popular package for auto-updating Electron apps, with more weekly downloads on npm and more dependents than the package that was already installed.

Overall, electron-updater seems like a more reliable package for handling auto-update.

## Consequences

As a package now has been decided on and will be in use, replacing it further down the line will need every user to download the new version manually.

Updates will be delivered faster and easier to users.

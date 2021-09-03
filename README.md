# Tropy
[![Build Status](https://github.com/tropy/tropy/actions/workflows/ci.yml/badge.svg)](https://github.com/tropy/tropy/actions/workflow/ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/tropy/tropy/badge.svg?branch=master)](https://coveralls.io/github/tropy/tropy)

Bring order to your research — use the power of Tropy to organize and describe
your research photos so you can quickly find your sources whenever you need them.

Visit [tropy.org](https://tropy.org) to learn more or follow
[@tropy](https://twitter.com/tropy) on Twitter for important announcements.
To get started, download the latest version of Tropy for your platform, check
out the [user's manual](https://docs.tropy.org) and join the discussion on the
[forums](https://forums.tropy.org).

If you are interested to work on Tropy or create your own builds, please
find more details below. Happy hacking!

## Install from Source
Install the latest version of [Node.js](https://nodejs.org) (at least the
version that ships with the current [Electron](https://electronjs.org)
release) and all requirements needed to use
[`node-gyp`](https://www.npmjs.com/package/node-gyp) on your platform.

Finally, clone [this repository](https://github.com/tropy/tropy.git) and
install all of Tropy's dependencies:

    $ npm install
    $ npm run rebuild -- --force

To test that everything is set up correctly, run:

    $ npm test

## Creating Builds
To create a dev-build for your current platform run `npm run build` at the
root of the repository. This will create a dev-build of Tropy in the `dist`
folder.

## Running in Dev-Mode
Alternatively, you can start Tropy in dev-mode directly from the root of the
repository, by running `npm start`.

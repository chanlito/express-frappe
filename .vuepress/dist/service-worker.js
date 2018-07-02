/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.3.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "80ef8846e33d184477214de6e8b4a493"
  },
  {
    "url": "assets/css/2.styles.91def99e.css",
    "revision": "355b80f773b8023fbd38037cfa0457db"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/0.f31fa035.js",
    "revision": "1ddca1dcd2f0ad01a1eaea8b2041399f"
  },
  {
    "url": "assets/js/1.30cc4da9.js",
    "revision": "40e05cb1733ed31a2c64ec7f4ea3b36d"
  },
  {
    "url": "assets/js/app.1b5307a4.js",
    "revision": "a8ca5e0dd106af54ea7e20f7c437be74"
  },
  {
    "url": "es/index.html",
    "revision": "916bba5818c9d0149e5ed69846458a3a"
  },
  {
    "url": "index.html",
    "revision": "485e77a15bd56cab33d03112ceb83800"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

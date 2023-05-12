Socket.io Chat
============
[![GitHub Issues](https://img.shields.io/github/issues/IgorAntun/node-chat.svg)](https://github.com/IgorAntun/node-chat/issues) [![Current Version](https://img.shields.io/badge/version-0.1-green.svg)](https://github.com/IgorAntun/node-chat) [![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://igorantun.com/chat) 

This is a node.js chat application powered by node.js, socket.io and Express that provides the main functions you'd expect from a chat, such as emojis and group conversations for now. You're able to fetch Apex Legends data with the /apex command. and more.

![Chat Preview](gh-assets/newest-style.png)

---

## Features
- Fluid responsive Design
- Emoji support
- fetch data from your apex legends account
- Other awesome features yet to be implemented

Currently there are 5 commands available
1. /help 
   to see the available commands with more information
2. /online 
   to see who is online.
3. /apex  `<username> <platform>`
   with this you can set your userdata.
4. /rank
   can be used to view your current rank

---

## Setup
Clone this repo to your desktop and run `npm install` to install all the dependencies.

You'll need an Apex Legends API key from [https://apexlegendsapi.com/#introduction](apex legends api)
Put that key in your .env file under apexKey

--- 


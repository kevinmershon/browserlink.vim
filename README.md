# NetSuite Browserlink
Based on the somewhat defunct [Browserlink.vim plugin](https://github.com/jaxbot/browserlink.vim), this is a live browser debugger plugin for NetSuite via Vim.

![NetSuite Browserlink](https://i.imgur.com/uNIqcka.gif)

## How it works
NetSuite Browserlink is very simple. The plugin itself hooks autocommands for file changes (and other things) to the provided functions. The functions connect through HTTP to a node.js backend, which your webpage connects also to. The entire process happens extremely fast.

## Installation and Setup
To install, either download the repo, or as I would recommend, use [Pathogen](https://github.com/tpope/vim-pathogen).

```
git clone git://github.com/kevinmershon/netsuite-browserlink.vim
```

If you haven't already, you'll need to install [Node.js](http://nodejs.org/) (Node is used to send refresh commands to your page(s))

Lastly, you need some javascript on your page(s) to listen for the refresh commands.  For this there are two options:

1. Add this script to your page(s)

```
<script src='http://127.0.0.1:9001/js/socket.js'></script>
<script src='http://127.0.0.1:9001/js/netsuite.js'></script>
```

2. **OR** Use a GreaseMonkey script to inject the javascript into your project:

Userscript injection extensions/solutions:
* [Chromium's built in support](http://www.chromium.org/developers/design-documents/user-scripts)
* [TamperMonkey Chrome extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
* [Greasemonkey Firefox extension](https://addons.mozilla.org/firefox/addon/greasemonkey/)

Userscript template (update the [@match rule](https://developer.chrome.com/extensions/match_patterns) to the url of your local project):
```
// ==UserScript==
// @name         NetSuite Browserlink
// @namespace    NetSuiteLink
// @include      *
// @description  Vim BrowserLink remote debugging of NetSuite
// @match        https://*.netsuite.com/app/*
// @author       Kevin Mershon
// ==/UserScript==

var socketSrc = document.createElement("script");
socketSrc.src = "http://127.0.0.1:9001/js/socket.js";
socketSrc.async = true;
document.head.appendChild(socketSrc);

var netSuiteSrc = document.createElement("script");
netSuiteSrc.src = "http://127.0.0.1:9001/js/netsuite.js";
netSuiteSrc.async = true;
document.head.appendChild(netSuiteSrc);

```

I prefer the GreaseMonkey/Userscript method, as it's more universal and I don't have extra development junk in my projects. But it's totally up to you.

## Usage

Once set up, Vim should now call the Node server. Load up the debugger like normal, find some SuiteScript you want to execute, and issue the command to run it over the websocket against NetSuite.

This works very similarly to the original Browserlink plugin. Notable NetSuite-specific additions are:

`:BLNetSuiteEval`

synonymus with `:BLEvaluateBuffer`

`:BLNetSuiteLogs`

will echo recent debugger log output to a temporary vim buffer

`:BLNetSuiteClear`

will clear the debugger logs

Standard to Browserlink:

`:BLReloadPage`

will reload the current page

`:BLEvaluateBuffer`

will evaluate the current buffer against the debugger

You can also use <leader>be to evaluate selections or buffers, <leader>br to reload.


If you want to get super efficient, you can hook an autocmd to when you leave insert mode (or other times) to reload:

`au InsertLeave *.css :BLEvaluateBuffer`

This function can be easily tweaked to fit your needs/workflow, and I highly recommend you do so to maximize your utility from this plugin.

## Options

`g:bl_no_autoupdate` (defaults to true with this plugin)

If set, NetSuite Browserlink won't try to reload when you save respective files.

`g:bl_no_eager`

If set, Browserlink won't autostart the server when a command is run and the server does not respond.

`g:bl_no_mappings`

If set, Browserlink won't map be, br, and bc commands.

`g:bl_serverpath`

Set if your server is not hosted on 127.0.0.1:9001. You will also need to change the socket.js file.

`g:bl_urlpaths`

A dictionary defining mappings from URLs to filesystem paths. Set this if you want to use the
quickfix list for pages not accessed via a file://-URL.

`g:bl_pagefiletypes`

A list of filetype strings that should trigger automatic page reloads on write.
Defaults to `['javascript']`.

## Notes

This is an experimental project, but it works really well for me, and I hope you enjoy it! I kept the source as simple as possible, and it's pretty easy to edit to your needs. I'm open to any suggestions, too, so let me know.

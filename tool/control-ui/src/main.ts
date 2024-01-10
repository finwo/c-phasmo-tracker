import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { Client as TwitchClient } from 'tmi.js';
import { appendHTML, appendTemplate } from './lib/ui.ts';

// Make it global
import ons from 'onsenui/js/onsenui.js';
window.ons = ons;

// Load the main template
import tmpl_app from "./app.html";
appendHTML(document.body, tmpl_app);

import tmpl_tabbar from  "./component/tabbar.html";
appendTemplate(document.body, tmpl_tabbar, "tabbar.html");

import tmpl_home from  "./page/home.html";
appendTemplate(document.body, tmpl_home, "home.html");

import tmpl_settings from "./page/settings.html";
appendTemplate(document.body, tmpl_settings, "settings.html");

window.fn = {};

window.fn.loadView = function (index) {
  document.getElementById('appTabbar').setActiveTab(index);
};

window.fn.loadLink = function (url) {
  window.open(url, '_blank');
};

window.fn.pushPage = function (page, anim) {
  if (anim) {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
  } else {
    document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
  }
};

window.appSettings = new Proxy({}, {
  async get(target, prop, receiver) {
    const allSettings = await _getSettings();
    return (allSettings||{})[prop] || '';
  },
  async set(obj, prop, value) {
    const allSettings = await _getSettings();
    allSettings[prop] = value;
    _setSettings(allSettings);
  },
});

(async () => {
  const twitchClient = new TwitchClient({
    connection: {
      secure    : true,
      reconnect : true,
    },
    identity: {
      username: await appSettings.channel,
      password: await appSettings.oauthToken,
    },
    channels: [await appSettings.channel],
  });

  twitchClient.connect();

  twitchClient.on('message', (channel, tags, message, self) => {
    if (self) return;
    fetch("/topic/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel,
        tags,
        message,
      }),
    });
  });
})();


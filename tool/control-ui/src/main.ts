import 'onsenui/css/onsenui.css';
import 'onsenui/css/onsen-css-components.css';
import { createIcons, icons } from 'lucide';

import Alpine from 'alpinejs';
import ons from 'onsenui/js/onsenui.js';
import { v4 as uuidv4 } from 'uuid';

import { Client as TwitchClient } from 'tmi.js';
import { appendHTML, appendTemplate } from './lib/ui.ts';

import { ingestCommands } from './lib/commands.ts';
import { clientId       } from './static.ts';
import { qse, qsd       } from '../../common/query-string.ts';

// Make things global
// TODO: replace html templates by ts so we can import there
window.ons      = ons;
window.Alpine   = Alpine;
window.uuidv4   = uuidv4;
window.clientId = clientId;
window.qse      = qse;
window.qsd      = qsd;

// Load the main template
import tmpl_app from "./app.html";
appendHTML(document.body, tmpl_app);

// import tmpl_component_alert from "./component/alert.html";
// appendTemplate(document.body, tmpl_component_alert, "component/alert.html");

import tmpl_help_command_syntax from "./page/help/command-syntax.html";
appendTemplate(document.body, tmpl_help_command_syntax, "help/command-syntax.html");

import tmpl_settings from "./page/settings.html";
appendTemplate(document.body, tmpl_settings, "settings.html");

import tmpl_settings_auto_shoutout from "./page/settings/auto-shoutout.html";
appendTemplate(document.body, tmpl_settings_auto_shoutout, "settings/auto-shoutout.html");

import tmpl_settings_commands from "./page/settings/commands.html";
appendTemplate(document.body, tmpl_settings_commands, "settings/commands.html");

import tmpl_settings_command from "./page/settings/command.html";
appendTemplate(document.body, tmpl_settings_command, "settings/command.html");

import tmpl_settings_overlay_chat from "./page/settings/overlay-chat.html";
appendTemplate(document.body, tmpl_settings_overlay_chat, "settings/overlay-chat.html");

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

window.appSettings = Alpine.reactive({});
(async () => {
  const fetched = await _getSettings();
  for(const k of Object.keys(fetched)) {
    appSettings[k] = fetched[k];
  }
  let _appSettings = JSON.stringify(appSettings);
  Alpine.effect(async () => {
    const currentSettings = JSON.stringify(appSettings);
    if (currentSettings === _appSettings) return;
    _appSettings = currentSettings;
    await _setSettings(JSON.parse(currentSettings));
  });
})();

// window.appSettings = new Proxy({}, {
//   async get(target, prop, receiver) {
//     const allSettings = await _getSettings();
//     return (allSettings||{})[prop] || '';
//   },
//   async set(obj, prop, value) {
//     obj[prop
//     const allSettings = await _getSettings();
//     allSettings[prop] = value;
//     _setSettings(allSettings);

//     // Re-initialize twitch client
//     if (
//       ['username', 'channel', 'oauthToken'].includes(prop) &&
//       (await appSettings.username) &&
//       (await appSettings.channel) &&
//       (await appSettings.oauthToken)
//     ) {
//       initTwitchClient();
//     }
//   },
// });

// Setup a bounded config entry for commands
window.cmds = Alpine.reactive({l:false,_:[]});
setTimeout(async () => {
  window.cmds._ = (await window.appSettings.commands || [])
    .sort((a,b) => {
      if (a.term > b.term) return  1;
      if (a.term < b.term) return -1;
      if ((a.arguments ?? -1) > (b.arguments ?? -1)) return  1;
      if ((a.arguments ?? -1) < (b.arguments ?? -1)) return -1;
      return 0;
    })
    ;
  window.cmds.l = true;

  // Ensure all commands have an ID
  setImmediate(() => {
    for(const c of window.cmds._) {
      if (!c._id) c._id = uuidv4();
    }
  });
}, 500);
Alpine.effect(() => {
  if (!cmds.l) return;
  window.appSettings.commands = window.cmds._;
});

async function initTwitchClient() {
  if (window.twitchClient) {
    window.twitchClient.disconnect();
    window.twitchClient = null;
  }

  if (!appSettings.oauthToken) {
    ons.notification.alert("Please connect an account on the settings page.");
    return;
  }

  window.twitchClient = new TwitchClient({
    connection: {
      secure    : true,
      reconnect : true,
    },
    identity: {
      username: appSettings.username || appSettings.channel,
      password: appSettings.oauthToken,
    },
    channels: [(appSettings.channel || appSettings.username)],
  });

  twitchClient.on('message', (channel, tags, message, self) => {
    ingestCommands({ channel, tags, message, self });

    fetch("/topic/chat", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        self,
        channel,
        tags,
        message,
      }),
    });
  });

  twitchClient.connect();
}

document.addEventListener('init', () => {
  createIcons({ icons });
});

// Kickstart active things
window.twitchClient = null;
setTimeout(initTwitchClient, 1000);
Alpine.start();

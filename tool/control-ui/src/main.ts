import m from "mithril";
m.render(document.body, "hello world");

// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';
// import { createIcons, icons } from 'lucide';
// import { observer } from '@finwo/observer';

// import { Client as JerryClient } from '../../client-jerry/src/index.ts';

// import ons from 'onsenui/js/onsenui.js';
// import { v4 as uuidv4 } from 'uuid';

// import { Client as TwitchClient } from 'tmi.js';
// import { appendHTML, appendTemplate } from './lib/ui.ts';

// import { ingestCommands           } from './lib/commands.ts';
// import { clientId, requiredScopes } from './static.ts';
// import { debounce                 } from '../../common/debounce.ts';
// import { qse, qsd                 } from '../../common/query-string.ts';

// // Make things global
// // TODO: replace html templates by ts so we can import there
// window.ons            = ons;
// window.uuidv4         = uuidv4;
// window.clientId       = clientId;
// window.qse            = qse;
// window.qsd            = qsd;
// window.requiredScopes = requiredScopes;
// window.observer       = observer;
// window.debounce       = debounce;

// // Load the main template
// import tmpl_app from "./app.html";
// appendHTML(document.body, tmpl_app);

// // import tmpl_component_alert from "./component/alert.html";
// // appendTemplate(document.body, tmpl_component_alert, "component/alert.html");

// import tmpl_help_command_syntax from "./page/help/command-syntax.html";
// appendTemplate(document.body, tmpl_help_command_syntax, "help/command-syntax.html");

// import tmpl_settings from "./page/settings.html";
// appendTemplate(document.body, tmpl_settings, "settings.html");

// import tmpl_settings_auto_shoutout from "./page/settings/auto-shoutout.html";
// appendTemplate(document.body, tmpl_settings_auto_shoutout, "settings/auto-shoutout.html");

// import tmpl_settings_commands from "./page/settings/commands.html";
// appendTemplate(document.body, tmpl_settings_commands, "settings/commands.html");

// import tmpl_settings_command from "./page/settings/command.html";
// appendTemplate(document.body, tmpl_settings_command, "settings/command.html");

// import tmpl_settings_overlay_chat from "./page/settings/overlay-chat.html";
// appendTemplate(document.body, tmpl_settings_overlay_chat, "settings/overlay-chat.html");

// window.fn = {};

// window.fn.loadView = function (index) {
//   document.getElementById('appTabbar').setActiveTab(index);
// };

// window.fn.loadLink = function (url) {
//   window.open(url, '_blank');
// };

// window.fn.pushPage = function (page, anim) {
//   if (anim) {
//     document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title }, animation: anim });
//   } else {
//     document.getElementById('appNavigator').pushPage(page.id, { data: { title: page.title } });
//   }
// };

// window.appSettingEffects = [];
// window.appSettings       = observer({}, async (...chain) => {
//   for(const fn of appSettingEffects) await fn(...chain);
// });

// (async () => {

//   // Fetch the actual config
//   const fetched = await _getSettings();
//   for(const k of Object.keys(fetched)) {
//     appSettings[k] = fetched[k];
//   }

//   // Update stored config when the app says so
//   // TODO: debounce
//   let _appSettings = JSON.stringify(appSettings);
//   window.appSettingEffects.push(debounce(async () => {
//     const currentSettings = JSON.stringify(appSettings);
//     if (currentSettings === _appSettings) return;
//     _appSettings = currentSettings;
//     await _setSettings(JSON.parse(currentSettings));
//     initTwitchClient();
//   }, 1500));

//   // Listen for updates from others
//   const configClient = new JerryClient('/topic/config');
//   configClient.addListener(newConfig => {
//     for(const key of Object.keys(appSettings)) {
//       delete appSettings[key];
//     }
//     for(const key of Object.keys(newConfig)) {
//       appSettings[key] = newConfig[key];
//     }
//   });

// })();

// // // Setup a bounded config entry for commands
// // window.cmds = Alpine.reactive({l:false,_:[]});
// // setTimeout(async () => {
// //   window.cmds._ = (await window.appSettings.commands || [])
// //     .sort((a,b) => {
// //       if (a.term > b.term) return  1;
// //       if (a.term < b.term) return -1;
// //       if ((a.arguments ?? -1) > (b.arguments ?? -1)) return  1;
// //       if ((a.arguments ?? -1) < (b.arguments ?? -1)) return -1;
// //       return 0;
// //     })
// //     ;
// //   window.cmds.l = true;

// //   // Ensure all commands have an ID
// //   setImmediate(() => {
// //     for(const c of window.cmds._) {
// //       if (!c._id) c._id = uuidv4();
// //     }
// //   });
// // }, 500);
// // (() => {
// //   if (!cmds.l) return;
// //   window.appSettings.commands = window.cmds._;
// // });

// async function initTwitchClient() {
//   const appNavigator = document.getElementById('appNavigator');

//   if (window.twitchClient) {
//     window.twitchClient.disconnect();
//     window.twitchClient = null;
//   }

//   // Fetch the token
//   const auth = window.appSettings.auth.find(credentials => credentials.platform == 'twitch');
//   if (!auth) {
//     if (appNavigator.pages[appNavigator.pages.length-1].dataset.title == 'Settings') {
//       // No notification from the settings page
//       return;
//     }
//     ons.notification.alert("Please connect an account on the settings page.");
//     return;
//   }

//   // Check if the token has the correct scopes
//   for(const scope of requiredScopes) {
//     if (!auth.scope.includes(scope)) {
//       ons.notification.alert("Authentication is missing some permissions, please reconnect your account from the settings page.");
//       return;
//     }
//   }

//   // Fetch user info
//   const authenticatedUser = auth.user ? auth.user : (await (await fetch('https://api.twitch.tv/helix/users', {
//     headers: {
//       'Client-Id'    : clientId,
//       'Authorization': `Bearer ${auth.access_token}`,
//     }
//   })).json()).data[0];

//   // Update auth to include username for display purposes
//   if (!auth.user) auth.user = authenticatedUser;

//   // console.log(JSON.stringify({ authenticatedUser }, null, 2));

//   window.twitchClient = new TwitchClient({
//     connection: {
//       secure    : true,
//       reconnect : true,
//     },
//     identity: {
//       username: authenticatedUser.login,
//       password: `oauth:${auth.access_token}`,
//     },
//     channels: [(appSettings.channel || authenticatedUser.login)],
//   });

//   twitchClient.on('message', (channel, tags, message, self) => {
//     ingestCommands({ channel, tags, message, self });

//     fetch("/topic/chat", {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         self,
//         channel,
//         tags,
//         message,
//       }),
//     });
//   });

//   twitchClient.connect();
// }

// document.addEventListener('init', () => {
//   createIcons({ icons });
// });

// // Kickstart active things
// window.twitchClient = null;
// setTimeout(initTwitchClient, 1000);

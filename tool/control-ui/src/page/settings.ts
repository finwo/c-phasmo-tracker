import m from 'mithril';
import { htmlFor } from '../lib/html-for';
import { createElement, Settings, User, Video } from 'lucide';

const elUser  = htmlFor(createElement(User ));
const elVideo = htmlFor(createElement(Video));

module.exports = {
  icon: Settings,
  label: 'Settings',
  view() {
    console.log({ elVideo });
    return m('div', [

      m('div', { class: 'toolbar' }, [
        m(m.route.Link, { href: '/root' }, 'Back'),
      ]),

      // List of things
      m('div', [

        // Twitch connection
        m('h3', 'Twitch'),
        // Channel
        m('div', { class: 'form-group' }, [
          m('div', { class: 'left' }, [
            m.trust(elVideo),
          ]),
          m('label', { class: 'center' }, [
            m('input', { placeholder: 'Channel' })
          ]),
        ]),
        // Username
        m('div', { class: 'form-group' }, [
          m('div', { class: 'left' }, [
            m.trust(elUser),
          ]),
          m('label', { class: 'center' }, [
            m('input', { placeholder: 'Username' })
          ]),
          m('div', { class: 'right' }, [
            m('button', { class: 'button-margin' }, 'Connect'),
          ]),
        ]),

      ])


    ]);
  }
};

// <ons-page data-title="Settings">
//   <ons-toolbar>
//     <div class="left">
//       <ons-back-button></ons-back-button>
//     </div>
//     <div class="center">Settings</div>
//   </ons-toolbar>

//   <script>

//     function updateOauthButton() {
//       const elButton = document.getElementById('oauthButton');
//       if (!elButton) return;
//       if (!appSettings.auth) appSettings.auth = [];
//       const knownTwitchAuth = appSettings.auth.find(credentials => credentials.platform == 'twitch');
//       if (knownTwitchAuth) {
//         oauthButton.innerText = 'Disconnect';
//       } else {
//         oauthButton.innerText = 'Connect';
//       }
//     }

//     function updateUsernameLabel() {
//       const elLabel = document.getElementById('username');
//       if (!elLabel) return;
//       if (!appSettings.auth) appSettings.auth = [];
//       const auth = appSettings.auth.find(credentials => credentials.platform == 'twitch');
//       elLabel.innerText = auth ? (auth.user?.login || '') : '';
//     }

//     appSettingEffects.push(debounce(updateOauthButton));
//     appSettingEffects.push(debounce(updateUsernameLabel));

//     window.fn = window.fn || {};
//     window.fn.toggleUser = async () => {
//       if (!appSettings.auth) appSettings.auth = [];
//       const knownTwitchAuth = appSettings.auth.find(credentials => credentials.platform == 'twitch');

//       // Disconnect
//       if (knownTwitchAuth) {
//         console.log("before: " + JSON.stringify(appSettings.auth));
//         appSettings.auth = appSettings.auth.filter(credentials => credentials.platform != 'twitch');
//         console.log("after: " + JSON.stringify(appSettings.auth));
//         return;
//       }

//       // Initialize implicit grant for twitch
//       _open('https://id.twitch.tv/oauth2/authorize?' + qse({
//         client_id    : clientId,
//         redirect_uri : 'http://' + document.location.host + '/oauth2/callback/twitch',
//         response_type: 'token',
//         scope        : requiredScopes.join(' '),
//       }));
//     };

//     ons.getScriptPage().onInit = function () {
//       updateOauthButton();
//       updateUsernameLabel();

//       if (ons.platform.isAndroid()) {
//         const inputItems = document.querySelectorAll('.input-items');
//         for (i = 0; i < inputItems.length; i++) {
//           inputItems[i].hasAttribute('modifier') ?
//             inputItems[i].setAttribute('modifier', inputItems[i].getAttribute('modifier') + ' nodivider') :
//             inputItems[i].setAttribute('modifier', 'nodivider');
//         }
//       }

//       // (async usernameLabel => {
//       //   if (appSettings.oauthToken) {
//       //     usernameLabel.innerText = appSettings.username;
//       //   } else {
//       //     usernameLabel.innerText = '<not connected>';
//       //   }

//       // //   usernameInput.value = appSettings.username;
//       // //   usernameInput.addEventListener('input', function() {
//       // //     appSettings.username = usernameInput.value;
//       // //   });
//       // })(document.getElementById('username'));

//       (async channelInput => {
//         channelInput.value = appSettings.channel;
//         channelInput.addEventListener('input', function() {
//           appSettings.channel = channelInput.value;
//         });
//       })(document.getElementById('channel'));

//       // (async oauthToken => {
//       //   oauthToken.value = appSettings.oauthToken;
//       //   oauthToken.addEventListener('input', function() {
//       //     appSettings.oauthToken = oauthToken.value;
//       //   });
//       // })(document.getElementById('oauthToken'));





//       // var nameInput = document.getElementById('name-input');
//       // var searchInput = document.getElementById('search-input');
//       // var updateInputs = function (event) {
//       //   nameInput.value = event.target.value;
//       //   searchInput.value = event.target.value;
//       //   document.getElementById('name-display').innerHTML = event.target.value !== '' ? `Hello ${event.target.value}!` : 'Hello anonymous!';
//       // }
//       // nameInput.addEventListener('input', updateInputs);
//       // searchInput.addEventListener('input', updateInputs);
//       // document.getElementById('model-switch').addEventListener('change', function (event) {
//       //   if (event.value) {
//       //     document.getElementById('switch-status').innerHTML = `&nbsp;(on)`;
//       //     document.getElementById('enabled-label').innerHTML = `Enabled switch`;
//       //     document.getElementById('disabled-switch').disabled = false;
//       //   } else {
//       //     document.getElementById('switch-status').innerHTML = `&nbsp;(off)`;
//       //     document.getElementById('enabled-label').innerHTML = `Disabled switch`;
//       //     document.getElementById('disabled-switch').disabled = true;
//       //   }
//       // });
//       // document.getElementById('select-input').addEventListener('change', function (event) {
//       //   document.getElementById('awesome-platform').innerHTML = `${event.target.value}&nbsp;`;
//       // });
//       // var currentFruitId = 'radio-1';
//       // const radios = document.querySelectorAll('.radio-fruit')
//       // for (var i = 0; i < radios.length; i++) {
//       //   var radio = radios[i];
//       //   radio.addEventListener('change', function (event) {
//       //     if (event.target.id !== currentFruitId) {
//       //       document.getElementById('fruit-love').innerHTML = `I love ${event.target.value}!`;
//       //       document.getElementById(currentFruitId).checked = false;
//       //       currentFruitId = event.target.id;
//       //     }
//       //   })
//       // }
//       // var currentColors = ['Green', 'Blue'];
//       // const checkboxes = document.querySelectorAll('.checkbox-color')
//       // for (var i = 0; i < checkboxes.length; i++) {
//       //   var checkbox = checkboxes[i];
//       //   checkbox.addEventListener('change', function (event) {
//       //     if (!currentColors.includes(event.target.value)) {
//       //       currentColors.push(event.target.value);
//       //     } else {
//       //       var index = currentColors.indexOf(event.target.value);
//       //       currentColors.splice(index, 1);
//       //     }
//       //     document.getElementById('checkboxes-header').innerHTML = currentColors;
//       //   })
//       // }
//       // document.getElementById('range-slider').addEventListener('input', function (event) {
//       //   document.getElementById('volume-value').innerHTML = `&nbsp;${event.target.value}`;
//       //   if (event.target.value > 80) {
//       //     document.getElementById('careful-message').style.display = 'inline-block';
//       //   } else {
//       //     document.getElementById('careful-message').style.display = 'none';
//       //   }
//       // })
//     }
//   </script>
// </ons-page>

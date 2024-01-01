// import 'onsenui/css/onsenui.css';
// import 'onsenui/css/onsen-css-components.css';

// // Make it global
// import ons from 'onsenui/js/onsenui.js';
// window.ons = ons;

function replaceScripts(subject) {
  const queue = [subject];
  while(queue.length) {
    const element = queue.shift();
    switch(element.tagName.toLowerCase()) {
      case 'script':
        const oldScriptEl = element;
        const newScriptEl = document.createElement('script');
        Array.from(oldScriptEl.attributes).forEach(attr => {
          newScriptEl.setAttribute(attr.name, attr.value);
        });
        const scriptText = document.createTextNode(oldScriptEl.innerHTML);
        newScriptEl.appendChild(scriptText);
        oldScriptEl.parentNode.replaceChild(newScriptEl, oldScriptEl);
        break;
      case 'template':
        queue.push(...Array.from(element.content.querySelectorAll('template')));
        queue.push(...Array.from(element.content.querySelectorAll('script')));
        break;
      default:
        queue.push(...Array.from(element.querySelectorAll('template')));
        queue.push(...Array.from(element.querySelectorAll('script')));
        break;
    }
  }
}

// Heavily based on https://stackoverflow.com/a/47614491
function appendHTML(target, html) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  replaceScripts(wrapper);
  Array.from(wrapper.children)
    .forEach(htmlEl => target.appendChild(htmlEl));
}

function appendTemplate(target, html, name) {
  appendHTML(target, `<template id="${name}">${html}</template>`);
}

appendHTML(document.body, `<h1>Hello World!!</h1>`);

// // Load the main template
// import tmpl_app from "./app.html";
// appendHTML(document.body, tmpl_app);

// import tmpl_tabbar from  "./component/tabbar.html";
// appendTemplate(document.body, tmpl_tabbar, "tabbar.html");

// import tmpl_home from  "./page/home.html";
// appendTemplate(document.body, tmpl_home, "home.html");

// import tmpl_settings from "./page/settings.html";
// appendTemplate(document.body, tmpl_settings, "settings.html");

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

// window.appSettings = {
//   get channel() {
//     return new Promise(async resolve => {
//       const allSettings = await _getSettings();
//       resolve((allSettings||{}).channel || '');
//     });
//   },
//   set channel(value) {
//     return new Promise(async resolve => {
//       const allSettings = await _getSettings();
//       allSettings.channel = value;
//       _setSettings(allSettings);
//       resolve();
//     });
//   }
// };

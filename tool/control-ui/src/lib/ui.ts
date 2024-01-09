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

export {
  replaceScripts,
  appendHTML,
  appendTemplate,
};

import { Client } from '../../client-jerry/src/index.ts';

const outlineRadius = 2;
let textShadow = [];
let x, y;
for(x = 0 - outlineRadius ; x <= outlineRadius ; x++ ) {
  for(y= 0 - outlineRadius; y <= outlineRadius ; y++) {
    if (Math.sqrt((x**2)+(y**2)) > outlineRadius) continue;
    textShadow.push(`${x}px ${y}px 0 #000`);
  }
}

const styleEl = document.createElement('STYLE');
styleEl.innerHTML = `
body {
  font-size: 24px;
  font-weight: 700;
  font-family: sans-serif;
  color: black;
  -webkit-text-stroke: 1px black;
  -webkit-text-fill-color: white;
  text-shadow: ${textShadow.join(', ')};
}
`;
document.head.appendChild(styleEl);

const client = new Client("/topic/chat");
client.addListener(({channel, tags, message}) => {
  document.body.innerText = JSON.stringify({ channel, tags, message}, null, 2);
});

// import App from './app.svelte';

// const root = (new Function('return this;'))();

// new App({
//   target : document.body,
// });

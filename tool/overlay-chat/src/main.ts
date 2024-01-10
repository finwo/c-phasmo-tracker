import { Client } from '../../client-jerry/src/index.ts';
import * as notifysl from 'notify-sl';

const second = 1000;
const minute = 60 * second;
const hour   = 60 * minute;
const day    = 24 * hour;

// const outlineRadius = 1;
// let textShadow = [];
// let x, y;
// for(x = 0 - outlineRadius ; x <= outlineRadius ; x++ ) {
//   for(y= 0 - outlineRadius; y <= outlineRadius ; y++) {
//     if (Math.sqrt((x**2)+(y**2)) > outlineRadius) continue;
//     textShadow.push(`${x}px ${y}px 0 #FFF`);
//   }
// }

const styleEl = document.createElement('STYLE');
styleEl.innerHTML = `
body {
  font-size: 2vh;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}
.notify-sl-notification h2 {
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
  text-shadow: 0 0 0 #FFF;
}
img.emote {
  display: inline-block;
  height: 4vh;
}
`;
document.head.appendChild(styleEl);

const client = new Client("/topic/chat");
client.addListener(async ({channel, tags, message}) => {
  console.log(JSON.stringify({channel,tags,message},null,2));

  // Prepping emotes
  const emotes = [];
  if (tags.emotes) {
    for(const emoteId of Object.keys(tags.emotes)) {
      for(const range of tags.emotes[emoteId]) {
        emotes.push({
          id    : emoteId,
          start : parseInt(range.split('-').shift()),
          end   : parseInt(range.split('-').pop()),
          length: parseInt(range.split('-').pop()) - parseInt(range.split('-').shift()) + 1,
        });
      }
    }
  }
  emotes.sort((a,b) => {
    if (a.start < b.start) return 1;
    if (a.start > b.start) return -1;
    return 0;
  });
  let   messageHtml = message;
  for(const emote of emotes) {
    messageHtml = messageHtml.substring(0, emote.start) +
                  `<img class="emote" src="https://static-cdn.jtvnw.net/emoticons/v2/${emote.id}/default/dark/3.0"/>` +
                  messageHtml.substring(emote.end + 1);
  }

  // Build title
  const elTitle              = document.createElement('h2');
  elTitle.innerText          = tags['display-name'];
  elTitle.style.color        = tags['color'] + '80';
  elTitle.style.marginTop    = 0;
  elTitle.style.marginBottom = '1vh';

  // Build message
  const elMessage               = document.createElement('p');
  elMessage.innerHTML           = messageHtml;
  elMessage.style.marginTop     = '1vh';
  elMessage.style.marginBottom  = 0;
  elMessage.style.paddingBottom = 0;

  notifysl.open({
    animationDuration: notifysl.animationDuration,
    closeAll         : false,
    buttons          : false,
    timeout          : 15 * second,
    contents         : [
      elTitle,
      elMessage,
    ],
    style            : {
      boxShadow  : '',
      background : '#0008',
      color      : '#FFF',
      padding    : '1em',
    }
  });

});

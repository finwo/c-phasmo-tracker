import { Client } from '../../client-jerry/src/index.ts';

const second = 1000;
const minute = 60 * second;
const hour   = 60 * minute;
const day    = 24 * hour;

const client = new Client("/topic/chat");
client.addListener(async ({channel, tags, message, self}) => {
  if (message.substring(0,4) !== '!so ') return;

  // Fetch target & strip '@' character if given
  let subject = message.substring(4).split(' ').shift();
  if (subject.substring(0,1) === '@') subject = subject.substring(1);

  // Fetch the current config
  const cfg        = await (await fetch('/config')).json();
  const oauthToken = cfg.oauthToken.split(':').pop();

  // Fetch a set of recent clips
  const clipResponse = await (await fetch(`https://api.twitch.tv/helix/clips?broadcaster_id=${subject}`, {
    headers: {
      'Authorization': `Bearer ${oauthToken}`,
    },
  })).json();

  console.log(clipResponse);

  // console.log(JSON.stringify({channel,tags,message},null,2));

  // // Prepend username in messageHtml
  // messageHtml = `<span class="title" style="color:${tags['color']}90;">${tags['display-name']}</span><br/>` + messageHtml;

  // notyf.open({
  //   type    : 'message',
  //   message : messageHtml,
  // });

});

  // if (message.substring(0,1) !== '!') return;

  // // Initial split & check
  // if (!window.cmds.l) return;
  // const splitted = message.substring(1).split(' ');
  // const argc  = splitted.length - 1;
  // const argv  = { ...splitted };
  // const found = window.cmds._
  //   .filter(c => c.term === argv[0])
  //   .sort((a,b) => ((b.arguments ?? -1) - (a.arguments ?? -1)))
  //   .find(c => (((c.arguments ?? -1) === argc) || ((c.arguments ?? -1) === -1)))
  //   ;
  // if (!found) return;

  // // Build the rest of argv
  // Object.assign(argv, {
  //   '@'      : splitted.slice(1),
  //   'channel': channel.substring(1),
  // }, tags);

  // twitchClient.say(channel, await renderString(found.message, argv));

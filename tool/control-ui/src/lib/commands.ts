const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;

function gettype(subject): string {
  if (null === subject) return 'null';
  if (Array.isArray(subject)) return 'array';
  return typeof subject;
}

function flatten(subject, prefix = '') {
  const output = {};
  for(const key of Object.keys(subject)) {
    const value = subject[key];
    switch(gettype(value)) {
      case 'object':
      case 'array':
        output[prefix + key] = '[object Object]';
        Object.assign(output, flatten(value, prefix + key + '.'));
        break;
      case 'null':
        output[prefix + key] = 'null';
        break;
      case 'string':
        output[prefix + key] = value;
        break;
    }
  }
  return output;
}

async function renderString(template: string, data: any = {}): string {
  let output = template;
  let matches;

  // Replace with argument data
  const squished = flatten(data);
  for(const key of Object.keys(squished)) {
    output = output.replaceAll(`{{${key}}}`, squished[key]);
  }

  // Handle randInt command
  output = output.replace(/\{\{randInt (\d+)( \d+)?\}\}/g, (_, l, h) => {
    if ('undefined' === typeof h) { h = l; l = 0; };
    const minInt = Math.min(parseInt(l), parseInt(h));
    const maxInt = Math.max(parseInt(l), parseInt(h)) + 1;
    const diff   = maxInt - minInt;
    return minInt + Math.floor(Math.random() * diff);
  });

  // // Handle eval command
  // while(matches = output.match(/\{\{eval (.+?)\}\}/)) {
  //   const fn = new Function('return ' + matches[1]);
  //   output = output.replace(matches[0], fn());
  // }

  // Handle urlfetch command
  while(matches = output.match(/\{\{urlfetch (.+?)\}\}/)) {
    const result = await fetch(matches[1]);
    output = output.substring(0, matches.index) +
             (await result.text()) +
             output.substring(matches.index + matches[0].length);
  }

  return output;
}

async function ingestCommands({ channel, tags, message, self }) {
  if (message.substring(0,1) !== '!') return;

  // Initial split & check
  if (!window.cmds.l) return;
  const splitted = message.substring(1).split(' ');
  const argc  = splitted.length - 1;
  const argv  = { ...splitted };
  const found = window.cmds._
    .filter(c => c.term === argv[0])
    .sort((a,b) => ((b.arguments ?? -1) - (a.arguments ?? -1)))
    .find(c => (((c.arguments ?? -1) === argc) || ((c.arguments ?? -1) === -1)))
    ;
  if (!found) return;

  // Build the rest of argv
  Object.assign(argv, {
    '@'      : splitted.slice(1),
    'channel': channel.substring(1),
  }, tags);

  twitchClient.say(channel, await renderString(found.message, argv));
}

export {
  renderString,
  ingestCommands,
};

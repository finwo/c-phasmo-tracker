import { Client } from '../../client-jerry/src/index.ts';

const commands = {
  reset() {
    console.log('RESET CALLED');
  },
  fingies() {
    console.log('FINGIES CALLED');
  },
};

// Ingest commands
const client = new Client("/topic/chat");
client.addListener(async ({self, channel, tags, message}) => {
  if (message.substring(0,1) !== '!') return;

  // Command basics
  const argv = message.substring(1).split(' ');
  if ('function' !== typeof commands[argv[0]]) {
    return;
  }

  // Call it, it can decide perms for itself
  commands[argv[0]](...(argv.slice(1)));

  console.log(JSON.stringify({self,channel,tags,message},null,2));

  // // Check if the chatter has the right permissions
  // const hasPerms = (('#'+tags.username) == channel) || tags.mod;
  // if (!hasPerms) return;

  // const argv = parse(message);
  // console.log(argv);

});

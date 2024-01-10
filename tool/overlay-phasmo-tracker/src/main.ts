import { Client } from '../../client-jerry/src/index.ts';
import { parse } from 'shell-quote';

const client = new Client("/topic/chat");
client.addListener(async ({channel, tags, message}) => {
  console.log(JSON.stringify({channel,tags,message},null,2));

  // Check if the chatter has the right permissions
  const hasPerms = (('#'+tags.username) == channel) || tags.mod;
  if (!hasPerms) return;

  const argv = parse(message);
  console.log(argv);

});

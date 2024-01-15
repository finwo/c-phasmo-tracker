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
  let   replaced = false;
  for(let replaced = true ; replaced ;) {
    replaced = false;
    for(const key of Object.keys(squished)) {
      let tmp = output.replaceAll('{{' + key + '}}', squished[key]);
      if (tmp !== output) {
        output   = tmp;
        replaced = true;
      }
    }
  }

  // Handle eval command
  while(matches = output.match(/\{\{eval (.+?)\}\}/)) {
    const fn = new Function('return ' + matches[1]);
    output = output.replace(matches[0], fn());
  }


  // Handle urlfetch command
  while(matches = output.match(/\{\{urlfetch (.+?)\}\}/)) {
    const result = await fetch(matches[1]);
    output = output.replace(matches[0], await result.text());
  }

  return output;
}

export {
  renderString,
};

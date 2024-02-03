export function qsd(txt) {
  const param = p => decodeURIComponent(p.replace(/\+/g,' '));
  if ('string' !== typeof txt) return {};
  if ('?' === txt.substring(0,1)) txt = txt.substring(1);
  if ('#' === txt.substring(0,1)) txt = txt.substring(1);
  return txt
    .split('&')
    .filter(t => t)
    .reduce((r, token) => {
      const parts = token.split('=');
      r[param(parts[0])] = param(parts[1]);
      return r;
    }, {});
}

export function qse(subject) {
  const param = p => encodeURIComponent(p).replace(/\%20/g,'+');
  if (!subject) return null;
  if ('object' !== typeof subject) return null;
  return Object.keys(subject)
    .map(key => param(key)+'='+param(subject[key]))
    .join('&');
}

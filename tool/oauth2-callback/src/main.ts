import { qsd } from '../../common/query-string.ts';
import errorPage from './error.html';
import successPage from './success.html';

(async () => {
  const provider = document.location.pathname.split('/').pop();

  // Twitch responds success info as hash
  // See https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow
  if ((provider === 'twitch') && document.location.hash) {
    const data     = qsd(document.location.hash);
    const config   = await (await fetch('/config')).json();
    config.auth    = (config.auth || []).filter(auth => auth.platform !== 'twitch');

    config.auth.push({
      platform     : 'twitch',
      token_type   : data.token_type || '',
      access_token : data.access_token || '',
      scope        : (data.scope||'').split(' ').filter(s=>s),
    });

    await fetch('/config', {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config, null, 2),
    })

    document.querySelector('html').innerHTML = successPage;
    await new Promise(r => setTimeout(r,0));
    document.getElementById('title').innerText = 'Authenticated';
    document.getElementById('description').innerText = 'You can safely close this window';

    // Probably won't work, worth a shot though
    setTimeout(() => {
      window.close('', '_parent', '');
    }, 500);

    return;
  }

  // Twitch responds error info as search
  // See https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/#implicit-grant-flow
  if ((provider === 'twitch') && document.location.search) {
    const data = qsd(document.location.search);
    document.querySelector('html').innerHTML = errorPage;
    await new Promise(r => setTimeout(r,0));
    document.getElementById('title').innerText = data.error;
    document.getElementById('description').innerText = data.error_description;
    return;
  }

  // Unknown request/provider/etc
  document.querySelector('html').innerHTML = errorPage;
  await new Promise(r => setTimeout(r,0));
  document.getElementById('title').innerText = 'Bad Request';
  document.getElementById('description').innerText = 'Unknown provider or request format';
})();

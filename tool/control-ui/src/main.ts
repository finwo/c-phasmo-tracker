import App from './app.svelte';

const root = (new Function('return this;'))();

// if ('function' === typeof root.stx_fn) {
//   (async () => {
//     alert(root.stx_fn('pizza', 'calzone'));
//   })();
// }

new App({
  target : document.body,
  // te     : 'st'
});

import App from './app.svelte';

const root = (new Function('return this;'))();

new App({
  target : document.body,
});

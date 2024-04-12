import m from 'mithril';

module.exports = {
  view() {
    return m('ul', [
      m('li', m(m.route.Link, { href: '/settings'               }, 'Settings'              )),
      // m('li', m(m.route.Link, { href: '/chat/settings'          }, 'Chat settings'         )),
      // m('li', m(m.route.Link, { href: '/commands/settings'      }, 'Commands'              )),
      // m('li', m(m.route.Link, { href: '/auto-shoutout/settings' }, 'Auto shoutout settings')),
    ]);
  },
};

    // <ons-card onclick="fn.pushPage({id: 'settings/overlay-chat.html', title: 'Chat settings'})">
    //   <div class="title">Chat settings</div>
    //   <div class="content">Open up settings for the chat overlay</div>
    // </ons-card>

    // <ons-card onclick="fn.pushPage({'id': 'settings/commands.html', 'title': 'Commands'})">
    //   <div class="title">Commands</div>
    //   <div class="content">Control which commands are enabled</div>
    // </ons-card>

    // <ons-card onclick="fn.pushPage({'id': 'settings/auto-shoutout.html', 'title': 'Auto shoutout'})">
    //   <div class="title">Auto shoutout settings</div>
    //   <div class="content">Open up settings for the auto-shoutout feature</div>
    // </ons-card>

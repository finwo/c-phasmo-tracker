import './nav.css';

import m from 'mithril';
import { htmlFor } from '../lib/html-for';
import { classFrom } from '../lib/class-from';
import { createElement, ChevronsRight, Link2 } from 'lucide';

const elChevron = htmlFor(createElement(ChevronsRight));

export default (routes) => ({
  view: () => {
    console.log(m.route.get());
    return m('nav', [
      m('ul', { class: 'nav-list' }, [
        m('li', { class: 'logo' }, [
          m('a', { href: '#!' }, [
            m('span', 'Companio'),
            m.trust(elChevron),
          ]),
        ]),

        ...Object.entries(routes).map(([path,route]) => m('li', { class: 'nav-item' }, [
          m(m.route.Link, { href: path, class: classFrom({ active: m.route.get() == path }) }, [
            m.trust(htmlFor(createElement(route.icon || Link2))),
            m('span', route.label || 'Page'),
          ]),
        ])),

      ]),
    ]);
  },
});

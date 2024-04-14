import m from 'mithril';
import defaultLayout from '../layout/default';
import { Home } from 'lucide';

module.exports = {
  icon: Home,
  label: 'Home',
  view() {
    return 'pizza calzone';
  },
};

import { div, span, section, form, fieldset, label, a, p, input, h1, button, VNode } from '@motorcycle/dom';

import {cssClasses} from '../../utils/classes';
const classes = cssClasses({});

const backgroundImages = {
  1: require('assets/images/login-background.jpg'),
  2: require('assets/images/login-background-2.jpg')
};

const min = 1;
const max = Object.keys(backgroundImages).length;

// @TODO this is a side-effectful function. Move me.
function randomInt(min, max) {
  const minInt = Math.ceil(min);
  const maxInt = Math.floor(max);
  return Math.floor(Math.random() * (maxInt - minInt + 1)) + minInt;
}

export function view(): VNode {
  return section(classes.sel('photo-background'), {
    style: {
      backgroundImage: `url(${backgroundImages[randomInt(min, max)]})`
    }
  }, [
    h1('sparks.network'),
    div([
      div(classes.sel('login', 'box'), [
        h1({ polyglot: { phrase: 'login.title' } } as any),
        div(classes.sel('login', 'form'), [
          div(classes.sel('federated-buttons'), [
            button(classes.sel('google'), { attrs: { 'raisin': void 0 }, polyglot: { phrase: 'login.google' } } as any),
            button(classes.sel('facebook'), { polyglot: { phrase: 'login.facebook' } } as any)
          ]),
          div(classes.sel('divider'), [span('Or')]),
          form([
            fieldset([
              label({ props: { for: 'email' }, polyglot: { phrase: 'login.email' } } as any),
              input(classes.sel('login.email'), { props: { type: 'email', name: 'email' } } as any),
            ]),
            fieldset([
              label({ props: { for: 'password' } }, [
                span({ polyglot: { phrase: 'login.password' } } as any),
                span(classes.sel('help'), [
                  a(classes.sel('forgot-password'), { attrs: { href: '#' }, polyglot: { phrase: 'login.forgotPassword' } } as any)
                ])
              ]),
              input(classes.sel('login.password'), {
                props: {
                  type: 'password',
                  name: 'password'
                }
              })
            ]),
            fieldset(classes.sel('actions'), [
              button(classes.sel('cancel'), { polyglot: { phrase: 'login.cancel' } } as any),
              button(classes.sel('submit'), { polyglot: { phrase: 'login.submit' } } as any)
            ])
          ])
        ]),
        div(classes.sel('footer'), [
          p({ polyglot: { phrase: 'login.footer' } } as any)
        ])
      ]),
    ])
  ]);
}
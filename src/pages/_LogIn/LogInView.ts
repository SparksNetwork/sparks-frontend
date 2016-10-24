import { div, span, section, form, fieldset, label, a, p, input, h1, button, VNode } from '@motorcycle/dom';

import {cssClasses} from '../../utils/classes';
const classes = cssClasses({});

const backgroundImages = [
  require('assets/images/login-background.jpg'),
  require('assets/images/login-background-2.jpg')
];

function LogInView(sources) {
  return {
    DOM: sources.random.map(logInView)
  }
}

function logInView(randomNumber): VNode {
  const backgroundImage =
    backgroundImages[Math.floor(randomNumber * backgroundImages.length)];

  return section(classes.sel('photo-background'), {
    style: {
      backgroundImage: `url(${backgroundImage})`
    }
  }, [
    h1('sparks.network'),
    div([
      div(classes.sel('login', 'box'), [
        h1({polyglot: {phrase: 'login.title'}} as any),
        div(classes.sel('login', 'form'), [
          div(classes.sel('federated-buttons'), [
            button(classes.sel('google'), {
              attrs: {'raisin': void 0},
              polyglot: {phrase: 'login.google'}
            } as any),
            button(classes.sel('facebook'), {polyglot: {phrase: 'login.facebook'}} as any)
          ]),
          div(classes.sel('divider'), [span('Or')]),
          form([
            fieldset([
              label({
                props: {for: 'email'},
                polyglot: {phrase: 'login.email'}
              } as any),
              input(classes.sel('login.email'), {
                props: {
                  type: 'email',
                  name: 'email'
                }
              } as any),
            ]),
            fieldset([
              label({props: {for: 'password'}}, [
                span({polyglot: {phrase: 'login.password'}} as any),
                span(classes.sel('help'), [
                  a(classes.sel('forgot-password'), {
                    attrs: {href: 'forgotPassword'},
                    polyglot: {phrase: 'login.forgotPassword'}
                  } as any)
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
              button(classes.sel('cancel'), {polyglot: {phrase: 'login.cancel'}} as any),
              button(classes.sel('submit'), {polyglot: {phrase: 'login.submit'}} as any)
            ])
          ])
        ]),
        div(classes.sel('footer'), [
          p({polyglot: {phrase: 'login.footer'}} as any)
        ])
      ]),
    ])
  ]);
}

export default LogInView

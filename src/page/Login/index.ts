import { Stream, just, never } from 'most';
import isolate from '@cycle/isolate';
import { div, span, section, form, fieldset, label, a, p, input, h1, button, VNode } from '@motorcycle/dom';
import {Classes} from "../../util/classes";
import {EventWrapper} from "../../component/EventWrapper";
const classes = Classes({})
const backgroundImage = require('assets/images/login-background.jpg')

export type LoginSinks = {
  DOM: Stream<VNode>;
  route$: Stream<string>;
}

function Login() {
  const loginForm = EventWrapper(just(
      section(classes.sel('photo-background'), {
        attrs: {style: `background-image: url('${backgroundImage}');`}
      }, [
        h1('sparks.network'),
        div([
          div(classes.sel('login', 'box'), [
            h1({polyglot: {phrase: 'login.title'}} as any),
            div(classes.sel('login', 'form'), [
              div(classes.sel('federated-buttons'), [
                button(classes.sel('google'), {polyglot: {phrase: 'login.google'}} as any),
                button(classes.sel('facebook'), {polyglot: {phrase: 'login.facebook'}} as any)
              ]),
              div(classes.sel('divider'), [span('Or')]),
              form({on: {submit: 'formSubmit'}}, [
                fieldset([
                  label({attrs: {for: 'email'}, polyglot: {phrase: 'login.email'}} as any, 'hi'),
                  input({attrs: {type: 'email', name: 'email'}} as any),
                ]),
                fieldset([
                  label({attrs: {for: 'password'}}, [
                    span({polyglot: {phrase: 'login.password'}} as any),
                    span(classes.sel('help'), [
                      a(classes.sel('forgot-password'), {attrs: {href: '#'}, polyglot: {phrase: 'login.forgotPassword'}} as any)
                    ])
                  ]),
                  input({
                    attrs: {
                      type: 'password',
                      name: 'password'
                    },
                    on: {
                      focus: 'passwordFocus',
                      blur: 'passwordBlur'
                    }
                  })
                ]),
                fieldset(classes.sel('actions'), [
                  button(classes.sel('cancel'), {polyglot: {phrase: 'login.cancel'}, on: {
                    click: 'cancel'
                  }} as any),
                  button(classes.sel('submit'), {polyglot: {phrase: 'login.submit'}, on: {
                    click: 'submit'
                  }} as any)
                ])
              ])
            ]),
            div(classes.sel('footer'), [
              p({polyglot: {phrase: 'login.footer'}} as any)
            ])
          ])
        ])
      ])
    )
  );

  loginForm.events.forEach(evt => {
    evt.preventDefault();
    console.log(evt);
  });

  return {
    DOM: loginForm.DOM,
    route$: never()
  };
}

export default sources => isolate(Login)(sources);

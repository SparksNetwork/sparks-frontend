// TODO : polyglot sentences
// TODO : css styles
function computeView({authenticationState, authResetState}) {
  let view = null;

  function computeResetPasswordInitView(params) {
    const {
      isDisabled, resetPasswordFeedbackType, resetPasswordFeedbackPhrase
    } = params;

    return section(classes.sel('photo-background'), {
      style: {
        // QUESTION: where does this url function comes from
        backgroundImage: `url(${backgroundImage})`
      }
    }, [
      h1('sparks.network'),
      div([
        // TODO : define a style for reset?? or reuse those under the same
        // name?
        div(classes.sel('login', 'box'), [
          h1({polyglot: {phrase: 'resetPassword.title'}} as any),
          // TODO : define a style for reset?? or reuse those?
          div(classes.sel('login', 'form'), [
            form([
              fieldset({attrs: {disabled: isDisabled}}, [
                // Enter password
                label({
                  props: {for: 'email'},
                  // TODO : forgotPassword.email for some reason is not resolved??
                  polyglot: {phrase: 'resetPassword.enterPassword'}
                } as any),
                // TODO : create a style for password fields
                input(classes.sel('resetPassword.enterPassword'), {
                  props: {
                    type: 'password',
                    name: 'enterPassword'
                  }
                } as any),
                // Confirm password
                label({
                  props: {for: 'email'},
                  // TODO : forgotPassword.email for some reason is not resolved??
                  polyglot: {phrase: 'resetPassword.confirmPassword'}
                } as any),
                // TODO : create a style for password fields
                input(classes.sel('resetPassword.confirmPassword'), {
                  props: {
                    type: 'password',
                    name: 'confirmPassword'
                  }
                } as any),
              ]),
              fieldset(classes.sel('actions'), {attrs: {disabled: isDisabled}}, [
                button(classes.sel('submit'), {
                  polyglot: {phrase: 'resetPassword.resetPassword'}
                } as any)
              ])
            ]),
            // feedback message area
            h4(classes.sel(resetPasswordFeedbackType), {
              polyglot: {phrase: resetPasswordFeedbackPhrase}
            } as any)
          ]),
        ]),
      ])
    ]);
  }

  switch (authResetState as AuthResetState) {
    case AuthResetStateE.RESET_PWD_INIT :
      const params = {
        isDisabled: false,
        resetPasswordFeedbackType: resetPasswordFeedbackTypeMap.none,
        resetPasswordFeedbackPhrase: ''
      }
      view = computeResetPasswordInitView(params);
      break;
    // TODO
    case AuthResetStateE.VERIFY_PASSWORD_RESET_CODE_OK :
    case AuthResetStateE.VERIFY_PASSWORD_RESET_CODE_NOK:
    case AuthResetStateE.CONFIRM_PASSWORD_RESET_OK:
    case AuthResetStateE.CONFIRM_PASSWORD_RESET_NOK:
    case AuthResetStateE.SIGN_IN_WITH_EMAIL_AND_PASSWORD_OK:
    case AuthResetStateE.SIGN_IN_WITH_EMAIL_AND_PASSWORD_NOK:
    case AuthResetStateE.INVALID_STATE :
    default :
      break;
  }

  return {
    DOM: just(view)
  }
}

export {
  computeView
}

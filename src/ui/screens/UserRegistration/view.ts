import { VNode, div, form, fieldset, legend, label, input, button }
  from '@motorcycle/dom';

export function view(): VNode {
  return div([
    form(`#UserRegistration-form`, [
      div([
        fieldset(`#Name-fieldset`, [
          legend(`#Name-legend`, `Name`),
          label(`#FirstName-label`, [
            div(`#FirstName-label-text`),
            input(`#FirstName-input`,
              {
                attrs: {
                  type: `text`,
                  name: `FirstName`,
                  placeholder: `First`
                }
              })
          ]),
          label(`#LastName-label`, [
            div(`#LastName-label-text`),
            input(`#LastName-input`, {
              attrs: {
                type: `text`,
                name: `LastName`,
                placeholder: `Last`
              }
            })
          ])
        ])
      ]), // end: #Name-form-group
      div([
        label(`#EmailAddress-label`, [
          div(`#EmailAddress-label-text`),
          input(`#EmailAddress-input`, {
            attrs: {
              type: `email`,
              name: `EmailAddress`
            }
          })
        ])
      ]), // end: #EmailAddress-form-group
      div([
        label(`#Password-label`, [
          div(`#Password-label-text`),
          input(`#Password-input`, {
            attrs: {
              type: `password`,
              name: `Password`
            }
          })
        ])
      ]), // end: #Password-form-group
      div([
        fieldset(`#Birthday-fieldset`, [
          legend(`#Birthday-legend`, `Birthday`),
          label(`#BirthMonth-label`, [
            div(`#BirthMonth-label-text`),
            input(`#BirthMonth-input`,
              {
                attrs: {
                  type: `text`,
                  name: `BirthMonth`
                }
              })
          ]),
          label(`#BirthDay-label`, [
            div(`#BirthDay-label-text`),
            input(`#BirthDay-input`,
              {
                attrs: {
                  type: `text`,
                  name: `BirthDay`
                }
              })
          ]),
          label(`#BirthYear-label`, [
            div(`#BirthYear-label-text`),
            input(`#BirthYear-input`,
              {
                attrs: {
                  type: `text`,
                  name: `BirthYear`
                }
              })
          ]),
        ])
      ]), // end: #Birthday-form-group
      div([
        label(`#TelephoneNumber-label`, [
          div(`#TelephoneNumber-label-text`),
          input(`#TelephoneNumber-input`, {
            attrs: {
              type: `tel`,
              name: `TelephoneNumber`
            }
          })
        ])
      ]), // end: #TelephoneNumber-form-group
      div([
        label(`#PostalCode-label`, [
          div(`#PostalCode-label-text`),
          input(`#PostalCode-input`, {
            attrs: {
              type: `text`,
              name: `PostalCode`
            }
          })
        ])
      ]), // end: #PostalCode-form-group
      div([
        button(`#Submit-button`, {
          attrs: {
            type: `submit`
          }
        }, `Sign Up`)
      ]), // end: #Actions-form-group
    ])
  ]);
}

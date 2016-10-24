"use strict";
var most_1 = require("most");
var model_1 = require("./model");
var cssClasses_1 = require("../../helpers/cssClasses");
var classes = cssClasses_1.cssClasses({});
function createAuthenticationMethod$(domSource) {
    var google$ = domSource.select(classes.sel('google')).events('click')
        .constant({ method: 'GOOGLE' });
    var facebook$ = domSource.select(classes.sel('facebook')).events('click')
        .constant({ method: 'FACEBOOK' });
    var email$ = domSource.select(classes.sel('login.email')).events('input')
        .map(function (ev) { return ev.target.value; });
    var password$ = domSource.select(classes.sel('login.password')).events('input')
        .map(function (ev) { return ev.target.value; });
    var emailAndPassword$ = most_1.combine(function (email, password) { return ({ method: 'EMAIL_AND_PASSWORD', email: email, password: password }); }, email$, password$);
    var submit$ = domSource.select('form').events('submit')
        .tap(function (ev) { return ev.preventDefault(); });
    var emailAndPasswordAuthenticationMethod$ = emailAndPassword$
        .sampleWith(submit$);
    return most_1.merge(google$, facebook$)
        .merge(emailAndPasswordAuthenticationMethod$)
        .map(model_1.model)
        .map(function (state) { return state.authenticationMethod; })
        .multicast();
}
exports.createAuthenticationMethod$ = createAuthenticationMethod$;

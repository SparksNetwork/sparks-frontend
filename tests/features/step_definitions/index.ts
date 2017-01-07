//import { switchToAFromB } from './switch-to-a-from-b.scenario';
import { connectWithGoogleOrFacebook } from './connect-with-google-facebook.scenario';
//import { connectWithEmailAndPassword } from './connect-with-email-and-password.scenario';

export function test() {
//  switchToAFromB(this);
  connectWithGoogleOrFacebook(this);
//  connectWithEmailAndPassword(this);
}

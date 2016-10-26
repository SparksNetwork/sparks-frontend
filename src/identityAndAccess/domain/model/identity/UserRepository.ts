import { UserCandidate, User, EmailAddress } from './';

export interface UserRepository {
  add(userCandidate: UserCandidate): Promise<User>;

  userFromAuthenticCredentials(
    emailAddress: EmailAddress,
    password: string): Promise<User>
}

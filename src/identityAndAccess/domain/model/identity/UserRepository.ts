import { UserCandidate, User } from './';

export interface UserRepository {
  add(userCandidate: UserCandidate): Promise<User>;
}

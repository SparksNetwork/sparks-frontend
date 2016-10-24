import { UserCandidate } from './';

export interface UserRepository {
  add(userCandidate: UserCandidate);
}

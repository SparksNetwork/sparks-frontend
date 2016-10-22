import { UserCandidate } from './UserCandidate';
import { User } from './User';

export type addToUserRepository = (userCandidate: UserCandidate) => User;

export class AuthenticationError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

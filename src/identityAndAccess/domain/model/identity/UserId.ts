export class UserId {
  private _id: string;

  constructor(id: string) {
    if (!id)
      throw new Error(`\`id\` required.`);

    this._id = id;
  }

  id(): string {
    return this._id;
  }
}

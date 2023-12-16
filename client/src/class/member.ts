import { getRandomString } from "../utils/random";

export default class Member {
  id: string;
  name: string;
  constructor(name: string) {
    this.id = this.generateId(new Date());
    this.name =
      name.length === 0 ? `USER${Math.floor(Math.random() * 99) + 1}` : name;
  }

  /**
   * Generate (almost) unique id
   * @param t Date: current time
   * @returns generated id
   */
  private generateId(t: Date) {
    const timeToken = (t.getTime() % 10000).toString();
    const randomToken = getRandomString();
    return timeToken.concat(randomToken);
  }
}

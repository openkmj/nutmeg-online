import Member from "./member";

export default class Room {
  id: string;
  members: Member[];
  constructor(id: string, members: Member[]) {
    this.id = id;
    this.members = members;
  }

  updateMembers(members: Member[]) {
    this.members = members;
  }
}

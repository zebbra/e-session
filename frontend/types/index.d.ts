export interface IUser {
  id: string;
  name: string;
  handRaised: Boolean;
  conferenceJoined: Boolean;
  screenShared: Boolean;
  jid: string;
  role: string;
}

export interface IRoom {
  id: string;
  name: string;
  messages: IMessage[];
  users: IUser[];
}

export interface IMessage {
  text: string;
  author: IUser;
  room: IRoom;
}

export interface IPoll {
  id: string;
  yes: String[];
  no: String[];
  didNot: String[];
  abstain: String[];
  status: string;
  roomId: string;
}

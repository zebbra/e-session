export interface IUser {
  id: string;
  name: string;
  handRaised: Boolean;
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

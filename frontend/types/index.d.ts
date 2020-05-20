export interface IUser {
  id: string;
  name: string;
}

export interface IMessage {
  text: string;
}

export interface IRoom {
  id: string;
  name: string;
  messages: IMessage[];
}

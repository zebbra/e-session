const createRoom = require("./create.graphql");
const joinRoom = require("./join.graphql");
const leaveRoom = require("./leave.graphql");
const raiseHand = require("./raiseHand.graphql");
const lowerHand = require("./lowerHand.graphql");
const startShare = require("./startShare.graphql");
const endShare = require("./endShare.graphql");
const setActiveAgendaItem = require("./setActiveAgendaItem.graphql");

export {
  createRoom,
  joinRoom,
  leaveRoom,
  raiseHand,
  lowerHand,
  startShare,
  endShare,
  setActiveAgendaItem,
};

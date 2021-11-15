import React from "react";
import PlayerStream from "./PlayerStream";

export default {
  title: "Server/Player Stream",
  component: PlayerStream,
};

export const WhileTyping = () => <PlayerStream playerId="" />;

export const WhileDrawing = () => <PlayerStream playerId="" />;

import React from "react";
import History from "./History";

export default {
  name: "Server/History",
  component: History,
};

export const PlayerHistory = () => <History playerId="" />;

export const NotepadHistory = () => <History ownerId="" />;

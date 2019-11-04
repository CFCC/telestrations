import React, {Component} from "react";
import {State} from "server/webapp/redux/reducers";
import {connect} from "react-redux";
import {BirdsEye, LoadingScreen, PlayerStream, History} from "server/webapp/components";
import {ServerWebAppGameState} from "types/server-webapp";

const mapStateToProps = (state: State) => ({
    gameState: state.state,
    playerId: state.activePlayerId
});

type StateProps = ReturnType<typeof mapStateToProps>;

@connect(mapStateToProps)
export default class App extends Component<StateProps> {
    render() {
        switch (this.props.gameState) {
            case ServerWebAppGameState.LOADING: return <LoadingScreen />;
            case ServerWebAppGameState.BIRDS_EYE: return <BirdsEye />;
            case ServerWebAppGameState.NOTEPAD_HISTORY: return <History notepadOwnerId={this.props.playerId} />;
            case ServerWebAppGameState.PLAYER_HISTORY: return <History playerId={this.props.playerId} />;
            case ServerWebAppGameState.SINGLE_PLAYER: return <PlayerStream playerId={this.props.playerId} />;
            default: return <div />;
        }
    }
}

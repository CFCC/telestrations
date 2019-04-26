import React, {Component} from 'react';
import {State} from "./redux/reducers";
import {ServerWebAppGameState} from "../../types";
import {connect} from "react-redux";
import {BirdsEye, LoadingScreen, PlayerStream, History} from "./components";

interface StateProps {
    gameState: ServerWebAppGameState
}

class App extends Component<StateProps> {
    render() {
        switch (this.props.gameState) {
            case ServerWebAppGameState.LOADING: return <LoadingScreen />;
            case ServerWebAppGameState.BIRDS_EYE: return <BirdsEye />;
            case ServerWebAppGameState.SINGLE_HISTORY: return <History />;
            case ServerWebAppGameState.SINGLE_PLAYER: return <PlayerStream />;
            default: return <div />;
        }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

export default connect(mapStateToProps)(App);

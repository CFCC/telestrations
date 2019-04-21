import React, {Component} from 'react';
import {State} from "./redux/reducers";
import {ClientGameState} from "../types";
import {connect} from "react-redux";
import {Drawing, Finished, LoadingScreen, Typing, Waiting} from "./components";

interface StateProps {
    gameState: ClientGameState
}

class App extends Component<StateProps> {
    render() {
        switch (this.props.gameState) {
            case ClientGameState.ALREADY_STARTED:
            case ClientGameState.LOADING:
                return <LoadingScreen />;
            case ClientGameState.DRAWING:
                 return <Drawing/>;
            case ClientGameState.TYPING:
                return <Typing/>;
            case ClientGameState.FINISHED:
                return <Finished/>;
            case ClientGameState.WAITING:
                return <Waiting />;
            default: return <div />;
        }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

export default connect(mapStateToProps)(App);

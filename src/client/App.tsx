import React, {Component} from 'react';
import {State} from "./redux/reducers";
import {ClientGameState} from "../types";
import {Drawing, Typing, TitleScreen, Waiting} from './components';
import {connect} from "react-redux";

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

type AppProps = ReturnType<typeof mapStateToProps>;

class App extends Component<AppProps> {
    render() {
        switch (this.props.gameState) {
            case ClientGameState.ALREADY_STARTED:
            case ClientGameState.LOADING:
                return <TitleScreen />;
            case ClientGameState.DRAWING:
                 return <Drawing/>;
            case ClientGameState.TYPING:
                return <Typing/>;
            case ClientGameState.WAITING:
                return <Waiting />;
            default: return <div />;
        }
    }
}

export default connect(mapStateToProps)(App);

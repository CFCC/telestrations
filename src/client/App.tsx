import React, {Component} from 'react';
import {State} from "client/redux/reducers";
import {Drawing, TitleScreen, Typing, Waiting} from 'client/components';
import {connect} from "react-redux";
import {ClientGameState} from "types/client";

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

type AppProps = ReturnType<typeof mapStateToProps>;

class App extends Component<AppProps> {
    render() {
        switch (this.props.gameState) {
            case ClientGameState.ALREADY_STARTED:
            case ClientGameState.LOADING:
            case ClientGameState.FINISHED:
                return <TitleScreen />;
            case ClientGameState.DRAWING:
                return <Drawing />;
            case ClientGameState.TYPING:
                return <Typing />;
            case ClientGameState.WAITING:
                return <Waiting />;
            default:
                return <div />;
        }
    }
}

export default connect(mapStateToProps)(App);

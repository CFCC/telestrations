import React, {Component} from 'react';
import LoadingScreen from "./components/LoadingScreen";
import {State} from "./redux/reducers";
import {ClientGameState} from "../types";
import Drawing from "./components/Drawing";
import Typing from "./components/Typing";
import Finished from "./components/Finished";
import {connect} from "react-redux";
import Waiting from "./components/Waiting";

interface StateProps {
    gameState: ClientGameState
}

class App extends Component<StateProps> {
    render() {
        // switch (this.props.gameState) {
        //     case ClientGameState.ALREADY_STARTED:
        //     case ClientGameState.LOADING:
        //         return <LoadingScreen />;
        //     case ClientGameState.DRAWING:
        //          return <Drawing/>;
        //     case ClientGameState.TYPING:
        //         return <Typing/>;
            // case ClientGameState.FINISHED:
            //     return <Finished/>;
            // default: return <div />;
        return <Waiting />
        // }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

export default connect(mapStateToProps)(App);

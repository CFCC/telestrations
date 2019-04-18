import React, {Component} from 'react';
import LoadingScreen from "./components/LoadingScreen";
import {State} from "./redux/reducers";
import {GameState} from "../types";
import Drawing from "./components/Drawing";
import Typing from "./components/Typing";
import Finished from "./components/Finished";
import {connect} from "react-redux";

interface StateProps {
    gameState: GameState
}

class App extends Component<StateProps> {
    render() {
        // switch (this.props.gameState) {
        //     case GameState.ALREADY_STARTED:
        //     case GameState.LOADING:
        //         return <LoadingScreen />;
        //     case GameState.DRAWING:
                 return <Drawing/>;
        //     case GameState.TYPING:
        //         return <Typing/>;
            // case GameState.FINISHED:
            //     return <Finished/>;
            // default: return <div />;
        // }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

export default connect(mapStateToProps)(App);

import React, {Component} from 'react';
import LoadingScreen from "./components/LoadingScreen";
import {State} from "./reducers";
import {GameState} from "../../types";
import Drawing from "./components/Drawing";
import Typing from "./components/Typing";
import Finished from "./components/Finished";
import {connect} from "react-redux";

interface StateProps {
    gameState: GameState
}

class App extends Component<StateProps> {
    render() {
        switch (this.props.gameState) {
            case 'loading': return <LoadingScreen />;
            case 'drawing': return <Drawing/>;
            case 'typing': return <Typing/>;
            case 'finished': return <Finished/>;
            default: return <div />;
        }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.config.state
});

export default connect(mapStateToProps)(App);

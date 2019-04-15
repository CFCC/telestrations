import React, {Component} from 'react';
import LoadingScreen from "./components/LoadingScreen";
import {State} from "./reducers";
import {GameState} from "../../types";
import {connect} from "react-redux";

interface StateProps {
    gameState: GameState
}

class App extends Component<StateProps> {
    render() {
        switch (this.props.gameState) {
            case GameState.LOADING: return <LoadingScreen />;
            default: return <div />;
        }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.config.state
});

export default connect(mapStateToProps)(App);

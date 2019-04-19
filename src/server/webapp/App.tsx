import React, {Component} from 'react';
import LoadingScreen from "./components/LoadingScreen";
import {State} from "./redux/reducers";
import {ClientGameState} from "../../types";
import {connect} from "react-redux";

interface StateProps {
    gameState: ClientGameState
}

class App extends Component<StateProps> {
    render() {
        switch (this.props.gameState) {
            case ClientGameState.LOADING: return <LoadingScreen />;
            default: return <div />;
        }
    }
}

const mapStateToProps = (state: State) => ({
    gameState: state.state
});

export default connect(mapStateToProps)(App);

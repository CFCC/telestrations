import React, {ChangeEvent, Component} from 'react';
import {Button, TextField, WithStyles} from "@material-ui/core";
import {createStyles} from '@material-ui/core/styles';
import {connectAndStyle} from "../util";
import {State} from "../redux/reducers";
import {Dispatch} from "redux";
import {Creator} from "../redux/actions";

const styles = createStyles({
    app: {

    },
    input: {

    }
});

interface TypingProps extends WithStyles<typeof styles> {
    guess: string;
    changeGuess: (string) => Creator.;
    submitGuess;
}

class Typing extends Component<TypingProps> {
    render() {
        return <div>
            <img src={this.props.picture} alt="Previous submission" />
            <TextField value={this.props.guess}
                       variant="outlined"
                       className={this.props.classes.input}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setNickname(e.target.value)} />
            <Button onClick={this.props.submitNickname} variant="contained" color="primary">Submit</Button>
        </div>;
    }
}

const mapStateToProps = (state: State) => ({
    guess: ""
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    changeGuess: null,
    submitGuess: null
});

export default connectAndStyle(Typing, mapStateToProps, mapDispatchToProps, styles);
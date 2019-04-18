import React, {Component} from 'react';
import {Button, TextField, Theme, WithStyles} from "@material-ui/core";
import {createStyles} from '@material-ui/core/styles';
import {connectAndStyle} from "../util";
import {State} from "../redux/reducers";
import * as Creators from "../redux/actions";
import {Event} from "../../types";

const styles = (theme: Theme) => createStyles({
    app: {
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    appWithQuestionBackground: {
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundImage: 'url(/question-marks.jpg)',
        backgroundRepeat: 'repeat',
    },
    input: {
        background: '#FFFFFF',
        borderRadius: theme.shape.borderRadius,
        flex: 1,
        margin: '1em'
    },
    button: {
        flexShrink: 0,
        margin: '1em',
        height: '4em'
    },
    picture: {
        position: 'absolute'
    }
});

const mapStateToProps = (state: State) => ({
    picture: "",
    guess: state.guess
});

const mapDispatchToProps = {
    setGuess: (guess: string) => Creators.setGuess(guess),
    submitGuess: Creators.submitGuess
};

type TypingProps = WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

class Typing extends Component<TypingProps> {
    render() {
        const {picture, guess, classes} = this.props;
        return <div className={picture === "" ? classes.appWithQuestionBackground : classes.app}>
            {picture !== "" ? <img src={picture} alt="Previous submission" className={classes.picture} /> : null}
            <TextField value={guess}
                       variant="outlined"
                       className={classes.input}
                       placeholder={picture === "" ? "Describe a scene" : "What is in this picture?"}
                       onChange={(e: Event) => this.props.setGuess(e.target.value)} />
            <Button onClick={this.props.submitGuess} variant="contained"
                    color="primary"
                    className={classes.button}>Submit</Button>
        </div>;
    }
}

export default connectAndStyle(Typing, mapStateToProps, mapDispatchToProps, styles);
import React, {Component, FormEvent} from 'react';
import {Button, TextField, Theme, withStyles, WithStyles} from "@material-ui/core";
import {createStyles} from '@material-ui/core/styles';
import {State} from "client/redux/reducers";
import * as Creators from "client/redux/actions";
import {connect} from "react-redux";

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

type TypingProps = Partial<WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>>;

export default
@withStyles(styles)
@connect(mapStateToProps, mapDispatchToProps)
class Typing extends Component<TypingProps> {
    dontRefresh = (e: FormEvent) => {
        e.preventDefault();
        return false;
    };

    render() {
        const {picture, guess, classes} = this.props;
        return <form onSubmit={this.dontRefresh}>
            <div className={picture === "" ? classes.appWithQuestionBackground : classes.app}>
                {picture !== "" ? <img src={picture} alt="Previous submission" className={classes.picture} /> : null}
                <TextField value={guess}
                           variant="outlined"
                           className={classes.input}
                           placeholder={picture === "" ? "Describe a scene" : "What is in this picture?"}
                           onChange={(e: Event) => this.props.setGuess(e.target.value)} />
                <Button onClick={this.props.submitGuess} variant="contained"
                        color="primary"
                        type="submit"
                        className={classes.button}>Submit</Button>
            </div>
        </form>;
    }
}

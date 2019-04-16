import React, {ChangeEvent, Component} from 'react';
import {Button, TextField, WithStyles} from "@material-ui/core";
import {createStyles} from '@material-ui/core/styles';
import {connectAndStyle} from "../util";
import {State} from "../redux/reducers";
import * as Creators from "../redux/actions";

const styles = createStyles({
    app: {

    },
    input: {

    }
});

const mapStateToProps = (state: State) => ({
    picture: "",
    guess: ""
});

const mapDispatchToProps = {
    setGuess: (guess: string) => Creators.setGuess(guess),
    submitGuess: Creators.submitGuess
};

type TypingProps = WithStyles<typeof styles> & typeof mapDispatchToProps & ReturnType<typeof mapStateToProps>;

class Typing extends Component<TypingProps> {
    render() {
        return <div>
            <img src={this.props.picture} alt="Previous submission" />
            <TextField value={this.props.guess}
                       variant="outlined"
                       className={this.props.classes.input}
                       onChange={(e: ChangeEvent<HTMLInputElement>) => this.props.setGuess(e.target.value)} />
            <Button onClick={this.props.submitGuess} variant="contained" color="primary">Submit</Button>
        </div>;
    }
}

export default connectAndStyle(Typing, mapStateToProps, mapDispatchToProps, styles);
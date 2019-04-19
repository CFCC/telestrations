import React, {Component} from 'react';
import {Button, CircularProgress, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    app: {
        backgroundColor: '#FFC20E',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'auto',
        padding: '1em',
        marginBottom: '1em'
    },
    progress: {
        margin: theme.spacing.unit * 5
    },
    img: {
        maxWidth: '80%',
        marginBottom: theme.spacing.unit * 5
    },
    header: {
        textAlign: 'center'
    }
});

interface WaitingState {
    dog: string
}

class Waiting extends Component<WithStyles<typeof styles>, WaitingState> {
    state: WaitingState = {
        dog: ''
    };

    newDog = async () => {
        let dog = JSON.parse(await fetch('https://random.dog/woof.json').then(a => a.text())).url;
        this.setState({dog})
    };

    componentDidMount() {
        this.newDog();
    }

    render() {
        return <div className={this.props.classes.app}>
            <h1 className={this.props.classes.header}>The person before you is still finishing!</h1>
            <h3>Please enjoy random pictures of dogs while you wait.</h3>
            <img className={this.props.classes.img} src={this.state.dog} alt="Adorable dog" />
            <Button variant="contained" onClick={this.newDog}>New Dog</Button>
            <CircularProgress className={this.props.classes.progress} />
        </div>
    }
}

export default withStyles(styles)(Waiting);
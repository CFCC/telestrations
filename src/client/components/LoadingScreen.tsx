import React, {Component} from 'react';
import {CircularProgress, createStyles, Theme, withStyles, WithStyles} from "@material-ui/core";

const styles = (theme: Theme) => createStyles({
    app: {
        backgroundColor: '#FFC20E',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        height: '100vh'
    },
    progress: {
        margin: theme.spacing.unit * 5
    }
});

class LoadingScreen extends Component<WithStyles<typeof styles>> {
    render() {
        return (
            <div className={this.props.classes.app}>
                <img src="/logo.png" alt="Telestrations logo" />
                <h1>Waiting for the game to start</h1>
                <h3>Have your host start the game when everyone's joined!</h3>
                <CircularProgress className={this.props.classes.progress} />
            </div>
        );
    }
}

export default withStyles(styles)(LoadingScreen);
import React, {Component} from 'react';
import {Button, createStyles, MobileStepper, WithStyles} from "@material-ui/core";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import SwipeableViews from 'react-swipeable-views';
import {State} from "server/webapp/redux/reducers";
import {NotepadPage} from "types/client";
import {UUID} from "types/shared";

const styles = createStyles({

});

const mapStateToProps = (state: State) => ({
    pages: [] as Array<NotepadPage>
});

type HistoryBaseProps = WithStyles<typeof styles> & ReturnType<typeof mapStateToProps>;

interface NotepadHistoryProps {
    notepadOwnerId: UUID;
}

interface PlayerHistoryProps {
    playerId: UUID;
}

type HistoryProps = Partial<HistoryBaseProps> & (NotepadHistoryProps | PlayerHistoryProps);

interface HistoryState {
    index: number;
}

class History extends Component<HistoryProps, HistoryState> {
    state = {
        index: 0
    };

    changeIndex = (index: number) => this.setState({index});

    indexUp = () => this.setState((state: HistoryState) => ({index: state.index + 1}));

    indexDown = () => this.setState((state: HistoryState) => ({index: state.index - 1}));

    render(): React.ReactNode {
        const pages = this.props.pages || [];

        return <div>
            <SwipeableViews
                axis='x'
                index={this.state.index}
                onChangeIndex={this.changeIndex}
                enableMouseEvents
            >
                {pages.map((page: NotepadPage, index: number) => (
                    <div key={page.text}>
                        {Math.abs(this.state.index - index) <= 2 ? (
                            <img src={atob(page.picture)} alt={page.text} />
                        ) : null}
                    </div>
                ))}
            </SwipeableViews>
            <MobileStepper
                steps={pages.length}
                position="static"
                activeStep={this.state.index}
                nextButton={
                    <Button size="small" onClick={this.indexUp} disabled={this.state.index === pages.length - 1}>
                        Next
                        <KeyboardArrowRight />
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={this.indexDown} disabled={this.state.index === 0}>
                        <KeyboardArrowLeft />
                        Back
                    </Button>
                }
            />
        </div>;
    }
}

export default History;

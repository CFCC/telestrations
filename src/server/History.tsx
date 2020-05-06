import React, {useState} from "react";
import {Button, MobileStepper, Typography} from "@material-ui/core";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import _ from "lodash";

import {useReduxState} from "../utils/hooks";
import {Page} from "../utils/firebase";
import styled from "styled-components";

const Header = styled.div`
    width: 100%;
    height: 2rem;
    line-height: 2rem;
    display: flex;
    justify-content: space-between;
`;

interface HistoryProps {
    ownerId?: string;
    playerId?: string;
}

export default function History({ownerId, playerId}: HistoryProps) {
    const [index, setIndex] = useState(0);
    const indexUp = () => setIndex(index + 1);
    const indexDown = () => setIndex(index - 1);

    const {firebase: {notepads}} = useReduxState();
    let pages: Page[];
    if (ownerId) {
        pages = _.find(notepads, {ownerId})?.pages ?? [];
    } else {
        pages = _.orderBy(
            Object
                .values(notepads)
                .flatMap(n => n.pages.map((p, i): [number, Page] => ([i, p])))
                .filter(p => p[1].author === playerId),
            x => x[0]
        ).map(x => x[1]);
    }

    const nextButton = (
        <Button size="small" onClick={indexUp} disabled={!pages.length || index === pages.length - 1}>
            Next
            <KeyboardArrowRight />
        </Button>
    );
    const backButton = (
        <Button size="small" onClick={indexDown} disabled={index === 0}>
            <KeyboardArrowLeft />
            Back
        </Button>
    );

    return (
        <React.Fragment>
            <Header>
                <Typography><KeyboardArrowLeft /> Back to Birds Eye View</Typography>
                <Typography>{ownerId ? "Notepad History" : "Player History"}</Typography>
                <Typography />
            </Header>
            <SwipeableViews
                axis="x"
                index={index}
                onChangeIndex={setIndex}
                enableMouseEvents={true}
            >
                {pages.map((page, i) => (
                    <div key={page.lastUpdated}>
                        {page.content}
                    </div>
                ))}
            </SwipeableViews>
            <MobileStepper
                steps={pages.length}
                position="static"
                activeStep={index}
                nextButton={nextButton}
                backButton={backButton}
            />
        </React.Fragment>
    );
}

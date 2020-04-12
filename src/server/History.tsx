import React, {useState} from "react";
import {Button, MobileStepper} from "@material-ui/core";
import {KeyboardArrowLeft, KeyboardArrowRight} from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";

interface HistoryProps {
    ownerId?: string;
    playerId?: string;
}

export default function History({ownerId, playerId}: HistoryProps) {
    const [index, setIndex] = useState(0);
    const indexUp = () => setIndex(index + 1);
    const indexDown = () => setIndex(index - 1);

    const pages = [] as any[];

    const nextButton = (
        <Button size="small" onClick={indexUp} disabled={index === pages.length - 1}>
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
        <div>
            <SwipeableViews
                axis="x"
                index={index}
                onChangeIndex={setIndex}
                enableMouseEvents={true}
            >
                {pages.map((page, i) => (
                    <div key={page.text}>
                        {Math.abs(index - i) <= 2 && <img src={atob(page.picture)} alt={page.text} />}
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
        </div>
    );
}

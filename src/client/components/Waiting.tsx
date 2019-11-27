import React, {useEffect, useState} from "react";
import {Typography, withStyles} from "@material-ui/core";
import {ClassProps} from "types/shared";
import {darkPrimary, primary} from "utils/theme";
import {sleep} from "../../utils";

interface Dog {
    url: string;
}

export default withStyles({
    app: {
        background: `linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%)`,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
        marginBottom: "1em",
    },
    progress: {
        margin: 5,
    },
    img: {
        maxWidth: "80%",
        maxHeight: "80%",
        marginBottom: 5,
    },
    header: {
        textAlign: "center",
        margin: "1rem",
    },
    subHeader: {
        margin: "1rem 0 2rem",
    },
})(function Waiting({classes}: ClassProps) {
    const [dog, setDog] = useState("");

    useEffect(() => {
        const newDog = async () => {
            setDog((await fetch("https://random.dog/woof.json").then(a => a.json() as Promise<Dog>)).url);
        };

        (async () => {
            // noinspection InfiniteLoopJS - we want an infinite loop
            while (true) {
                await newDog();
                await sleep(3000);
            }
        })();
    }, []);

    return (<div className={classes.app}>
        <Typography variant="h3" className={classes.header}>The person before you is still finishing!</Typography>
        <Typography className={classes.subHeader}>Please enjoy random pictures of dogs while you wait.</Typography>
        <img className={classes.img} src={dog} alt="Adorable dog" />
    </div>);
});

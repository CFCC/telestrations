import React, {useState, useEffect} from "react";
import {Button, CircularProgress, withStyles} from "@material-ui/core";
import {ClassProps} from "types/shared";
import {primary} from "utils/theme";

export default withStyles({
    app: {
        backgroundColor: primary,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        overflow: "auto",
        padding: "1em",
        marginBottom: "1em",
    },
    progress: {
        margin: 5,
    },
    img: {
        maxWidth: "80%",
        marginBottom: 5,
    },
    header: {
        textAlign: "center",
    },
})(function Waiting({classes}: ClassProps) {
    const [dog, setDog] = useState("");

    const newDog = async () => {
        const doggo = JSON.parse(await fetch("https://random.dog/woof.json").then(a => a.text())).url;
        setDog(doggo);
    };

    useEffect(() => {
        newDog().then(/* do nothing */);
    });

    return (<div className={classes.app}>
        <h1 className={classes.header}>The person before you is still finishing!</h1>
        <h3>Please enjoy random pictures of dogs while you wait.</h3>
        <img className={classes.img} src={dog} alt="Adorable dog" />
        <Button variant="contained" onClick={newDog}>New Dog</Button>
        <CircularProgress className={classes.progress} />
    </div>);
});

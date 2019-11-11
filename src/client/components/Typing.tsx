import React, {FormEvent, useContext} from "react";
import {Button, TextField, withStyles} from "@material-ui/core";
import {GameContext} from "client/Store";
import {ClassProps} from "types/shared";
import {Event} from "types/server-webapp";

export default withStyles({
    app: {
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    appWithQuestionBackground: {
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        backgroundImage: "url(/question-marks.jpg)",
        backgroundRepeat: "repeat",
    },
    input: {
        background: "#FFFFFF",
        flex: 1,
        margin: "1em",
    },
    button: {
        flexShrink: 0,
        margin: "1em",
        height: "4em",
    },
    picture: {
        position: "absolute",
    },
})(function Typing({classes}: ClassProps) {
    const [{content, guess}, {setGuess, submitGuess}] = useContext(GameContext);

    const dontRefresh = (e: FormEvent) => {
        e.preventDefault();
        return false;
    };

    return (<form onSubmit={dontRefresh}>
        <div className={content === "" ? classes.appWithQuestionBackground : classes.app}>
            {content !== "" ? <img src={content} alt="Previous submission" className={classes.picture} /> : null}
            <TextField value={guess}
                variant="outlined"
                className={classes.input}
                placeholder={content === "" ? "Describe a scene" : "What is in this picture?"}
                onChange={(e: Event) => setGuess(e.target.value)} />
            <Button onClick={submitGuess} variant="contained"
                color="primary"
                type="submit"
                className={classes.button}>Submit</Button>
        </div>
    </form>);
});

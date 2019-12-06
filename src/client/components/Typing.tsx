import React, {FormEvent, useContext} from "react";
import {Button, TextField} from "@material-ui/core";
import {GameContext} from "client/Store";
import {Event} from "types/server-webapp";
import styled from "styled-components";

const PlainContainer = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
`;

const ContainerWithQuestionBg = styled.div`
    width: 100vw;
    height: 100vh;
    overflow: auto;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background-image: url(/question-marks.jpg);
    background-repeat: repeat;
`;

const Input = styled(TextField)`
    background: #FFFFFF;
    flex: 1;
    margin: 1em;
`;

const StyledButton = styled(Button)`
    flex-shrink: 0;
    margin: 1em;
    height: 4em;
`;

const Image = styled.img`
    position: absolute;
`;

export default function Typing() {
    const [{content, guess}, {setGuess, submitGuess}] = useContext(GameContext);

    const dontRefresh = (e: FormEvent) => {
        e.preventDefault();
        return false;
    };

    const Container = content === "" ? ContainerWithQuestionBg : PlainContainer;

    return (<form onSubmit={dontRefresh}>
        <Container>
            {content !== "" && <Image
                src={`http://localhost:${process.env.REACT_APP_SERVER_PORT}/i/${content}`}
                alt="Previous submission" />}
            <Input
                value={guess}
                variant="outlined"
                placeholder={content === "" ? "Describe a scene" : "What is in this picture?"}
                onChange={(e: Event) => setGuess(e.target.value)} />
            <StyledButton
                onClick={submitGuess}
                variant="contained"
                color="primary"
                type="submit"
            >
                Submit
            </StyledButton>
        </Container>
    </form>);
}

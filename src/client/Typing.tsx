import React, {FormEvent, useContext} from "react";
import {Button, TextField} from "@material-ui/core";
import {GameContext} from "client/Store";
import {Event} from "types/server";
import styled from "styled-components";

interface FormProps {
    content?: string;
}

const Form = styled.form`
    width: 100%;
    height: 100%;
    background-image: ${(props: FormProps) => props.content === "" ? "url(/question-marks.jpg)" : "none"};
    background-repeat: repeat;
    display: flex;
    align-items: flex-end;
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

    return (<Form onSubmit={dontRefresh} content={content}>
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
    </Form>);
}

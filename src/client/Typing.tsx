import React, {FormEvent, useContext} from "react";
import {Button as UnstyledButton, TextField} from "@material-ui/core";
import styled from "styled-components";

import {GameContext} from "store/client";
import {Event} from "types/server";

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

const Button = styled(UnstyledButton)`
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

    const updateGuess = ({target: {value}}: Event) => setGuess(value);

    return (<Form onSubmit={dontRefresh} content={content}>
        {content !== "" && <Image
            src={content}
            alt="Previous submission" />}
        <Input
            value={guess}
            variant="outlined"
            placeholder={content === "" ? "Describe a scene" : "What is in this picture?"}
            onChange={updateGuess} />
        <Button
            onClick={submitGuess}
            variant="contained"
            color="primary"
            type="submit"
        >
            Submit
        </Button>
    </Form>);
}

import React, {ChangeEvent, FormEvent} from "react";
import {Button as UnstyledButton, TextField} from "@material-ui/core";
import styled from "styled-components";
import _ from "lodash";

import {useSelector, setGuess, submitGuess} from "../utils/store";
import {useDispatch} from "react-redux";

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
    const dispatch = useDispatch();
    const {client: {user}, game: {players, notepads}} = useSelector(state => state);

    if (!user) return null;

    const currentNotepad = notepads[players[user.uid].currentNotepad];
    const content = _.nth(currentNotepad?.pages, -2)?.content
    const guess = _.last(currentNotepad?.pages)?.content;

    const dontRefresh = (e: FormEvent) => {
        e.preventDefault();
        dispatch(submitGuess());
        return false;
    };

    const updateGuess = ({target: {value}}: ChangeEvent<HTMLInputElement>) => dispatch(setGuess(value));

    return (
        <Form onSubmit={dontRefresh} content={content}>
            {content !== "" && <Image
                src={content}
                alt="Previous submission"
            />}
            <Input
                value={guess}
                variant="outlined"
                placeholder={content === "" ? "Describe a scene" : "What is in this picture?"}
                onChange={updateGuess}
            />
            <Button
                variant="contained"
                color="primary"
                type="submit"
            >
                Submit
            </Button>
        </Form>
    );
}

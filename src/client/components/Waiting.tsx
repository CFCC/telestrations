import React, {useEffect, useRef, useState} from "react";
import {Typography} from "@material-ui/core";
import {ClassProps} from "types/shared";
import {darkPrimary, primary} from "utils/theme";
import {sleep} from "../../utils";
import styled from "styled-components";

interface Dog {
    url: string;
}

const Container = styled.div`
    background: linear-gradient(180deg, ${primary} 50%, ${darkPrimary} 100%);
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100vh;
    overflow: auto;
    margin-bottom: 1em;
`;

const Image = styled.img`
    max-width: 80%;
    max-height: 80%;
    margin-bottom: 5px;
`;

const Header = styled(Typography)`
    margin: 1rem;
`;

const SubHeader = styled(Typography)`
    margin: 1rem 0 2rem;
`;

export default function Waiting() {
    const [dog, setDog] = useState("");
    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;

        const newDog = async () => {
            if (mounted.current) {
                setDog((await fetch("https://random.dog/woof.json").then(a => a.json() as Promise<Dog>)).url);
            }
        };

        (async () => {
            // noinspection InfiniteLoopJS - we want an infinite loop
            while (true) {
                await newDog();
                await sleep(3000);
            }
        })();

        return () => {
            mounted.current = false;
        }
    }, []);

    return (<Container>
        <Header variant="h3" align="center">The person before you is still finishing!</Header>
        <SubHeader>Please enjoy random pictures of dogs while you wait.</SubHeader>
        <Image src={dog} alt="Adorable dog" />
    </Container>);
}

import React from "react";
import {CircularProgress, Typography} from "@material-ui/core";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const Progress = styled(CircularProgress)`
    margin: 1rem;
    width: 3rem;
    height: 3rem;
`;

const Image = styled.img`
    max-width: 50%;
    margin: 1rem;
`;

const Header = styled(Typography)`
    text-align: center;
    font-size: 2rem;
    margin: 1rem;
    font-weight: bold;
`;

interface TitleScreenProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    children?: React.ReactNode;
}

export default function TitleScreen({title, subtitle, loading = false, children}: TitleScreenProps) {
    return (
        <Container>
            <Image src="/logo.png" alt="Telestrations logo" />
            <Header>{title}</Header>
            {subtitle && <Typography>{subtitle}</Typography>}
            {children}
            {loading && <Progress />}
        </Container>
    );
}

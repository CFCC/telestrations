import * as React from "react";
import {Dialog, Grid} from "@material-ui/core";
import styled from "styled-components";

interface ColorProps {
    color: string;
    selected: boolean;
}
const Color = styled.div`
    width: 3rem;
    height: 3rem;
    background-color: ${(props: ColorProps) => props.color};
    box-shadow: ${(props: ColorProps) => props.selected ? "inset 3px 3px black, inset -3px -3px black" : "none"};    
`;

const Container = styled.div`
    padding: 2rem;
    width: calc(100% - 4rem);
    overflow-x: hidden;
    overflow-y: auto;
`;

interface SwatchesDialogProps {
    open: boolean;
    setClose: () => void;
    colors: string[][];
    color: string;
    setColor: (color: string) => void;
}

export default function SwatchesDialog({
    open,
    setClose,
    color: selectedColor,
    colors,
    setColor,
}: SwatchesDialogProps) {
    function onColorSelected(c: string) {
        return () => {
            setColor(c);
            setClose();
        };
    }

    return (
        <Dialog open={open} onClose={setClose}>
            <Container>
                <Grid container spacing={2}>
                    {colors.map(colorGroup => (
                        <Grid container item xs={4}>
                            {colorGroup.map(color => (
                                <Grid item>
                                    <Color
                                        color={color}
                                        selected={color === selectedColor}
                                        onClick={onColorSelected(color)}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Dialog>
    );
}

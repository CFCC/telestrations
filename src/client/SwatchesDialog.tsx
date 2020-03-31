import * as React from "react";
import {Dialog, Grid} from "@material-ui/core";

interface SwatchesDialogProps {
    open: boolean;
    setClose: () => void;
    colors: string[][];
    color: string;
    setColor: (color: string) => void;
}

export default function SwatchesDialog({open, setClose, color: selectedColor, colors, setColor}: SwatchesDialogProps) {
    function onColorSelected(c: string) {
        return () => {
            setColor(c);
            setClose();
        };
    }

    return (
        <Dialog open={open} onClose={setClose}>
            <Grid container>
                {colors.map(colorGroup => (
                    <Grid container item xs={3}>
                        {colorGroup.map(color => (
                            <Grid item>
                                <div 
                                    style={{
                                        height: "3rem",
                                        backgroundColor: color,
                                        border: color === selectedColor ? "3px solid black" : undefined,
                                    }}
                                    onClick={onColorSelected(color)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Grid>
        </Dialog>
    );
}

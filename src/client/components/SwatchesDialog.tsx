import * as React from "react";
import {Dialog} from "@material-ui/core";
import {ColorResult, SwatchesPicker} from "react-color";

interface SwatchesDialogProps {
    open: boolean;
    setClose: () => void;
    colors: string[][];
    color: string;
    setColor: (color: ColorResult) => void;
}

export default function SwatchesDialog({open, setClose, color, colors, setColor}: SwatchesDialogProps) {
    function onColorSelected(c: ColorResult) {
        setColor(c);
        setClose();
    }

    return (<Dialog open={open} onClose={setClose}>
        <SwatchesPicker
            colors={colors}
            onChangeComplete={onColorSelected}
            width={400}
            color={color} />
    </Dialog>);
}

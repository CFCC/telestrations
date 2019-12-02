import React, {MutableRefObject, useContext, useRef, useState} from "react";
import {SketchField, Tools} from "react-sketch";
import * as colors from "@material-ui/core/colors"
import {ColorResult} from "react-color";
import {
    Divider,
    Drawer,
    Icon,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Slider,
    Typography,
    withStyles,
} from "@material-ui/core";
import {GameContext} from "client/Store";
import {ClassProps} from "types/shared";
import {useBoolean, useEvent} from "utils/hooks";
import SwatchesDialog from "client/components/SwatchesDialog";
import ListDialog from "client/components/ListDialog";

export default withStyles({
    app: {
        width: "100vw",
        height: "100vh",
    },
    controls: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        flexDirection: "row",
    },
    paper: {
        flex: 1,
        margin: "0.5rem",
        padding: "1rem",
    },
    canvas: {
        height: "100% !important",
    },
    list: {
        width: "auto",
        overflowX: "hidden",
    },
    fab: {
        margin: 2,
    },
    slider: {
        margin: 2,
    },
    colorPicker: {
        width: "100%",
        height: "100%",
    },
})(function Drawing({classes}: ClassProps) {
    const [{content}, {submitGuess, setGuess}] = useContext(GameContext);

    const [tool, setTool] = useState(Tools.Pencil);
    const [color, setColor] = useEvent("#000000", (c: ColorResult) => c.hex);
    const [bgColor, setBgColor] = useEvent("#FFFFFF", (c: ColorResult) => c.hex);
    const [lineWeight, setLineWeight] = useEvent(1, (e, lw: number) => lw);

    const [toolPickerOpen, openToolPicker, closeToolPicker] = useBoolean(false);
    const [colorPickerOpen, openColorPicker, closeColorPicker] = useBoolean(false);
    const [bgColorPickerOpen, openBgColorPicker, closeBgColorPicker] = useBoolean(false);
    const [menuOpen, openMenu, closeMenu] = useBoolean(false);

    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    const sketch: MutableRefObject<SketchField> = useRef(new SketchField({}));

    const undo = () => {
        sketch.current.undo();
        setCanUndo(sketch.current.canUndo());
        setCanRedo(sketch.current.canRedo());
    };
    const redo = () => {
        sketch.current.redo();
        setCanUndo(sketch.current.canUndo());
        setCanRedo(sketch.current.canRedo());
    };
    const clear = () => {
        sketch.current.clear();
        sketch.current.setBackgroundFromDataUrl("");
        setCanUndo(sketch.current.canUndo());
        setCanRedo(sketch.current.canRedo());
    };
    const updateGuess = () => {
        setGuess(sketch.current.toDataURL().replace(/^data:image\/png;base64,/, ""));
        setCanUndo(sketch.current.canUndo());
        setCanRedo(sketch.current.canRedo());
    };

    return (<div className={classes.app}>
        <SketchField
            tool={tool}
            lineColor={color}
            backgroundColor={bgColor}
            lineWidth={lineWeight}
            className={classes.canvas}
            onChange={updateGuess}
            ref={c => (c ? sketch.current = c : 0)} />
        <div className={classes.controls}>
            <IconButton className={classes.fab} onClick={openMenu} color="primary">
                <Icon fontSize="large">menu</Icon>
            </IconButton>
            <Paper className={classes.paper}>
                <Typography variant="h5">
                    {content}
                </Typography>
            </Paper>
        </div>
        <Drawer open={menuOpen} onClose={closeMenu}>
            <div
                tabIndex={0}
                role="button"
                onClick={closeMenu}
                onKeyDown={closeMenu}
            >
                <div className={classes.list}>
                    <List>
                        <ListItem button={true} onClick={openToolPicker}>
                            <ListItemText primary="Tool" />
                        </ListItem>
                        <ListItem button={true} onClick={openColorPicker}>
                            <ListItemText primary="Line Color" />
                        </ListItem>
                        <ListItem button={true} onClick={openBgColorPicker}>
                            <ListItemText primary="Background Color" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem>
                            <ListItemText primary="Line Weight" />
                        </ListItem>
                        <ListItem>
                            <Slider
                                min={1}
                                max={100}
                                step={1}
                                value={lineWeight}
                                className={classes.slider}
                                onChange={setLineWeight} />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button={true} onClick={undo} disabled={!canUndo}>
                            <ListItemText primary="Undo" />
                        </ListItem>
                        <ListItem button={true} onClick={redo} disabled={!canRedo}>
                            <ListItemText primary="Redo" />
                        </ListItem>
                        <ListItem button={true} onClick={clear}>
                            <ListItemText primary="Clear" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button={true} onClick={submitGuess}>
                            <ListItemText primary="Submit" />
                        </ListItem>
                    </List>
                </div>
            </div>
        </Drawer>
        <SwatchesDialog
            open={colorPickerOpen}
            setClose={closeColorPicker}
            colors={Object.values(colors).map(c => Object.values(c).slice(0, 10))}
            setColor={setColor}
            color={color} />
        <SwatchesDialog
            open={bgColorPickerOpen}
            setClose={closeBgColorPicker}
            colors={Object.values(colors).map(c => Object.values(c).slice(0, 10))}
            setColor={setBgColor}
            color={bgColor} />
        <ListDialog
            open={toolPickerOpen}
            close={closeToolPicker}
            items={Object.keys(Tools)}
            onItemSelected={setTool} />
    </div>);
});

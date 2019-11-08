import React, {useState, useRef, useContext, MutableRefObject} from "react";
import {SketchField, Tools} from "react-sketch";
import * as colors from "@material-ui/core/colors"
import {ColorResult, SwatchesPicker} from "react-color";
import {
    Dialog,
    Divider,
    Drawer,
    Fab,
    Icon,
    List,
    ListItem,
    ListItemText,
    Paper,
    Slider,
    Typography,
    withStyles,
} from "@material-ui/core";
import {GameContext} from "../Store";
import {ClassProps} from "../../types/shared";

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
        margin: 2,
        padding: "1em",
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
    const [state, setWholeState] = useState({
        tool: Tools.Pencil,
        color: "#000000",
        bgColor: "#FFFFFF",
        lineWeight: 1,
        toolPickerOpen: false,
        colorPickerOpen: false,
        bgColorPickerOpen: false,
        menuOpen: false,
        canUndo: false,
        canRedo: false,
    });
    const setState = (newState: object) => setWholeState(Object.assign({}, state, newState));

    const sketch: MutableRefObject<SketchField> = useRef(new SketchField({}));

    const changeLineWeight = (e: any, lineWeight: number | number[]) => setState({lineWeight});

    const openMenu = () => setState({menuOpen: true});
    const closeMenu = () => setState({menuOpen: false});

    const openColorPicker = () => setState({colorPickerOpen: true});
    const closeColorPicker = () => setState({colorPickerOpen: false});
    const changeColor = (color: ColorResult) => setState({color: color.hex, colorPickerOpen: false});

    const openBgColorPicker = () => setState({bgColorPickerOpen: true});
    const closeBgColorPicker = () => setState({bgColorPickerOpen: false});
    const changeBgColor = (color: ColorResult) => setState({bgColor: color.hex, bgColorPickerOpen: false});

    const openToolPicker = () => setState({toolPickerOpen: true});
    const closeToolPicker = () => setState({toolPickerOpen: false});
    const changeTool = (tool: string) => setState({tool, toolPickerOpen: false});

    const undo = () => {
        sketch.current.undo();
        setState({
            canUndo: sketch.current.canUndo(),
            canRedo: sketch.current.canRedo(),
        });
    };

    const redo = () => {
        sketch.current.redo();
        setState({
            canUndo: sketch.current.canUndo(),
            canRedo: sketch.current.canRedo(),
        });
    };

    const clear = () => {
        sketch.current.clear();
        sketch.current.setBackgroundFromDataUrl("");
        setState({
            bgColor: "#FFFFFF",
            canUndo: sketch.current.canUndo(),
            canRedo: sketch.current.canRedo(),
        });
    };

    const updateGuess = () => setGuess(sketch.current.toDataURL());

    // Should these be variables? yeah, but the state wasn't binding correctly
    const drawer = (<Drawer open={state.menuOpen} onClose={closeMenu}>
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
                        <Slider min={1}
                            max={100}
                            step={1}
                            value={state.lineWeight}
                            className={classes.slider}
                            onChange={changeLineWeight} />
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem button={true} onClick={undo}>
                        <ListItemText primary="Undo" />
                    </ListItem>
                    <ListItem button={true} onClick={redo}>
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
    </Drawer>);

    const colorPicker = (<Dialog open={state.colorPickerOpen} onClose={closeColorPicker}>
        <SwatchesPicker colors={Object.values(colors).map(color => Object.values(color).slice(0, 10))}
            onChangeComplete={changeColor}
            width={400}
            color={state.color} />
    </Dialog>);

    const bgColorPicker = (<Dialog open={state.bgColorPickerOpen} onClose={closeBgColorPicker}>
        <SwatchesPicker colors={Object.values(colors).map(color => Object.values(color).slice(0, 10))}
            onChangeComplete={changeBgColor}
            width={400}
            color={state.bgColor} />
    </Dialog>);

    const toolPicker = (<Dialog open={state.toolPickerOpen} onClose={closeToolPicker}>
        <List>
            {Object.keys(Tools).map(tool =>
                (<ListItem button={true} onClick={() => changeTool(tool.toLowerCase())} key={tool}>
                    <ListItemText primary={tool} />
                </ListItem>)
            )}
        </List>
    </Dialog>);

    return (<div className={classes.app}>
        <SketchField tool={state.tool}
            lineColor={state.color}
            backgroundColor={state.bgColor}
            lineWidth={state.lineWeight}
            className={classes.canvas}
            onChange={updateGuess}
            ref={c => (c ? sketch.current = c : 0)} />
        <div className={classes.controls}>
            <Fab color="secondary" aria-label="Edit" className={classes.fab} onClick={openMenu}>
                <Icon>menu</Icon>
            </Fab>
            <Paper className={classes.paper}>
                <Typography variant="h5" component="h3">
                    {content}
                </Typography>
            </Paper>
        </div>
        {drawer}
        {colorPicker}
        {bgColorPicker}
        {toolPicker}
    </div>);
});

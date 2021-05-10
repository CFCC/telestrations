import React, { MutableRefObject, useRef, useState } from "react";
import { SketchField, Tools } from "react-sketch";
import * as colors from "@material-ui/core/colors";
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
} from "@material-ui/core";
import styled from "styled-components";
import _ from "lodash";
import { useDispatch } from "react-redux";

import { actions, setGuess, submitGuess, useSelector } from "../utils/store";
import { useBoolean, useEvent } from "../utils/hooks";
import SwatchesDialog from "../components/SwatchesDialog";
import ListDialog from "../components/ListDialog";
import { GameState } from "../utils/types";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Controls = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
`;

const CaptionContainer = styled(Paper)`
  flex: 1;
  margin: 0.5rem;
  padding: 1rem;
`;

const Canvas = styled(SketchField)`
  height: 100% !important;
  width: 100% !important;

  div,
  canvas {
    height: 100% !important;
    width: 100% !important;
  }
`;

const ListContainer = styled.div`
  width: auto;
  overflow-x: hidden;
`;

const FAB = styled(IconButton)`
  margin: 2px;
`;

const StyledSlider = styled(Slider)`
  margin: 2px;
`;

export default function Drawing() {
  const userId = useSelector((state) => state.settings.id);
  const players = useSelector((state) => state.currentGame.players);
  const dispatch = useDispatch();

  const [tool, setTool] = useState(Tools.Pencil);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState<string>(colors.blueGrey["50"]);
  const [lineWeight, setLineWeight] = useEvent(1, (e, lw: number) => lw);

  const [toolPickerOpen, openToolPicker, closeToolPicker] = useBoolean(false);
  const [colorPickerOpen, openColorPicker, closeColorPicker] = useBoolean(
    false
  );
  const [bgColorPickerOpen, openBgColorPicker, closeBgColorPicker] = useBoolean(
    false
  );
  const [menuOpen, openMenu, closeMenu] = useBoolean(false);

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const sketch: MutableRefObject<SketchField> = useRef(new SketchField({}));

  const currentNotepad = _.find(players, ["settings.id", userId])
    ?.notebookQueue[0];
  const { content } = _.nth(currentNotepad?.pages, -2) ?? {};

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
    setBgColor(bgColor);
    setCanUndo(sketch.current.canUndo());
    setCanRedo(sketch.current.canRedo());
  };
  const updateGuess = async () => {
    await dispatch(setGuess(sketch.current.toDataURL()));
    setCanUndo(sketch.current.canUndo());
    setCanRedo(sketch.current.canRedo());
  };

  async function handleSubmitGuess() {
    await dispatch(submitGuess(sketch.current.toDataURL()));
    dispatch(actions.setGameState(GameState.WAITING_FOR_CONTENT));
  }

  return (
    <Container>
      <Canvas
        tool={tool}
        lineColor={color}
        backgroundColor={bgColor}
        lineWidth={lineWeight}
        onChange={updateGuess}
        ref={(c: any) => (c ? (sketch.current = c) : 0)}
      />
      <Controls>
        <FAB onClick={openMenu} color="primary">
          <Icon fontSize="large">menu</Icon>
        </FAB>
        <CaptionContainer>
          <Typography variant="h5">{content}</Typography>
        </CaptionContainer>
      </Controls>
      <Drawer open={menuOpen} onClose={closeMenu}>
        <div
          tabIndex={0}
          role="button"
          onClick={closeMenu}
          onKeyDown={closeMenu}
        >
          <ListContainer>
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
                <StyledSlider
                  min={1}
                  max={100}
                  step={1}
                  value={lineWeight}
                  onChange={setLineWeight}
                />
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
              <ListItem button={true} onClick={handleSubmitGuess}>
                <ListItemText primary="Submit" />
              </ListItem>
            </List>
          </ListContainer>
        </div>
      </Drawer>
      <SwatchesDialog
        open={colorPickerOpen}
        setClose={closeColorPicker}
        colors={Object.values(colors).map((c) => Object.values(c).slice(0, 10))}
        setColor={setColor}
        color={color}
      />
      <SwatchesDialog
        open={bgColorPickerOpen}
        setClose={closeBgColorPicker}
        colors={Object.values(colors).map((c) => Object.values(c).slice(0, 10))}
        setColor={setBgColor}
        color={bgColor}
      />
      <ListDialog
        open={toolPickerOpen}
        close={closeToolPicker}
        items={Object.keys(Tools)}
        onItemSelected={setTool}
      />
    </Container>
  );
}

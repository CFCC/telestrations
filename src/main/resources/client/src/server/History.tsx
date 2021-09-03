import React, { useState } from "react";
import { Button, Card, CardMedia, Paper, Typography } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { KeyboardArrowLeft } from "@material-ui/icons";
import SwipeableViews from "react-swipeable-views";
import _ from "lodash";
import styled from "styled-components";
import { useDispatch } from "react-redux";

import * as theme from "../utils/theme";
import { GameState, Page } from "../utils/types";
import { setGameState, useSelector } from "../utils/store";

const Header = styled.div`
  background-color: ${theme.secondary};
  color: white;
  width: calc(100% - 2rem);
  height: 2rem;
  padding: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  line-height: 2rem !important;
`;

const BackButton = styled(Button)`
  color: white;
  &:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const PageStepper = styled(Pagination)`
  button {
    color: white;
  }

  .Mui-selected {
    background-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }

  .MuiPaginationItem-page:hover {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const Carousel = styled(SwipeableViews)`
  width: 100%;
  flex: 1;

  & > div,
  .slide {
    height: 100%;
  }
`;

const TextContainer = styled(Paper)`
  width: calc(100% - 10rem);
  height: calc(100% - 10rem);
  margin: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImageContainer = styled(Card)`
  max-width: calc(100% - 10rem);
  max-height: calc(100% - 10rem);
  margin: 5rem;
`;

const Image = styled(CardMedia)`
  padding-top: 56.25%; // 16:9
`;

interface HistoryProps {
  ownerId?: string;
  playerId?: string;
}

export default function History({ ownerId, playerId }: HistoryProps) {
  const players = useSelector((state) => state.gamekit.currentGame.players);
  const [index, setIndex] = useState(0);
  const handleIndexChange = (e: any, v: number) => setIndex(v - 1);

  let pages: Page[];
  if (ownerId) {
    pages =
      players
        .flatMap((p) => p.notebookQueue)
        .find((n) => n.originalOwnerId === ownerId)?.pages ?? [];
  } else {
    pages = _.orderBy(
      players
        .flatMap((p) => p.notebookQueue)
        .flatMap((n) => n.pages.map((p, i): [number, Page] => [i, p]))
        .filter((p) => p[1].authorId === playerId),
      (x) => x[0]
    ).map((x) => x[1]);
  }

  const dispatch = useDispatch();

  function goBack() {
    dispatch(setGameState(GameState.BIRDS_EYE));
  }

  return (
    <React.Fragment>
      <Header>
        <BackButton onClick={goBack}>
          <KeyboardArrowLeft />
          <Typography>Back to Birds Eye View</Typography>
        </BackButton>
        <Typography variant="h5">
          {ownerId ? "Notepad History" : "Player History"}
        </Typography>
        <PageStepper
          count={pages.length}
          page={index + 1}
          onChange={handleIndexChange}
          size="large"
        />
      </Header>
      <Carousel
        axis="x"
        index={index}
        onChangeIndex={setIndex}
        enableMouseEvents={true}
        slideClassName="slide"
      >
        {pages.map((page, i) =>
          i % 2 === 0 ? (
            <TextContainer key={page.id}>
              <Typography variant="h1">{page.content}</Typography>
            </TextContainer>
          ) : (
            <ImageContainer key={page.id}>
              <Image image={page.content} title="" />
            </ImageContainer>
          )
        )}
      </Carousel>
    </React.Fragment>
  );
}

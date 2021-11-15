import { render } from "../utils/render";
import { NotepadHistory, PlayerHistory } from "./History.stories";
import { act } from "@testing-library/react";

it("Player History Renders", () => {
  let result;
  act(() => {
    result = render(PlayerHistory());
  });
  expect(result.asFragment()).toMatchSnapshot();
});

it("Notepad History Renders", () => {
  let result;
  act(() => {
    result = render(NotepadHistory());
  });
  expect(result.asFragment()).toMatchSnapshot();
});

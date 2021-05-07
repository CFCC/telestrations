import { render } from "../utils/render";
import { WhileDrawing, WhileTyping } from "./PlayerStream.stories";
import { act } from "@testing-library/react";

it("While Drawing Renders", async () => {
  let result;
  await act(() => {
    result = render(WhileDrawing());
  });

  expect(result.asFragment()).toMatchSnapshot();
});

it("While Typing Renders", async () => {
  let result;
  await act(() => {
    result = render(WhileTyping());
  });

  expect(result.asFragment()).toMatchSnapshot();
});

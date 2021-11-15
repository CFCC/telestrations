import { render } from "../utils/render";
import { Standard } from "./Typing.stories";

it("Renders", () => {
  const { asFragment } = render(Standard());
  expect(asFragment()).toMatchSnapshot();
});

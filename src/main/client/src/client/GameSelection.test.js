import { render } from "../utils/render";
import { Standard } from "./GameSelection.stories";

it("Renders", () => {
  const { asFragment } = render(Standard());
  expect(asFragment()).toMatchSnapshot();
});

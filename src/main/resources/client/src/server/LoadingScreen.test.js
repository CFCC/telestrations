import { render } from "../utils/render";
import { Standard } from "./LoadingScreen.stories";

it("Renders", () => {
  const { asFragment } = render(Standard());
  expect(asFragment()).toMatchSnapshot();
});

import {render} from "../utils/render";
import {Standard} from "./LoginScreen.stories";

jest.mock("../utils/firebase");

it('Renders', async () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

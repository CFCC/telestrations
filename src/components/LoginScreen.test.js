import {render} from "../utils/render";
import {Standard} from "./LoginScreen.stories";

it('Renders', async () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

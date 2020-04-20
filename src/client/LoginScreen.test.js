import {render} from "../utils/render";
import {Standard} from "./LoginScreen.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

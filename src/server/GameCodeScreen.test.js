import {render} from "../utils/render";
import {Standard} from "./GameCodeScreen.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

import {render} from "../utils/render";
import {Standard} from "./Waiting.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

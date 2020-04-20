import {render} from "../utils/render";
import {Standard} from "./ListDialog.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

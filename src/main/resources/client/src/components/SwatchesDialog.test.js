import {render} from "../utils/render";
import {Standard} from "./SwatchesDialog.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

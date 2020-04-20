import {render} from "../utils/render";
import {Standard} from "./BirdsEye.stories";

it('Renders', () => {
    const {asFragment} = render(Standard());
    expect(asFragment()).toMatchSnapshot();
});

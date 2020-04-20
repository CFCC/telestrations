import {render} from "../utils/render";
import {WhileDrawing, WhileTyping} from "./PlayerStream.stories";

it('While Drawing Renders', () => {
    const {asFragment} = render(WhileDrawing());
    expect(asFragment()).toMatchSnapshot();
});

it('While Typing Renders', () => {
    const {asFragment} = render(WhileTyping());
    expect(asFragment()).toMatchSnapshot();
});


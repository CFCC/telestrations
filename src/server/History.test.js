import {render} from "../utils/render";
import {PlayerHistory, NotepadHistory} from "./History.stories";

it('Player History Renders', () => {
    const {asFragment} = render(PlayerHistory());
    expect(asFragment()).toMatchSnapshot();
});

it('Notepad History Renders', () => {
    const {asFragment} = render(NotepadHistory());
    expect(asFragment()).toMatchSnapshot();
});

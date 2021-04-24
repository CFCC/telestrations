import {render} from "../utils/render";
import {PlayerHistory, NotepadHistory} from "./History.stories";
import {act} from "@testing-library/react";

it('Player History Renders', async () => {
    let result;
    await act(() => {
        result = render(PlayerHistory());
    })
    expect(result.asFragment()).toMatchSnapshot();
});

it('Notepad History Renders', async () => {
    let result;
    await act(() => {
        result = render(NotepadHistory());
    })
    expect(result.asFragment()).toMatchSnapshot();
});

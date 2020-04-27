import * as store from "./store";

jest.mock("./firebase");

it("Default State", () => {
    expect(store.defaultState).toMatchSnapshot();
});

it("Epic", () => {

});

describe("Reducer", () => {

});

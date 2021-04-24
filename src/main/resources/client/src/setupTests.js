import MutationObserver from '@sheerun/mutationobserver-shim';
window.MutationObserver = MutationObserver;

HTMLCanvasElement.prototype.getContext = jest.fn();

jest.mock("./utils/firebase");

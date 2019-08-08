export function sleep(t: number) {
    return new Promise(res => setTimeout(res, t));
}

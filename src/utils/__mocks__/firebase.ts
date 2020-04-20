const snapshot = {
    onSnapshot: () => {},
}
const ref = {
    ...snapshot,
    where: () => snapshot,
}

export const firebaseLoginUi = {
    start: jest.fn(),
};

export const playerRef = (gameCode: string, playerId: string) => ref;

export const playerListRef = (gameCode: string) => ref;

export const notebookRef = (gameCode: string, notepadId: string) => ref;

export const notebookListRef = (gameCode: string) => ref;

export const gameListRef = () => ref;

export const gameRef = (gameCode: string) => ref;

export const storageRef = (fileName: string) => ref;

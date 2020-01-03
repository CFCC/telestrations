import React, {useContext, useEffect} from "react";
import firebase from "firebase/app";
import * as firebaseUi from "firebaseui";

import {GameContext} from "client/Store";
import {useBoolean} from "utils/hooks";
import TitleScreen from "components/TitleScreen";
import {ClientGameState} from "types/client";

import "firebaseui/dist/firebaseui.css"

const firebaseLoginUi = new firebaseUi.auth.AuthUI(firebase.auth());

export default function LoginScreen() {
    const [{user}, {setGameState, setUser}] = useContext(GameContext);
    const [uiLoading,, uiShown] = useBoolean(true);
    const firebaseLoginUiContainerId = "firebaseui-auth-container";

    useEffect(() => {
        if (!user) firebaseLoginUi.start(`#${firebaseLoginUiContainerId}`, {
            callbacks: {
                uiShown,
            },
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
        });
    });

    firebase.auth().onAuthStateChanged(function(user: firebase.User | null) {
        if (user) {
            setUser(user);
            setGameState(ClientGameState.GAME_SELECTION);
        }
    });

    return (
        <TitleScreen title="Log In" loading={uiLoading}>
            <div id={firebaseLoginUiContainerId} />
        </TitleScreen>
    );
}

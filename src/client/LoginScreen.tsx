import React, {useContext, useEffect} from "react";
import firebase from "firebase/app";
import * as firebaseUi from "firebaseui";

import {GameContext} from "client/Store";
import {useBoolean} from "utils/hooks";

import "firebaseui/dist/firebaseui.css"
import TitleScreen from "./TitleScreen";
import {ClientGameState} from "../types/client";

const firebaseLoginUi = new firebaseUi.auth.AuthUI(firebase.auth());

export default function LoginScreen() {
    const [, {submitNickname, setGameState}] = useContext(GameContext);
    const [uiLoading,, uiShown] = useBoolean(true);
    const firebaseLoginUiContainerId = "firebaseui-auth-container";

    useEffect(() => {
        firebaseLoginUi.start(`#${firebaseLoginUiContainerId}`, {
            callbacks: {
                signInSuccessWithAuthResult: (authResult: any): boolean => {
                    const {user: {displayName, uid}} = authResult;

                    console.log(uid); // We can use the UID to put the user back in the game if they leave
                    submitNickname(displayName);

                    setGameState(ClientGameState.WAITING_TO_START);

                    // False means we will handle the rest of the flow - true would
                    // mean there is another redirect
                    return false;
                },
                uiShown,
            },
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            ],
        });
    });

    return (
        <TitleScreen title="Log In" subtitle="" loading={uiLoading}>
            <div id={firebaseLoginUiContainerId} />
        </TitleScreen>
    );
}

import React, {useEffect} from "react";
import firebase from "firebase/app";
import * as firebaseUi from "firebaseui";
import {createGlobalStyle} from "styled-components";

import {useSelector} from "../utils/store";
import {useBoolean} from "../utils/hooks";
import TitleScreen from "../components/TitleScreen";
import {firebaseLoginUi} from "../utils/firebase";

import "firebaseui/dist/firebaseui.css";

const MakeAnonLoginABetterColor = createGlobalStyle`
    .firebaseui-idp-anonymous { 
        background-color: #000 !important;
    }
`;

export default function LoginScreen() {
    const user = useSelector(state => state.client.user);
    const [uiLoading,, uiShown] = useBoolean(true);
    const firebaseLoginUiContainerId = "firebaseui-auth-container";

    useEffect(() => {
        if (!user) firebaseLoginUi.start(`#${firebaseLoginUiContainerId}`, {
            callbacks: {uiShown},
            signInFlow: 'popup',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.PhoneAuthProvider.PROVIDER_ID,
                firebaseUi.auth.AnonymousAuthProvider.PROVIDER_ID
            ],
        });
    });

    return (
        <TitleScreen title="Log In" loading={uiLoading}>
            <MakeAnonLoginABetterColor />
            <div id={firebaseLoginUiContainerId} />
        </TitleScreen>
    );
}

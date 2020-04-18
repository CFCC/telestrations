import React, {useEffect} from "react";
import firebase from "firebase/app";
import * as firebaseUi from "firebaseui";
import {createGlobalStyle} from "styled-components";
import {uniqueNamesGenerator, colors, animals} from "unique-names-generator";
import _ from "lodash";
import {useDispatch} from "react-redux";

import {useSelector, setUser} from "../utils/store";
import {useBoolean} from "../utils/hooks";
import TitleScreen from "../components/TitleScreen";

import "firebaseui/dist/firebaseui.css"

const firebaseLoginUi = new firebaseUi.auth.AuthUI(firebase.auth());

const MakeAnonLoginABetterColor = createGlobalStyle`
    .firebaseui-idp-anonymous { 
        background-color: #000 !important;
    }
`;

export default function LoginScreen() {
    const dispatch = useDispatch();
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

    firebase.auth().onAuthStateChanged(function(user: firebase.User | null) {
        if (!user) return;
        if (!user.displayName) {
            const displayName = _.startCase(uniqueNamesGenerator({
                dictionaries: [colors, animals],
                length: 2,
                separator: "-",
            }));
            user.updateProfile({displayName});
            dispatch(setUser({...user, displayName}));
        } else {
            dispatch(setUser(user));
        }
    });

    return (
        <TitleScreen title="Log In" loading={uiLoading}>
            <MakeAnonLoginABetterColor />
            <div id={firebaseLoginUiContainerId} />
        </TitleScreen>
    );
}

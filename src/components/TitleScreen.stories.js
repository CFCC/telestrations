import React from 'react';
import {text} from "@storybook/addon-knobs";

import TitleScreen from "./TitleScreen";

export default {
    title: 'Title Screen',
    component: TitleScreen,
};

export const Standard = () => (
    <TitleScreen
        title={text("Title", "Hello, world!")}
        subtitle={text("Subtitle", "How are you?")}
    />
);

export const Loading = () => (
    <TitleScreen
        title={text("Title", "Hello, world!")}
        subtitle={text("Subtitle", "How are you?")}
        loading={true}
    />
);

export const WithChildren = () => (
    <TitleScreen
        title={text("Title", "Hello, world!")}
        subtitle={text("Subtitle", "How are you?")}
    >
        <p style={{marginTop: '2rem'}}>Example child content</p>
    </TitleScreen>
);

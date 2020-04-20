import * as React from "react";
import {action} from "@storybook/addon-actions";

import ListDialog from "./ListDialog";

export default {
    title: 'Common/List Dialog',
    component: ListDialog,
}

export const Standard = () => (
    <ListDialog
        open={true}
        close={action("Dialog Closed")}
        items={[
            "Lorem Ipsum",
            "dolor sit amet",
            "consectetur adipiscing elit",
            "sed do eiusmod",
            "tempor incididunt ut labore",
            "et dolore magna aliqua"
        ]}
        onItemSelected={action("Item Selected")}
    />
);

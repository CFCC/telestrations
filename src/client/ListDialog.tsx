import React from "react";
import {Dialog, List, ListItem, ListItemText} from "@material-ui/core";

interface ListDialogProps {
    open: boolean;
    close: () => void;
    items: string[];
    onItemSelected: (item: string) => void;
}

export default function ListDialog({open, close, items, onItemSelected}: ListDialogProps) {
    const itemSelected = (item: string) => () => {
        // Because this is only being used once, this operation is safe, but if this had to be
        // reused, I'd probably introduce an optional transform prop
        onItemSelected(item.toLowerCase());
        close();
    };

    return (<Dialog open={open} onClose={close}>
        <List>
            {items.map(t => (
                <ListItem
                    button={true}
                    onClick={itemSelected(t)}
                    key={t}
                >
                    <ListItemText primary={t} />
                </ListItem>
            ))}
        </List>
    </Dialog>);
}

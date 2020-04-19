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
        onItemSelected(item.toLowerCase());
        close();
    };

    return (
        <Dialog open={open} onClose={close}>
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
        </Dialog>
    );
}

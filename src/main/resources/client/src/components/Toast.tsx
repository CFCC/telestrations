import { Snackbar } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React, { useEffect, useState } from "react";
import { useSelector } from "../utils/store";

export default function Toast() {
  const [isOpen, setIsOpen] = useState(false);
  const { id, title, description, status } = useSelector(
    (state) => state.toast
  );

  useEffect(() => {
    if (!description) return;
    setIsOpen(false);
    setIsOpen(true);
  }, [id, description]);

  return (
    <Snackbar open={isOpen} autoHideDuration={2000}>
      <Alert severity={status}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {description}
      </Alert>
    </Snackbar>
  );
}

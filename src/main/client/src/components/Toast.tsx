import { useEffect } from "react";
import { useSelector } from "../utils/store";
import { useSnackbar } from "notistack";

export default function Toast() {
  const { enqueueSnackbar } = useSnackbar();
  const { id, status, title, description } = useSelector(
    (state) => state.gamekit.message
  );

  useEffect(() => {
    if (!id) return;
    enqueueSnackbar(`${title}: ${description}`, { variant: status });
  }, [id, status, title, description, enqueueSnackbar]);

  return null;
}

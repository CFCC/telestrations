import { useEffect } from "react";
import { useSelector } from "../utils/store";
import { useSnackbar } from "notistack";

export default function Toast() {
  const { enqueueSnackbar } = useSnackbar();
  const { id, content, variant } = useSelector((state) => state.toast);

  useEffect(() => {
    if (!id) return;
    enqueueSnackbar(content, { variant });
  }, [id, content, variant, enqueueSnackbar]);

  return null;
}

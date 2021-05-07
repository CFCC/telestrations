import * as React from "react";
import { action } from "@storybook/addon-actions";
import * as colors from "@material-ui/core/colors";

import SwatchesDialog from "./SwatchesDialog";

export default {
  title: "Common/Swatches Dialog",
  component: SwatchesDialog,
};

export const Standard = () => (
  <SwatchesDialog
    open={true}
    setClose={action("Dialog Closed")}
    setColor={action("Color Selected")}
    colors={Object.values(colors).map((c) => Object.values(c).slice(0, 10))}
    color={colors.common.white}
  />
);

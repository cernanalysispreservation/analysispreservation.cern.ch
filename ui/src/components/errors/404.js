import React from "react";
import { Box, Label, Anchor } from "grommet";
import FormPreviousLinkIcon from "grommet/components/icons/base/FormPreviousLink";

const NotFoundPage = () => {
  return (
    <Box flex={true}>
      <Box
        align="center"
        full="horizontal"
        pad="medium"
        colorIndex="neutral-1-a"
      />
      <Box flex={true} colorIndex="light-2" align="center">
        <Label>404 Page Not Found</Label>
        <Anchor
          icon={<FormPreviousLinkIcon />}
          label="Go back to dashboard"
          path="/"
          size="small"
        />
      </Box>
    </Box>
  );
};

export default NotFoundPage;

import React from "react";
import Box from "grommet/components/Box";
import Label from "grommet/components/Button";
import Anchor from "grommet/components/Anchor";
import FormPreviousLinkIcon from "grommet/components/icons/base/FormPreviousLink";

const NotFoundPage = () => {
  return (
    <Box flex>
      <Box
        align="center"
        full="horizontal"
        pad="medium"
      />
      <Box flex colorIndex="light-2" align="center">
        <Label>404 Page Not Found</Label>
      </Box>
      <Box>
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

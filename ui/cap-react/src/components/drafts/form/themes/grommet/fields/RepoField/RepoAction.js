import React from "react";
import PropTypes from "prop-types";
import { Box, Label, Anchor } from "grommet";

const RepoAction = ({ icon = null, onClick = undefined, text = "" }) => {
  return (
    <Box flex={true} direction="row" align="end" pad={{ between: "small" }}>
      <Anchor
        icon={icon}
        onClick={onClick}
        style={{ wordWrap: "nowrap" }}
        flex={true}
        primary
      >
        <Label size="small" uppercase>
          {text}
        </Label>
      </Anchor>
    </Box>
  );
};

RepoAction.propTypes = {
  onClick: PropTypes.func,
  icon: PropTypes.element,
  text: PropTypes.string
};

export default RepoAction;

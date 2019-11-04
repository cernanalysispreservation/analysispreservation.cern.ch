import React from "react";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import DepositAccess from "./DepositAccess";
import { Paragraph, Heading } from "grommet";

class DepositSettings extends React.Component {
  render() {
    return (
      <Box
        flex={true}
        size={{ width: "xlarge" }}
        alignSelf="center"
        pad="medium"
      >
        <Box flex={true}>
          <DepositAccess />
        </Box>
      </Box>
    );
  }
}

DepositSettings.propTypes = {
  match: PropTypes.object,
  error: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  clearError: PropTypes.func,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array,
  handlePermissions: PropTypes.func
};

export default DepositSettings;

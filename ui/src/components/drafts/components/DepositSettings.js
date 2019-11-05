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
          <Box
            flex={false}
            pad="medium"
            colorIndex="light-2"
            direction="row"
            wrap={false}
            margin={{ vertical: "medium", bottom: "large" }}
          >
            <Box flex>
              <Heading tag="h4">Publish to collaboration</Heading>
              <Paragraph margin="none">
                Create a versioned snapsot of the record and make it available
                to the CMS members within CERN Analysis Preservation
              </Paragraph>
            </Box>
            <Box flex={false}>
              <Button onClick={() => {}} primary label="Publish" />
              <Box pad={{ vertical: "small" }}>
                Current Published Version: <strong>Not published yet</strong>
              </Box>
            </Box>
          </Box>
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

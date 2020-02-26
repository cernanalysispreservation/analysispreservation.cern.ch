import React from "react";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import { Heading } from "grommet";

class DraftWorkflows extends React.Component {
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
            <Heading tag="h2">Workflows</Heading>
          </Box>
        </Box>
      </Box>
    );
  }
}

DraftWorkflows.propTypes = {
  match: PropTypes.object,
  error: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array
};

export default DraftWorkflows;

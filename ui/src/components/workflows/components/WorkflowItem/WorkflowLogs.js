import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

import { LazyLog } from "react-lazylog";

class WorkflowsLogs extends React.Component {
  render() {
    // let { match = {} } = this.props;
    // let { params: { workflow_id } = {} } = match;

    return (
      <Box flex={false} size={{ height: "medium" }}>
        <Heading tag="h3">Logs</Heading>
        <LazyLog
          url={`/api/workflows/reana/${this.props.workflow_id}/logs`}
          fetchOptions={{ credentials: "include" }}
        />
      </Box>
    );
  }
}

WorkflowsLogs.propTypes = {
  match: PropTypes.object,
  workflow_id: PropTypes.string
};

export default WorkflowsLogs;

import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

// import { LazyLog } from "react-lazylog";

class WorkflowsLogs extends React.Component {
  render() {
    // let { match = {} } = this.props;
    // let { params: { workflow_id } = {} } = match;

    return (
      <Box flex={false}>
        <Heading tag="h3">Logs</Heading>

        {renderLogs("Workflow Logs", "lasofdfogdsfas \nsadfasdfs \nfsadfsf")}
        {renderLogs("Job Logs", "lasofdfogdsfas \nsadfasdfs \nfsadfsf")}
        {renderLogs(
          "Engine Specific Logs",
          "lasofdfogdsfas \nsadfasdfs \nfsadfsf"
        )}
      </Box>
    );
  }
}

function renderLogs(title, data) {
  return (
    <Box>
      <Heading margin="small" tag="h5">
        {title}
      </Heading>
      <Box colorIndex="grey-1" pad="small">
        <pre style={{ fontSize: "11px" }}>{data}</pre>
      </Box>
    </Box>
  );
}

WorkflowsLogs.propTypes = {
  match: PropTypes.object,
  workflow_id: PropTypes.string
};

export default WorkflowsLogs;

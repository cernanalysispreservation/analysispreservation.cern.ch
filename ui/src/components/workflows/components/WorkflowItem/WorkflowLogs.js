import React from "react";
import PropTypes from "prop-types";

import WorkflowLogDisplay from "./WorkflowLogDisplay";
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

        <WorkflowLogDisplay
          title="Workflow Logs"
          data="lasofdfogdsfas \nsadfasdfs \nfsadfsf"
        />
        <WorkflowLogDisplay
          title="Job Logs"
          data="lasofdfogdsfas \nsadfasdfs \nfsadfsf"
        />

        <WorkflowLogDisplay
          title="Engine Specific Logs"
          data="lasofdfogdsfas \nsadfasdfs \nfsadfsf"
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

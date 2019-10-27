import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import WorkflowInfo from "./WorkflowInfo";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowLogs from "./WorkflowLogs";

class WorkflowsItem extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { params: { workflow_id } = {} } = this.props.match;
    this.props.getWorkflow(workflow_id);
    // this.props.getWorkflowStatus(workflow_id);
  }

  render() {
    let { workflow = null, match = {} } = this.props;
    let { params: { workflow_id } = {} } = match;
    if (!workflow) return null;
    return (
      <Box
        flex={false}
        alignSelf="center"
        pad="medium"
        size={{ width: "xlarge" }}
      >
        <WorkflowHeader workflow={workflow} />
        <WorkflowInfo workflow={workflow} />
        <WorkflowLogs workflow_id={workflow_id} />
      </Box>
    );
  }
}

WorkflowsItem.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object
};

export default WorkflowsItem;

import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import WorkflowInfo from "./WorkflowInfo";
import WorkflowHeader from "./WorkflowHeader";
import WorkflowLogs from "./WorkflowLogs";

class WorkflowsItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      files_to_upload: {}
    };
  }

  componentDidMount() {
    let { params: { workflow_id } = {} } = this.props.match;
    this.props.getWorkflow(workflow_id);
    // this.props.getWorkflowStatus(workflow_id);
  }

  _startWorkflow = () => {
    let { workflow_id } = this.props.workflow.toJS();
    this.props.startWorkflow(workflow_id);
  };

  _getWorkflowFiles = () => {
    let { workflow_id } = this.props.workflow.toJS();
    this.props.getWorkflowFiles(workflow_id);
  };

  _addTempFile = (file, fileToUpload) => {
    this.setState({
      files_to_upload: {
        ...this.state.files_to_upload,
        [file]: fileToUpload
      }
    });
  };

  _uploadFiles = file => {
    if (this.state.files_to_upload[file]) {
      let data = { path: this.state.files_to_upload[file], new_path: file };
      let { workflow_id } = this.props.workflow.toJS();
      this.props.uploadWorkflowFiles(workflow_id, data);
    }
  };

  _toggleFileManager = file => {
    this.props.toggleFilemanagerLayer(true, data =>
      this._addTempFile(file, data)
    );
  };

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
        <WorkflowHeader
          workflow={workflow}
          startWorkflow={this._startWorkflow}
        />

        <WorkflowInfo
          workflow={workflow}
          addTempFile={file => this._toggleFileManager(file)}
          filesToUpload={this.state.files_to_upload}
          uploadFiles={this._uploadFiles}
        />
        <WorkflowLogs workflow={workflow} workflow_id={workflow_id} />
      </Box>
    );
  }
}

WorkflowsItem.propTypes = {
  isLoggedIn: PropTypes.bool,
  history: PropTypes.object,
  match: PropTypes.object,
  toggleFilemanagerLayer: PropTypes.func
};

export default WorkflowsItem;

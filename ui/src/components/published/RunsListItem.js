import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import FormField from "grommet/components/FormField";
import Layer from "grommet/components/Layer";
import Label from "grommet/components/Label";
import ListItem from "grommet/components/ListItem";
import Status from "grommet/components/icons/Status";
import Select from "grommet/components/Select";
import Title from "grommet/components/Title";

import { startWorkflow } from "../../actions/workflows";
import WorkflowStatus from "./components/WorkflowStatus";

class RunsListItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      logsOpen: false,
      status: null,
      intervalId: null,
      logsJobID: null
    };
  }

  componentDidMount() {
    if (this.props.reana_id) {
      this.fetchStatus();
      let intervalId = setInterval(this.fetchStatus, 5000);
      this.setState({ intervalId: intervalId });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  fetchStatus = () => {
    let uri = `/api/reana/status/${this.props.reana_id}`;

    axios
      .get(uri)
      .then(response => {
        this.setState({ status: response.data });
        if (
          response.data.status == "finished" ||
          response.data.status == "created"
        ) {
          clearInterval(this.state.intervalId);
        }
      })
      .catch(() => {
        // dispatch(rerunStatusError(error));
      });
  };

  selectJobs = e => {
    this.setState({ logsJobID: e.value });
  };

  toggleLogs = () => {
    this.setState(state => ({ logsOpen: !state.logsOpen }));
  };

  startWorkflow = () => {
    this.props.startWorkflow(this.props.reana_id);
    let intervalId = setInterval(this.fetchStatus, 5000);
    this.setState({ intervalId: intervalId });
  };

  render() {
    let _run = this.props.run;

    let _status = this.state.status ? this.state.status.status : null;

    return (
      <ListItem>
        <Box direction="row" wrap={false} flex={true} justify="between">
          <Box justify="center" flex={true}>
            <Label margin="none" pad="none">
              {_run && _run.name}
            </Label>
          </Box>
          <Box justify="center" align="center" direction="row" flex={true}>
            <Box align="start">
              <Label margin="small" size="small">
                Status: {_status}
              </Label>
            </Box>
            <Box align="end" margin={{ left: "small" }}>
              {_status === "finished" ? <Status value="ok" /> : null}
            </Box>
          </Box>
          <Box justify="end" align="end" flex={true}>
            {_status !== "queued" ? (
              <Box size="small" flex={false}>
                {_status === "created" ? (
                  <Button onClick={this.startWorkflow} label="Start" />
                ) : (
                  this.state.status && (
                    <WorkflowStatus
                      toggle={this.toggleLogs}
                      status={this.state.status}
                    />
                  )
                )}
              </Box>
            ) : null}
          </Box>
        </Box>

        {this.state.logsOpen && this.state.status ? (
          <Layer onClose={this.toggleLogs} overlayClose={true} closer={true}>
            <Box pad="medium">
              <Box flex={false}>
                <FormField label="Select job to see logs">
                  <Select
                    value={this.state.logsJobID}
                    options={Object.keys(this.state.status.logs)}
                    onChange={this.selectJobs}
                  />
                </FormField>
              </Box>
              {this.state.logsJobID ? (
                <Box flex={true} colorIndex="grey-3" pad="medium">
                  <div
                    style={{
                      overflow: "scroll",
                      textOverflow: "hidden"
                    }}
                  >
                    <pre>
                      {this.state.status
                        ? this.state.status.logs[this.state.logsJobID]
                        : null}
                    </pre>
                  </div>
                </Box>
              ) : null}
            </Box>
          </Layer>
        ) : null}
      </ListItem>
    );
  }
}

RunsListItem.propTypes = {
  match: PropTypes.object,
  RunsListItem: PropTypes.func
};

const mapDispatchToProps = dispatch => {
  return {
    startWorkflow: workflow_id => dispatch(startWorkflow(workflow_id))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(RunsListItem);

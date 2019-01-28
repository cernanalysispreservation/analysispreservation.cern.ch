import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";
import Select from "grommet/components/Select";
import FormField from "grommet/components/FormField";
import Label from "grommet/components/Label";
import ListItem from "grommet/components/ListItem";
import Meter from "grommet/components/Meter";

import axios from "axios";

import {
  REANAStartWorkflow,
  REANAWorkflowStatus
} from "../../actions/published";

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
        if (response.data.status == "finished") {
          clearInterval(this.state.intervalId);
        }
      })
      .catch(error => {
        // dispatch(rerunStatusError(error));
      });
  };

  selectJobs = e => {
    this.setState({ logsJobID: e.value });
  };

  toggleLogs = () => {
    this.setState({ logsOpen: !this.state.logsOpen });
  };

  render() {
    let _run = this.props.run;

    return (
      <ListItem onClick={this.toggleLogs}>
        <Box direction="row" wrap={false} flex={true} justify="between">
          <Box justify="center" flex={true}>
            <Label margin="none" pad="none">
              {" "}
              {this.props.id} {_run && _run.name}{" "}
            </Label>
          </Box>
          <Box justify="end" align="end" flex={true}>
            {this.state.status && this.state.status.status}
            {this.state.status && this.state.status.status !== "queued" ? (
              <Box size="small" flex={false}>
                <Meter
                  value={
                    (this.state.status.progress.finished.total /
                      this.state.status.progress.total.total) *
                    100
                  }
                />
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

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    REANAStartWorkflow: id => dispatch(REANAStartWorkflow(id)),
    REANAWorkflowStatus: id => dispatch(REANAWorkflowStatus(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunsListItem);

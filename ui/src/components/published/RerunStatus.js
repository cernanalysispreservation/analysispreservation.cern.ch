import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Title from "grommet/components/Title";
import Label from "grommet/components/Label";
import Meter from "grommet/components/Meter";

import { getAnalysisStatus } from "../../actions/published";
import RerunOutputs from "./RerunOutputs";

import Spinning from "grommet/components/icons/Spinning";

class RerunStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let that = this;
    let intervalId = setInterval(that.fetchData.bind(that), 5000);
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  fetchData() {
    let { workflow_id } = this.props.match.params;
    if (this.props.run_results) {
      if (this.props.run_results.status !== "finished") {
        this.props.getAnalysisStatus(workflow_id);
      } else {
        clearInterval(this.state.intervalId);
      }
    } else {
      this.props.getAnalysisStatus(workflow_id);
    }
  }

  render() {
    let data = this.props.run_results;
    let constructSeries = () => {
      let series = [];
      for (let i = 1; i <= data.progress.succeeded; i++) {
        let obj = {};
        obj["label"] = `${i}`;
        obj["value"] = 1;
        obj["colorIndex"] = "graph-1";
        series.push(obj);
      }
      return series;
    };
    return (
      <Box size={{ width: { min: "large" } }} flex={true} wrap={false}>
        <Box align="center" justify="center">
          {data && data.status === "finished" ? (
            <Title>...Analysis finished!</Title>
          ) : (
            <Title>Analysis in progress...</Title>
          )}
        </Box>

        {data && data.progress ? (
          <Box align="center">
            <Meter
              series={constructSeries()}
              stacked={true}
              size="large"
              max={data.progress.total_jobs}
              onActive={() => {}}
            />
          </Box>
        ) : null}
        {data && data.progress ? (
          <Box align="center" flex={true} wrap={false}>
            <Box
              size={{ width: "xlarge" }}
              pad="large"
              flex={false}
              wrap={false}
            >
              {data && data.status === "finished" ? null : (
                <Label>Succeeded {data.progress.succeeded} out of 8</Label>
              )}
              {data && data.status === "finished" ? null : (
                <Label>Command: {data.progress.current_command}</Label>
              )}
              {data && data.status === "finished" ? null : (
                <Label>Started: {data.progress.run_started_at}</Label>
              )}
              {data && data.status === "finished" ? (
                <Label>See logs:</Label>
              ) : (
                <Label>Logs:</Label>
              )}
              <Box flex={true} colorIndex="grey-1">
                <pre style={{ color: "#fff" }}>{data.logs}</pre>
              </Box>
              {data && data.status === "finished" ? (
                <Label>Visualise outputs:</Label>
              ) : null}
              {data && data.status === "finished" ? (
                <RerunOutputs
                  workflow_id={this.props.match.params.workflow_id}
                />
              ) : null}
            </Box>
          </Box>
        ) : (
          <Box justify="center" align="center" pad="large">
            <Spinning size="large" />
          </Box>
        )}
      </Box>
    );
  }
}

RerunStatus.propTypes = {
  run_results: PropTypes.object,
  getAnalysisStatus: PropTypes.func,
  match: PropTypes.object
};

function mapStateToProps(state) {
  return {
    run_results: state.published.getIn(["current_run", "data"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getAnalysisStatus: id => dispatch(getAnalysisStatus(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RerunStatus);

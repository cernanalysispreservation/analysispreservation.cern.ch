import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Headline from "grommet/components/Headline";
import PlayFillIcon from "grommet/components/icons/base/PlayFill";

import REANALogo from "../../reana_logo.svg";
import Status from "grommet/components/icons/Status";

class WorkflowsHeader extends React.Component {
  _runWorkflow = () => {};

  render() {
    let { workflow = null } = this.props;
    if (!workflow) return null;
    return (
      <Box flex={false} pad="small" colorIndex="light-2">
        <Box flex={false} wrap={false} direction="row" wrap>
          <Box flex>
            <Headline size="small" strong>
              {workflow.get("name")}
            </Headline>
          </Box>
          <Box flex={false} direction="row" wrap={false}>
            <Status size="small" value="disabled" />
            <span style={{ padding: "0 10px" }}>{workflow.get("status")}</span>
          </Box>
        </Box>
        <Box style={{ fontSize: "13px" }} flex={true} direction="row" wrap>
          <Box flex={true} justify="end">
            <Box flex={false} wrap={false} direction="row" align="center">
              <strong style={{ fontWeight: 600, paddingRight: "10px" }}>
                Engine:{" "}
              </strong>
              <REANALogo width="90" height="15" />
              {/* workflow.get("service") */}
            </Box>
            <Box flex={false} wrap={false} direction="row" align="center">
              <strong style={{ fontWeight: 600, paddingRight: "10px" }}>
                Name in REANA:{" "}
              </strong>
              <Box alignSelf="end">{workflow.get("workflow_name")}</Box>
            </Box>
            <Box flex={false} wrap={false} direction="row" align="center">
              <strong style={{ fontWeight: 600, paddingRight: "10px" }}>
                Run:{" "}
              </strong>
              <Box alignSelf="end">{workflow.get("run")}</Box>
            </Box>
          </Box>
          <Box flex={true} justify="end">
            <Box
              margin={{ left: "large" }}
              justify="end"
              onClick={() => this._runWorkflow}
              colorIndex="neutral-2"
              pad="none"
              justify="center"
              align="center"
            >
              <Box
                flex={true}
                pad="small"
                direction="row"
                justify="around"
                wrap={false}
                onClick={this.props.startWorkflow}
              >
                <PlayFillIcon />
                <span style={{ paddingLeft: "10px" }}>Run</span>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

WorkflowsHeader.propTypes = {
  workflow: PropTypes.bool
};

export default WorkflowsHeader;

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Title from "grommet/components/Title";
import Label from "grommet/components/Label";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";

import {
  REANAStartWorkflow,
  REANAWorkflowStatus,
  REANAWorkflowsGet
} from "../../actions/published";

import RunsListItem from "./RunsListItem";

class RunsIndex extends React.Component {
  constructor(props) {
    super(props);

    console.log("RunsIndex::", props);
  }

  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.REANAWorkflowsGet(id);
  }

  render() {
    return (
      <Box flex={true} wrap={false}>
        <Box colorIndex="grey-4" direction="row" align="center">
          <Box
            pad={{ horizontal: "small" }}
            colorIndex="grey-4"
            justify="between"
          >
            <Anchor
              icon={<LinkPreviousIcon />}
              path={`/published/${this.props.match.params.id}`}
            />
          </Box>
          <Box colorIndex="grey-4" flex={true} align="center">
            <Title>Runs</Title>
          </Box>
        </Box>
        {this.props.runs && Object.keys(this.props.runs.toJS()).length > 0 ? (
          Object.keys(this.props.runs.toJS()).map(reana_id => (
            <RunsListItem
              reana_id={reana_id}
              run={this.props.runs.toJS()[reana_id]}
            />
          ))
        ) : (
          <Box flex={true} align="center" justify="center">
            <Label>No workflows created</Label>
          </Box>
        )}
      </Box>
    );
  }
}

RunsIndex.propTypes = {
  match: PropTypes.object,
  RunsIndex: PropTypes.func
};

function mapStateToProps(state) {
  return {
    runs: state.published.getIn(["runs"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    REANAStartWorkflow: id => dispatch(REANAStartWorkflow(id)),
    REANAWorkflowStatus: id => dispatch(REANAWorkflowStatus(id)),
    REANAWorkflowsGet: published_id => dispatch(REANAWorkflowsGet(published_id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunsIndex);

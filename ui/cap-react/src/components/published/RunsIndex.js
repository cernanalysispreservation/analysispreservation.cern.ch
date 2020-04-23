import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";
import Title from "grommet/components/Title";
import Label from "grommet/components/Label";
import LinkPreviousIcon from "grommet/components/icons/base/LinkPrevious";

import { getWorkflows } from "../../actions/workflows";

import RunsListItem from "./RunsListItem";

class RunsIndex extends React.Component {
  componentDidMount() {
    let { id } = this.props.match.params;
    this.props.getWorkflows(id);
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
        {Object.entries(this.props.runs).length > 0 ? (
          Object.keys(this.props.runs).map((reana_id, index) => (
            <RunsListItem
              key={`${reana_id}-${index}`}
              reana_id={reana_id}
              run={this.props.runs[reana_id]}
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
  runs: PropTypes.object,
  RunsIndex: PropTypes.func,
  getWorkflows: PropTypes.func
};

const mapStateToProps = state => {
  return {
    runs: state.workflows.get("runs")
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getWorkflows: published_id => dispatch(getWorkflows(published_id))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RunsIndex);

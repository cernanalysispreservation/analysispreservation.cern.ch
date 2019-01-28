import React from "react";
import PropTypes from "prop-types";

import _omit from "lodash/omit";

import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";

import CirclePlayIcon from "grommet/components/icons/base/CirclePlay";
import ResourcesIcon from "grommet/components/icons/base/Resources";

import Label from "grommet/components/Label";

const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "control_number"
  ];

  schema.properties = _omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies
  };
  return schema;
};

class PublishedSidebar extends React.Component {
  componentDidMount() {
    // let { id } = this.props.match.params;
    // this.props.getPublishedItem(id);
  }

  render() {
    return (
      <Box align="end" flex={false} pad="small" colorIndex="light-2">
        <Box
          onClick={() =>
            this.props.history.push(
              `/published/${this.props.match.params.id}/runs/create`
            )
          }
          justify="center"
          align="center"
        >
          <CirclePlayIcon />
          <Label size="small">Run</Label>
        </Box>
        <br />
        <Box
          onClick={() =>
            this.props.history.push(
              `/published/${this.props.match.params.id}/runs`
            )
          }
          justify="center"
          align="center"
        >
          <ResourcesIcon />
          <Label size="small">Jobs</Label>
        </Box>
      </Box>
    );
  }
}

PublishedSidebar.propTypes = {
  match: PropTypes.object,
  draft_id: PropTypes.string,
  schemas: PropTypes.object,
  schemaId: PropTypes.string,
  formData: PropTypes.object,
  schemasLoading: PropTypes.bool,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object,
  schema: PropTypes.object,
  uiSchema: PropTypes.object
};

function mapStateToProps(state) {
  return {
    item: state.published.getIn(["current_item", "data"]),
    schema: state.published.getIn(["current_item", "schema"]),
    uiSchema: state.published.getIn(["current_item", "uiSchema"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublishedItem: id => dispatch(getPublishedItem(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PublishedSidebar));

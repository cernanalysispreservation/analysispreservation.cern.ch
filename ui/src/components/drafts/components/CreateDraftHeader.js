import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, Label } from "grommet";

class DraftHeader extends React.Component {
  _createDraft(schema_id) {
    this.props.createDraft(this.props.formData, schema_id);
  }

  render() {
    let group =
      this.props.depositGroups &&
      this.props.depositGroups
        .toJS()
        .filter(dg => dg.deposit_group == this.props.match.params.schema_id);

    if (group && group.length > 0) group = group[0];

    return (
      <Box flex={true} pad={{ horizontal: "small" }}>
        <Label align="start" pad="none" margin="small">
          Create a new {group && group.name}
        </Label>
      </Box>
    );
  }
}

DraftHeader.propTypes = {
  match: PropTypes.object.isRequired,
  depositGroups: PropTypes.object.isRequired,
  createDraft: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    selectedSchema: state.drafts.get("selectedSchema"),
    formData: state.drafts.getIn(["current_item", "formData"]),
    depositGroups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

export default connect(mapStateToProps)(DraftHeader);

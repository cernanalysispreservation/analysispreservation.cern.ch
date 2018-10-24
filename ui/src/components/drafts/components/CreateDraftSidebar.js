import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, FormField, TextInput, Label } from "grommet";

import { generalTitleChange } from "../../../actions/drafts";

class DraftHeader extends React.Component {
  _onChange = e => {
    this.props.generalTitleChange(e.target.value);
  };

  render() {
    let group =
      this.props.depositGroups &&
      this.props.depositGroups
        .toJS()
        .filter(dg => dg.deposit_group == this.props.match.params.schema_id);
    if (group && group.length > 0) group = group[0];

    return (
      <Box
        colorIndex="light-2"
        flex={false}
        pad="large"
        justify="center"
        align="center"
      >
        <Box margin={{ bottom: "medium" }} size="small" flex={false}>
          <Label pad="none"> Start your new {group && group.name} here.</Label>
          <Label pad="none" size="small">
            {" "}
            Provide a title to distinguish it around your drafts
          </Label>
        </Box>

        <Box flex={false}>
          <FormField label="Display Title">
            <TextInput onDOMChange={this._onChange} />
          </FormField>
        </Box>
      </Box>
    );
  }
}

DraftHeader.propTypes = {
  match: PropTypes.object.isRequired,
  generalTitleChange: PropTypes.func.isRequired,
  depositGroups: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    depositGroups: state.auth.getIn(["currentUser", "depositGroups"]),
    general_title: state.auth.getIn(["current_item", "general_title"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    generalTitleChange: title => dispatch(generalTitleChange(title))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftHeader);

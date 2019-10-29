import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import { EditAnchor } from "./DraftActionsButtons";

import EditableTitle from "./EditableTitle";

import { Route } from "react-router-dom";

class DraftDefaultHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // let status =
    //   this.props.draft && this.props.draft._deposit
    //     ? this.props.draft._deposit.status
    //     : null;

    // let isDraft = status == "draft" ? true : false;
    // let isPublishedOnce =
    //   this.props.draft && this.props.draft._deposit
    //     ? this.props.draft._deposit.pid
    //     : null;
    // let title = this.props.draft && this.props.draft.general_title;

    // let dg = null;
    // if (this.props.schema) {
    //   let schema = this.props.schema.split("/");

    //   schema = schema[schema.length - 1];
    //   schema = schema.split("-v0")[0];

    //   let group =
    //     this.props.depositGroups &&
    //     this.props.depositGroups
    //       .toJS()
    //       .filter(dg => dg.deposit_group == schema);

    //   if (group && group.length > 0) dg = group[0];
    // }

    if (this.props.error && this.props.error.status == 403) return null;

    return (
      <Box flex={true} wrap={false} direction="row">
        <Box
          pad={{ horizontal: "small" }}
          justify="start"
          align="center"
          direction="row"
          flex={true}
          wrap={false}
        >
          <EditableTitle />
        </Box>

        <Route
          exact
          path="/drafts/:draft_id"
          render={() => (
            <Box
              pad={{ horizontal: "small" }}
              justify="end"
              align="center"
              direction="row"
              flex={true}
              wrap={false}
            >
              <EditAnchor draft_id={this.props.draft_id} />
            </Box>
          )}
        />
      </Box>
    );
  }
}

DraftDefaultHeader.propTypes = {
  match: PropTypes.object.isRequired,
  draft: PropTypes.object,
  id: PropTypes.string
};

function mapStateToProps(state) {
  return {
    draft_id: state.draftItem.get("id"),
    status: state.draftItem.get("status"),
    draft: state.draftItem.get("data"),
    errors: state.draftItem.get("errors"),
    schema: state.draftItem.get("schema"),
    formData: state.draftItem.get("formData")
    // depositGroups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

export default connect(mapStateToProps)(DraftDefaultHeader);

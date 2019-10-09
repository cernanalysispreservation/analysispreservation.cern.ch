import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route } from "react-router-dom";

// Draft containers
import DraftSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";
import DraftEditor from "./DraftEditor";

import PermissionDenied from "../errors/403";

// Actions
import { getDraftByIdAndInitForm } from "../../actions/draftItem";

class DraftsItemIndex extends React.Component {
  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id == this.props.id) return;
    if (draft_id) this.props.getDraftById(draft_id);
  }

  render() {
    if (this.props.errors && this.props.errors.status == 403)
      return (
        <PermissionDenied
          status={this.props.errors.status}
          message={this.props.errors.message}
        />
      );

    return (
      <Switch>
        <Route exact path={`/drafts/:draft_id`} component={DraftPreview} />
        <Route
          path={`/drafts/:draft_id/edit`}
          render={props => (
            <DraftEditor {...props} formRef={this.props.formRef} />
          )}
        />} />
        <Route path={`/drafts/:draft_id/settings`} component={DraftSettings} />
      </Switch>
    );
  }
}

DraftsItemIndex.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id"),
    errors: state.draftItem.get("errors")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftByIdAndInitForm(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftsItemIndex);

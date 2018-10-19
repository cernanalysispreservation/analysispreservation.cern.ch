import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route } from "react-router-dom";

// Draft containers
import DraftSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";
import DraftEditor from "./DraftEditor";

// Actions
import { getDraftById } from "../../actions/drafts";

class DraftsItemIndex extends React.Component {
  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id) this.props.getDraftById(draft_id);
  }

  render() {
    return (
      <Switch>
        <Route exact path={`/drafts/:draft_id`} component={DraftPreview} />
        <Route path={`/drafts/:draft_id/edit`} render={props => <DraftEditor {...props} formRef={this.props.formRef} />} />} />
        <Route path={`/drafts/:draft_id/settings`} component={DraftSettings} />
      </Switch>
    );
  }
}

DraftsItemIndex.propTypes = {
  getDraftById: PropTypes.func,
  match: PropTypes.object.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftById(id))
  };
}

export default connect(
  () => ({}),
  mapDispatchToProps
)(DraftsItemIndex);

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route, withRouter } from "react-router-dom";

import PlayIcon from "grommet/components/icons/base/Play";
import TechnologyIcon from "grommet/components/icons/base/Technology";
import AppsIcon from "grommet/components/icons/base/Apps";
import SettingsOptionIcon from "grommet/components/icons/base/SettingsOption";
import { Anchor, Box } from "grommet";

import DraftHeader from "./components/DraftHeader";

// Draft containers
import DraftIntegrations from "./components/DraftIntegrations";
import DraftWorkflows from "../workflows";
import DraftSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";
import DraftEditor from "./DraftEditor";

import Sidebar from "./components/DepositSidebar";

import PermissionDenied from "../errors/403";

// Actions
import { getDraftByIdAndInitForm } from "../../actions/draftItem";

class DraftsItemIndex extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    this.formRef = React.createRef();
  }

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

    let { draft_id } = this.props.match.params;

    return (
      <Box flex={true} direction="row" wrap={false}>
        <Box flex={false} colorIndex="brand">
          <Anchor icon={<AppsIcon />} path={`/drafts/${draft_id}/edit`} />
          <Anchor
            icon={<TechnologyIcon />}
            path={`/drafts/${draft_id}/integrations`}
          />
          <Anchor icon={<PlayIcon />} path={`/drafts/${draft_id}/workflows`} />
          <Anchor
            icon={<SettingsOptionIcon />}
            path={`/drafts/${draft_id}/settings`}
          />
        </Box>
        <Box flex={true}>
          <DraftHeader formRef={this.formRef} />
          <Box flex={true}>
            <Switch>
              <Route
                exact
                path={`/drafts/:draft_id`}
                component={DraftPreview}
              />
              <Route
                path={`/drafts/:draft_id/edit`}
                render={props => (
                  <DraftEditor {...props} formRef={this.formRef} />
                )}
              />} />
              <Route
                path={`/drafts/:draft_id/settings`}
                component={DraftSettings}
              />
              <Route
                path={`/drafts/:draft_id/integrations`}
                component={DraftIntegrations}
              />
              <Route
                path={`/drafts/:draft_id/workflows`}
                render={props => <DraftWorkflows draft_id={draft_id} />}
              />
            </Switch>
          </Box>
        </Box>
        <Sidebar />
      </Box>
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

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemIndex)
);

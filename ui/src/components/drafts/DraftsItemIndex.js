import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route, withRouter } from "react-router-dom";
import DocumentIcon from "grommet/components/icons/base/Document";

import PlayIcon from "grommet/components/icons/base/Play";
import ConnectIcon from "grommet/components/icons/base/Connect";
import AppsIcon from "grommet/components/icons/base/Apps";
import SettingsOptionIcon from "grommet/components/icons/base/SettingsOption";
import { Anchor, Box, Heading } from "grommet";
import ReactTooltip from "react-tooltip";

import DraftHeader from "./components/DraftHeader";
import { ShareAnchor, DeleteAnchor } from "./components/DraftActionsButtons";

// Draft containers
import DraftIntegrations from "./components/DraftIntegrations";
import DraftWorkflows from "../workflows";
import DraftSettings from "./components/DepositSettings";
import DraftPreview from "./DraftPreview";
import DraftEditor from "./DraftEditor";
import DraftActionsLayer from "./components/DraftActionsLayer";

import Sidebar from "./components/DepositSidebar";

import PermissionDenied from "../errors/403";
import TrashIcon from "grommet/components/icons/base/Trash";

// Actions
import {
  getDraftByIdAndInitForm,
  deleteDraft,
  toggleActionsLayer
} from "../../actions/draftItem";

import ShareIcon from "grommet/components/icons/base/Share";

class DraftsItemIndex extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    this.formRef = React.createRef();
    this.state = { actionType: null, width: window.innerWidth };
    this.updateWidth = this.updateWidth.bind(this);
  }

  componentWillMount() {
    window.addEventListener("resize", this.updateWidth);
  }

  componentDidMount() {
    let { draft_id } = this.props.match.params;
    if (draft_id == this.props.id) return;
    if (draft_id) this.props.getDraftById(draft_id);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateWidth);
    this.setState({ width: window.innerWidth });
  }

  updateWidth() {
    this.setState({ width: window.innerWidth });
  }

  _deleteDraft() {
    this.props.deleteDraft(this.props.draft_id);
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer();
    this.setState({ actionType: type });
  };

  render() {
    if (this.props.errors && this.props.errors.status == 403)
      return (
        <PermissionDenied
          status={this.props.errors.status}
          message={this.props.errors.message}
        />
      );

    let { draft_id } = this.props.match.params;
    let isDraft = this.props.status == "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;
    return (
      <Box flex={true} wrap={false} direction="row">
        <Box
          flex={false}
          colorIndex="grey-4"
          direction={this.state.width < 720 ? "row" : "column"}
          justify={this.state.width < 720 ? "between" : "start"}
          responsive={false}
        >
          <ReactTooltip />
          <Anchor
            icon={<DocumentIcon />}
            path={`/drafts/${draft_id}/edit`}
            data-tip="Edit metadata"
          />
          <Anchor
            icon={<ConnectIcon />}
            path={`/drafts/${draft_id}/integrations`}
            data-tip="Connect your repositories"
          />
          {/*<Anchor icon={<PlayIcon />} path={`/drafts/${draft_id}/workflows`} data-tip="Run workflows" />*/}
          <Anchor
            icon={<PlayIcon />}
            path={`/drafts/${draft_id}/workflows`}
            data-tip="Run workflows"
          />
          <Anchor
            icon={<ShareIcon />}
            path={`/drafts/${draft_id}/settings`}
            data-tip="Share with others"
          />
          {isDraft && !isPublishedOnce ? (
            <Anchor
              icon={<TrashIcon />}
              onClick={this._actionHandler("delete")}
              data-tip="Delete your analysis"
            />
          ) : null}
          <DraftActionsLayer
            key="action-layer"
            small={this.state.small}
            type={this.state.actionType}
            deleteDraft={this._deleteDraft.bind(this)}
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
    status: state.draftItem.get("status"),
    errors: state.draftItem.get("errors"),
    recid: state.draftItem.get("recid")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDraftById: id => dispatch(getDraftByIdAndInitForm(id)),
    deleteDraft: draft_id => dispatch(deleteDraft(draft_id)),
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DraftsItemIndex)
);

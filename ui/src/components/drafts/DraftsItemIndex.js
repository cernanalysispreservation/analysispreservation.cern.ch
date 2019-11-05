import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Switch, Route, withRouter } from "react-router-dom";
import DocumentIcon from "grommet/components/icons/base/Document";

import PlayIcon from "grommet/components/icons/base/Play";
import ConnectIcon from "grommet/components/icons/base/Connect";
import { Anchor, Box } from "grommet";
import ReactTooltip from "react-tooltip";

import DraftHeader from "./components/DraftHeader";

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
    this.state = { actionType: null };
  }

  componentDidMount() {
    let { draft_id } = this.props.match.params;

    if (draft_id == this.props.id) return;
    if (draft_id) this.props.getDraftById(draft_id);
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
      <Box flex={true} direction="row" wrap={false}>
        <Box flex={false} colorIndex="grey-4">
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
                render={props => (
                  <DraftWorkflows draft_id={draft_id} {...props} />
                )}
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
  match: PropTypes.object.isRequired,
  status: PropTypes.string,
  errors: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  message: PropTypes.string,
  deleteDraft: PropTypes.func,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  toggleActionsLayer: PropTypes.func,
  recid: PropTypes.string
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

import React from "react";

import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import DepositAccess from "./DepositAccess";
import { Paragraph, Heading } from "grommet";
import DraftActionsLayer from "../components/DraftActionsLayer";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import {
  getDraftByIdAndInitForm,
  deleteDraft,
  toggleActionsLayer
} from "../../../actions/draftItem";

class DepositSettings extends React.Component {
  constructor(props) {
    super(props);

    // Create the ref for the form
    this.formRef = React.createRef();
    this.state = { actionType: null };
  }

  _actionHandler = type => () => {
    this.props.toggleActionsLayer();
    this.setState({ actionType: type });
  };

  _deleteDraft() {
    this.props.deleteDraft(this.props.draft_id);
  }

  render() {
    let isDraft = this.props.status === "draft" ? true : false;
    let isPublishedOnce = this.props.recid ? true : false;
    return (
      <Box
        flex={true}
        size={{ width: "xlarge" }}
        alignSelf="center"
        pad="medium"
      >
        <DepositAccess />
        <Box flex={true}>
          <Box
            flex={false}
            pad="medium"
            colorIndex="light-2"
            direction="row"
            wrap={false}
            margin={{ top: "large" }}
          >
            <Box flex>
              <Heading tag="h4">Publish to collaboration</Heading>
              <Paragraph margin="none">
                Create a versioned snapsot of the record and make it available
                to the CMS members within CERN Analysis Preservation
              </Paragraph>
            </Box>
            <Box flex={false}>
              <Button
                onClick={() => {}}
                primary
                colorIndex="accent-2"
                label="Publish"
              />
              <Box pad={{ vertical: "small" }}>
                Current Published Version: <strong>Not published yet</strong>
              </Box>
            </Box>
          </Box>
          <Box
            flex={false}
            pad="medium"
            colorIndex="light-2"
            direction="row"
            wrap={false}
            margin={{ top: "large" }}
          >
            <Box flex>
              <Heading tag="h4">Delete your analysis</Heading>
              <Paragraph margin="none">
                Once you delete your analysis, there is no way to recover it.
                Please make sure that you are certain regarding this action
              </Paragraph>
            </Box>
            <Box justify="center" margin={{ left: "small" }}>
              <Button
                onClick={
                  isDraft && !isPublishedOnce
                    ? this._actionHandler("delete")
                    : null
                }
                critical
                label="Delete"
                style={{ background: "#f04b37", color: "white" }}
              />
              <DraftActionsLayer
                key="action-layer"
                type="delete"
                deleteDraft={this._deleteDraft.bind(this)}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

DepositSettings.propTypes = {
  match: PropTypes.object,
  error: PropTypes.object,
  getDraftById: PropTypes.func,
  loading: PropTypes.bool,
  clearError: PropTypes.func,
  draft_id: PropTypes.string,
  draft: PropTypes.object,
  getUsers: PropTypes.func,
  permissions: PropTypes.array,
  handlePermissions: PropTypes.func
};

function mapStateToProps(state) {
  return {
    status: state.draftItem.get("status"),
    recid: state.draftItem.get("recid")
  };
}
function mapDispatchToProps(dispatch) {
  return {
    deleteDraft: draft_id => dispatch(deleteDraft(draft_id)),
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DepositSettings)
);

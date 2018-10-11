import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Box, Anchor, Sidebar } from "grommet";

import AddIcon from "grommet/components/icons/base/Add";

import { toggleFilemanagerLayer, createDraft } from "../../../actions/drafts";

import { withRouter } from "react-router";

import SectionHeader from "./SectionHeader";
import DepositFilesList from "./DepositFilesList";

class DepositSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  _onSubmit(schema, data) {
    event.preventDefault();
    let initialData = { general_title: data.formData };
    this.props.createDraft(initialData, schema);
    //this.props.initDraft(schema, data.formData )
  }

  render() {
    return (
      <Sidebar full={false} size="medium" colorIndex="light-2">
        <Box flex={true}>
          <SectionHeader
            label="Files | Data | Source Code"
            icon={
              this.props.addAction ? (
                <Anchor
                  onClick={this.props.toggleFilemanagerLayer}
                  size="xsmall"
                  disabled={this.props.draftId ? false : true}
                  icon={<AddIcon />}
                />
              ) : null
            }
          />
          <DepositFilesList
            files={this.props.files || []}
            draftId={this.props.draftId}
          />
        </Box>
        )
      </Sidebar>
    );
  }
}

DepositSidebar.propTypes = {
  showSidebar: PropTypes.bool,
  toggleFilemanagerLayer: PropTypes.func,
  schemas: PropTypes.object,
  selectedSchema: PropTypes.string,
  onChangeSchema: PropTypes.func,
  validate: PropTypes.bool,
  toggleValidate: PropTypes.func,
  liveValidate: PropTypes.bool,
  toggleLiveValidate: PropTypes.func,
  customValidation: PropTypes.bool,
  toggleCustomValidation: PropTypes.func,
  createDraft: PropTypes.func,
  draftId: PropTypes.string,
  addAction: PropTypes.bool,
  match: PropTypes.object,
  files: PropTypes.object
};

function mapStateToProps(state) {
  return {
    showSidebar: state.drafts.get("showSidebar"),
    schema: state.drafts.get("schema"),
    files: state.drafts.getIn(["current_item", "files"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleFilemanagerLayer: () => dispatch(toggleFilemanagerLayer()),
    createDraft: (schema, title) => dispatch(createDraft(schema, title))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DepositSidebar)
);

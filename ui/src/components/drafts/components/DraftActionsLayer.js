import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Layer from "grommet/components/Layer";
import Paragraph from "grommet/components/Paragraph";

import { toggleActionsLayer } from "../../../actions/draftItem";

class DraftActionsLayer extends React.Component {
  renderAction(action) {
    switch (action) {
      case "save":
        this.props.saveData();
        this.props.toggleActionsLayer();
        break;
      case "publish":
        this.props.publishData();
        this.props.toggleActionsLayer();
        break;
      case "delete":
        this.props.deleteDraft();
        this.props.toggleActionsLayer();
        break;
      case "discard":
        this.props.discardData();
        this.props.toggleActionsLayer();
        break;
    }
  }

  renderMessage(action) {
    switch (action) {
      case "save":
        return (
          <Paragraph>Are you sure you want to save your changes?</Paragraph>
        );
      case "publish":
        return (
          <Paragraph>
            Your analysis will now be visible to all members of collaboration.
            Proceed?
          </Paragraph>
        );
      case "delete":
        return (
          <Paragraph>Are you sure you want to delete this draft?</Paragraph>
        );
      case "discard":
        return (
          <Paragraph>
            Discard changes to the previous published version?
          </Paragraph>
        );
    }
  }

  render() {
    return this.props.actionsLayer ? (
      <Layer
        closer={true}
        align="center"
        flush={true}
        overlayClose={true}
        onClose={this.props.toggleActionsLayer}
      >
        <Box
          justify="center"
          flex={true}
          wrap={false}
          pad="medium"
          size="medium"
        >
          {this.renderMessage(this.props.type)}
          <Box direction="row" justify="center" align="center">
            <Box>
              <Button
                label="Yes"
                primary={true}
                onClick={() => this.renderAction(this.props.type)}
              />
            </Box>
            <Box colorIndex="grey-4-a" margin="small">
              <Button
                label="Cancel"
                onClick={() => this.props.toggleActionsLayer()}
              />
            </Box>
          </Box>
        </Box>
      </Layer>
    ) : null;
  }
}

DraftActionsLayer.propTypes = {
  actionsLayer: PropTypes.bool,
  schemaId: PropTypes.object,
  saveData: PropTypes.func,
  publishData: PropTypes.func,
  deleteDraft: PropTypes.func,
  discardData: PropTypes.func,
  type: PropTypes.string,
  toggleActionsLayer: PropTypes.func
};

function mapStateToProps(state) {
  return {
    actionsLayer: state.draftItem.get("actionsLayer")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleActionsLayer: () => dispatch(toggleActionsLayer())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DraftActionsLayer);

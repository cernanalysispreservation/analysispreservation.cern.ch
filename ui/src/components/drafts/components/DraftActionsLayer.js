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
            By publishing your work, you create a versioned snapsot of the record that <b>becomes visible to all</b> the members of your collaboration.<br/><br/> 
            <b>Are you sure you want to publish?</b>
          </Paragraph>
        );
      case "delete":
        return (
            <Paragraph>
                    This will <b>permanently</b> delete this analysis and all related data (<b>including files and workflows</b>).<br/><br/>
                        Already published versions of the analysis <b>will not</b> be affected.<br/><br/>
                        <b>Are you sure you want to delete this draft?</b>
                    </Paragraph> 
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
            align="cener"
          flex={true}
          wrap={false}
          pad="medium"
          size="medium"
        >
        <Box alignContent="center" pad="small">
          {this.renderMessage(this.props.type)}
        </Box>
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

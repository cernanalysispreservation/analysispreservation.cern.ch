import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Layer from "grommet/components/Layer";

import CloseIcon from "grommet/components/icons/base/Close";

import { togglePreviewer } from "../../../actions/draftItem";

import SectionHeader from "./SectionHeader";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
class DepositPreviewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      this.props.showPreviewer && (
        <Layer margin="" flush={true} flex={true} colorIndex="light-2">
          <SectionHeader
            label="Previewer"
            icon={<CloseIcon onClick={() => this.props.togglePreviewer()} />}
          />
          <Box size="xlarge" flex={true}>
            <AceEditor
              mode="json"
              theme="github"
              width="100%"
              readOnly
              name="UNIQUE_ID_OF_DIV"
              value={JSON.stringify(this.props.formData, null, 4)}
              editorProps={{ $blockScrolling: true }}
            />
          </Box>
        </Layer>
      )
    );
  }
}

DepositPreviewer.propTypes = {
  showPreviewer: PropTypes.bool,
  formData: PropTypes.object,
  togglePreviewer: PropTypes.func
};

function mapStateToProps(state) {
  return {
    showPreviewer: state.draftItem.get("showPreviewer"),
    formData: state.draftItem.get("formData")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    togglePreviewer: () => dispatch(togglePreviewer())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DepositPreviewer);

import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";

import View from "grommet/components/icons/base/View";

import ReactJson from "react-json-view";

import { togglePreviewer } from "../../../actions/draftItem";

import SectionHeader from "./SectionHeader";

class DepositPreviewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return this.props.showPreviewer ? (
      <Box flex={true} colorIndex="light-2">
        <SectionHeader
          label="Previewer"
          icon={<View onClick={() => this.props.togglePreviewer()} />}
        />
        <Box pad="small" flex={true}>
          <ReactJson src={this.props.formData} />
        </Box>
      </Box>
    ) : (
      <Box
        flex={false}
        pad="small"
        colorIndex="light-2"
        onClick={() => this.props.togglePreviewer()}
      >
        <View size="small" />
      </Box>
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

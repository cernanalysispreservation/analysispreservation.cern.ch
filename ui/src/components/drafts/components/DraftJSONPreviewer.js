import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box } from "grommet";

import View from "grommet/components/icons/base/View";

import ReactJson from "react-json-view";

import { togglePreviewer } from "../../../actions/drafts";

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
  data: PropTypes.object,
  togglePreviewer: PropTypes.func
};

function mapStateToProps(state) {
  return {
    showPreviewer: state.drafts.get("showPreviewer"),
    formData: state.drafts.getIn(["current_item", "formData"])
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

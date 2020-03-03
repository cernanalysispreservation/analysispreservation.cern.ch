import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import CloseIcon from "grommet/components/icons/base/Close";

import { updateGeneralTitle } from "../../../actions/draftItem";

class EditableTitle extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editTitle: false,
      hoverTitle: false,
      titleValue: ""
    };
  }

  _focusInput = () => {
    let { general_title } = this.props.metadata;
    this.setState({
      titleValue: general_title || "Untitled document",
      editTitle: true
    });
  };

  _hoverIn = () => {
    this.setState({ hoverTitle: true });
  };

  _hoverOut = () => {
    this.setState({ hoverTitle: false });
  };

  _onChange = e => {
    this.setState({ titleValue: e.target.value });
  };

  _update = () => {
    this.props
      .updateGeneralTitle(this.state.titleValue, this.props.anaType)
      .then(() => {
        this.setState({
          hoverTitle: false,
          editTitle: false
        });
      })
      .catch(() => {
        this.setState({ hoverTitle: false });
      });
  };

  _unedit = () => {
    this.setState({
      hoverTitle: false,
      editTitle: false
    });
  };

  render() {
    let { general_title } = this.props.metadata;
    return this.state.editTitle ? (
      <Box flex={true} direction="row" wrap={false} pad="none">
        <Label margin="none" direction="row">
          <input
            key="draft-input"
            style={{ padding: 0, border: "1px solid #136994", borderRadius: 0 }}
            onChange={this._onChange}
            value={this.state.titleValue}
          />
        </Label>
        <Box margin="none" direction="row" align="center">
          <Box
            pad={{ horizontal: "small" }}
            margin="none"
            onClick={this._update.bind(this)}
          >
            <CheckmarkIcon colorIndex="neutral-1" size="xsmall" />
          </Box>
          <Box margin="none" onClick={this._unedit.bind(this)}>
            <CloseIcon colorIndex="neutral-1" size="xsmall" />
          </Box>
        </Box>
      </Box>
    ) : (
      <Box flex={true} direction="row" wrap={false}>
        <Box
          key="draft-title"
          onMouseEnter={this._hoverIn}
          onMouseLeave={this._hoverOut}
          onClick={this.props.canUpdate ? this._focusInput : null}
          pad="none"
          style={{
            border:
              this.state.hoverTitle && this.props.canUpdate
                ? "1px solid #136994"
                : "1px solid transparent"
          }}
        >
          <Label align="start" pad="none" margin="none">
            {general_title || "Untitled document"}
          </Label>
        </Box>
      </Box>
    );
  }
}

EditableTitle.propTypes = {
  metadata: PropTypes.object,
  updateGeneralTitle: PropTypes.func,
  anaType: PropTypes.string,
  canUpdate: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    metadata: state.draftItem.get("metadata"),
    loading: state.draftItem.get("loading"),
    generalTitleLoading: state.draftItem.get("generalTitleLoading"),
    canUpdate: state.draftItem.get("can_update")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateGeneralTitle: (title, anaType) =>
      dispatch(updateGeneralTitle(title, anaType))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditableTitle);

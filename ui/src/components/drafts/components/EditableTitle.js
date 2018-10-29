import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import { Box, Label } from "grommet";

import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import CloseIcon from "grommet/components/icons/base/Close";

import { updateGeneralTitle } from "../../../actions/drafts";

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
    this.setState({
      titleValue: this.props.general_title || "Untitled document",
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
    return this.state.editTitle ? (
      <Box direction="row" wrap={false}>
        <Label margin="small" direction="row">
          <input
            key="draft-input"
            style={{ padding: 0, border: "1px solid #fff", borderRadius: 0 }}
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
            <CheckmarkIcon colorIndex="light-1" size="xsmall" />
          </Box>
          <Box
            pad={{ horizontal: "small" }}
            margin="none"
            onClick={this._unedit.bind(this)}
          >
            <CloseIcon colorIndex="light-1" size="xsmall" />
          </Box>
        </Box>
      </Box>
    ) : (
      <Box pad="small" direction="row" wrap={false}>
        <Box
          key="draft-title"
          onMouseEnter={this._hoverIn}
          onMouseLeave={this._hoverOut}
          onClick={this._focusInput}
          margin={{ right: "small" }}
          style={{
            border: this.state.hoverTitle
              ? "1px solid #fff"
              : "1px solid transparent",
            marginLeft: "-1px",
            paddingLeft: "5px"
          }}
        >
          <Label align="start" pad="none" margin="none">
            {" "}
            {this.props.general_title || "Untitled document"}
          </Label>
        </Box>
      </Box>
    );
  }
}

EditableTitle.propTypes = {
  general_title: PropTypes.string,
  updateGeneralTitle: PropTypes.func,
  anaType: PropTypes.string
};

function mapStateToProps(state) {
  return {
    general_title: state.drafts.getIn([
      "current_item",
      "general_title",
      "title"
    ])
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

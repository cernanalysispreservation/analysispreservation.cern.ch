import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Label from "grommet/components/Label";

import CheckmarkIcon from "grommet/components/icons/base/Checkmark";
import CloseIcon from "grommet/components/icons/base/Close";

import {AiOutlineEdit} from "react-icons/ai";

class EditableField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editTitle: false,
      hoverTitle: false,
      emptyValue: this.props.emptyValue || "no value",
      displayValue: this.props.defaultValue || "",
      value: this.props.value || ""
    };
  }

  _focusInput = () => {
    // let { general_title } = this.props.metadata;
    this.setState({
      // value: "general_title" || "---",
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
    this.setState({ value: e.target.value });
  };

  _update = () => {
    if (this.props.onUpdate) {
      this.props.onUpdate(this.state.value);
    }

    this.setState({
      displayValue: this.state.value,
      hoverTitle: false,
      editTitle: false
    });

    // Success
    // this.setState({
    //   hoverTitle: false,
    //   editTitle: false
    // });

    // Error
    // this.setState({ hoverTitle: false });
  };

  _unedit = () => {
    this.setState({
      hoverTitle: false,
      editTitle: false
    });
  };

  render() {
    return this.state.editTitle ? (
      <Box
        flex={true}
        direction="row"
        wrap={false}
        pad="none"
        responsive={false}
        className="jst-md-center"
      >
        <Label size={this.props.size || null} margin="none" direction="row">
          <input
            key="draft-input"
            style={{ padding: 0, border: "1px solid #136994", borderRadius: 0 }}
            onChange={this._onChange}
            value={this.state.value}
            autoFocus={true}
            onClick={e => e.stopPropagation()}
          />
        </Label>
        <Box margin="none" direction="row" align="center" responsive={false}>
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
          align="center"
          key="draft-title"
          direction="row"
          responsive={false}
          wrap={false}
          onMouseEnter={this._hoverIn}
          onMouseLeave={this._hoverOut}
          onClick={this._focusInput}
          pad={{ between: "small" }}
          style={{
            padding: "0 2px",
            border: this.state.hoverTitle
              ? "1px solid #136994"
              : "1px solid transparent"
          }}
        >
          <Box flex={true}>
            {this.props.renderDisplay ? (
              this.props.renderDisplay(this.state.value)
            ) : (
              <Label
                size={this.props.size || null}
                align="start"
                pad="none"
                margin="none"
              >
                {this.state.value ? this.state.value : this.state.emptyValue}
              </Label>
            )}
          </Box>
          <AiOutlineEdit size="10" />
        </Box>
      </Box>
    );
  }
}

EditableField.propTypes = {
  metadata: PropTypes.object,
  updateGeneralTitle: PropTypes.func,
  anaType: PropTypes.string,
  canUpdate: PropTypes.bool,
  renderDisplay: PropTypes.func,
  emptyValue: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onUpdate: PropTypes.func,
  size: PropTypes.string
};

export default EditableField;

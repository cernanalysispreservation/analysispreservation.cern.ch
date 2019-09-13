import React, { Component } from "react";
import PropTypes from "prop-types";

import Paragraph from "grommet/components/Paragraph";
import Box from "grommet/components/Box";
import AddIcon from "grommet/components/icons/base/FormAdd";
import MinusIcon from "grommet/components/icons/base/FormSubtract";

import DropDownList from "./DropDownList";

class DropDown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true
    };
  }

  togglePanel = () => {
    this.setState({ open: !this.state.open });
  };

  render() {
    return (
      <Box margin={{ vertical: "small" }}>
        <Box
          style={{ border: "1px solid black" }}
          size="large"
          onClick={this.togglePanel}
          flex={true}
          direction="row"
          align="center"
        >
          {this.state.open ? <MinusIcon /> : <AddIcon />}
          <Paragraph align="center">{this.props.title}</Paragraph>
        </Box>
        <DropDownList open={this.state.open} items={this.props.items} />
      </Box>
    );
  }
}

DropDown.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array
};

export default DropDown;

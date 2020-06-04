import React, { Component } from "react";
import { samples } from "../samples";
import PropTypes from "prop-types";
import { Box } from "grommet";

import { utils } from "../utils";

function shouldRender(comp, nextProps, nextState) {
  const { props, state } = comp;
  return (
    !utils.deepEquals(props, nextProps) || !utils.deepEquals(state, nextState)
  );
}

class Selector extends Component {
  constructor(props) {
    super(props);
    this.state = { current: "Simple" };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldRender(this, nextProps, nextState);
  }

  onLabelClick = label => {
    return event => {
      event.preventDefault();
      this.setState({ current: label });
      setImmediate(() => this.props.onSelected(samples[label]));
    };
  };

  render() {
    return (
      <Box direction="row" flex justify="between">
        {Object.keys(samples).map((label, i) => {
          return (
            <Box
              key={i}
              role="presentation"
              separator="all"
              pad="small"
              colorIndex={this.state.current === label ? "brand" : "light-1"}
              onClick={this.onLabelClick(label)}
            >
              {label}
            </Box>
          );
        })}
      </Box>
    );
  }
}

Selector.propTypes = {
  onSelected: PropTypes.func
};

export default Selector;

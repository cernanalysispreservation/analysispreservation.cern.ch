import React, { Component } from "react";
import { samples } from "../samples";
import PropTypes from "prop-types";

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
      <ul className="nav nav-pills">
        {Object.keys(samples).map((label, i) => {
          return (
            <li
              key={i}
              role="presentation"
              className={this.state.current === label ? "active" : ""}
            >
              <a href="#" onClick={this.onLabelClick(label)}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    );
  }
}

Selector.propTypes = {
  onSelected: PropTypes.func
};

export default Selector;

import React, { Component } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { Box, Heading, CheckBox } from "grommet";
import { Selector } from "./Selector";
import { Editor } from "./Editor";

function shouldRender(comp, nextProps, nextState) {
  const { props, state } = comp;

  return (
    !utils.deepEquals(props, nextProps) || !utils.deepEquals(state, nextState)
  );
}

const toJson = val => JSON.stringify(val, null, 2);
class Playground extends Component {
  render() {
    return (
      <Box colorIndex="brand">
        <h1>Hello React</h1>
      </Box>
    );
  }
}

export default Playground;

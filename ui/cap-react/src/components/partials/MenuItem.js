import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import styled from "styled-components";
import Anchor from "../partials/Anchor";

const Wrapper = styled(Box)`
  background: rgb(255, 255, 255);
  color: red;
  text-decoration: none;

  &:hover {
    background: rgb(235, 235, 235);
    cursor: pointer;
    text-decoration: none;
  }
`;

const MenuItem = ({ title }) => {
  return (
    <Wrapper colorIndex="light-1">
      <Anchor label={title} pad="small" href="#" path="/settings" />
    </Wrapper>
  );
};

MenuItem.propTypes = {};

export default MenuItem;

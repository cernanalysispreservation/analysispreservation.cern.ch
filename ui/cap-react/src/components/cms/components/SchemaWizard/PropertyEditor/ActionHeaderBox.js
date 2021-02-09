import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import styled, { css } from "styled-components";

import { AiOutlinePlus } from "react-icons/ai";

const Wrapper = styled(Box)`
  border: 1px solid #fff;
  border-radius: 3px;
  &:hover {
    background-color: #fff;
    border: 1px solid rgb(103, 103, 103);
    color: rgb(103, 103, 103);
  }
  ${({ type }) =>
    type === "delete" &&
    css`
      &:hover {
        background-color: rgba(179, 53, 52, 1);
        color: #fff;
      }
    `};
`;

const ActionHeaderBox = ({
  onClick = null,
  text = "add text",
  icon = <AiOutlinePlus size={25} />,
  type = "default"
}) => {
  return (
    <Wrapper align="center" onClick={onClick} pad="small" type={type}>
      {icon}
      <div>{text}</div>
    </Wrapper>
  );
};

ActionHeaderBox.propTypes = {
  onClick: PropTypes.func,
  text: PropTypes.string,
  icon: PropTypes.element,
  type: PropTypes.string
};

export default ActionHeaderBox;

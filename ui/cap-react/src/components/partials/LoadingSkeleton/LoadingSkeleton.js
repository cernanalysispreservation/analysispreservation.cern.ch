import React from "react";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

const loadingAnimation = keyframes`
0% {transform: translateX(0)}
100% {transform: translateX(230%)}
`;

const Loader = styled.div`
  background: #e6e6e6;
  position: relative;
  overflow: hidden;
  height: ${props => `${props.height}px`};
  width: ${props => `${props.width}%`};
  margin: ${props => props.margin};

  &:before {
    height: 100%;
    width: 30%;
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: linear-gradient(to right, #e5e5e5, #e6e6e6, #f1f1f1);
    animation: ${loadingAnimation} 1.5s infinite linear;
  }
`;

const LoadingSkeleton = ({ height = 10, width = 200, margin = "" }) => {
  return <Loader height={height} width={width} margin={margin} />;
};

LoadingSkeleton.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};

export default LoadingSkeleton;

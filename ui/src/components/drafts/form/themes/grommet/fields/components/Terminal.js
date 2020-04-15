import React from "react";
import PropTypes from "prop-types";
import SVGIcon from "grommet/components/SVGIcon";

export const TerminalIcon = ({ size = "small" }) => (
  <SVGIcon
    size={size}
    viewBox="0 0 492.308 492.308"
    version="1.1"
    type="logo"
    a11yTitle="Terminal"
  >
    <g>
      <g>
        <path d="M0,0.764v490.779h492.308V0.764H0z M472.615,471.851H19.692V20.457h452.923V471.851z" />
      </g>
    </g>
    <g>
      <g>
        <polygon points="92.019,246.534 78.096,260.457 152.769,335.13 78.096,409.803 92.019,423.726 180.615,335.13 		" />
      </g>
    </g>
    <g>
      <g>
        <rect x="166.695" y="406.942" width="120.044" height="19.692" />
      </g>
    </g>
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
    <g />
  </SVGIcon>
);

TerminalIcon.propTypes = {
  size: PropTypes.string
};

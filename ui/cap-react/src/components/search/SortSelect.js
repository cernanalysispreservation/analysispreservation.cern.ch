import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import Menu from "../partials/Menu";
import MenuItem from "../partials/MenuItem";

import { AiOutlineDown } from "react-icons/ai";

const SORT_OPTIONS = [
  { value: "mostrecent", label: "Most Recent" },
  { value: "bestmatch", label: "Best Match" }
];

const getValueFromLocation = (value = "mostrecent") => {
  const choices = {
    mostrecent: "Most Recent",
    bestmatch: "Best Match"
  };

  return choices[value];
};

const SortSelect = ({ locationSort, onChange }) => {
  return (
    <Box style={{ position: "relative" }}>
      <Menu
        top={35}
        left={1}
        right={null}
        shadow
        icon={<AiOutlineDown />}
        buttonProps={{
          text: getValueFromLocation(locationSort),
          icon: <AiOutlineDown />,
          reverse: true
        }}
      >
        {SORT_OPTIONS.map(item => (
          <MenuItem
            hovered
            key={item.value}
            title={item.label}
            separator
            onClick={() => onChange(item.value)}
          />
        ))}
      </Menu>
    </Box>
  );
};

SortSelect.propTypes = {
  onChange: PropTypes.func,
  locationSort: PropTypes.object
};

export default SortSelect;

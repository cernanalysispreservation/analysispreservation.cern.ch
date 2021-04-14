import React from "react";
import PropTypes from "prop-types";
import { Box } from "grommet";
import Menu from "../partials/Menu";
import MenuItem from "../partials/MenuItem";

import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

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

const SortSelect = ({ locationSort, onChange, dataCy = "" }) => {
  return (
    <Box style={{ position: "relative" }}>
      <Menu
        top={35}
        right={1}
        dataCy={dataCy}
        shadow
        icon={<AiOutlineDown />}
        buttonProps={{
          text: getValueFromLocation(locationSort),
          icon: <AiOutlineDown />,
          iconOpen: <AiOutlineUp />,
          reverse: true
        }}
      >
        {SORT_OPTIONS.map(item => (
          <MenuItem
            dataCy={`${dataCy}-${item.value}`}
            key={item.value}
            title={item.label}
            onClick={() => onChange(item.value)}
          />
        ))}
      </Menu>
    </Box>
  );
};

SortSelect.propTypes = {
  onChange: PropTypes.func,
  locationSort: PropTypes.object,
  dataCy: PropTypes.string
};

export default SortSelect;

import React from "react";
import PropTypes from "prop-types";

import MoreIcon from "grommet/components/icons/base/More";

import ReactTooltip from "react-tooltip";

import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";

function SectionBox(props) {
  let {
    headerActions,
    header = "",
    body,
    emptyMessage = null,
    more,
    className = ""
  } = props;

  return (
    <Box
      flex={false}
      margin={{ bottom: "medium" }}
      colorIndex="light-1"
      style={{ borderRadius: "3px" }}
    >
      <Box pad="none">
        <Box
          flex={false}
          direction="row"
          pad={{ vertical: "small" }}
          justify="between"
          responsive={false}
        >
          <Heading
            tag="h3"
            align="start"
            justify="center"
            margin="none"
            truncate={true}
            data-tip={emptyMessage}
          >
            {header}
          </Heading>
          <Box direction="row">{headerActions}</Box>
        </Box>
        <ReactTooltip />
      </Box>

      <Box
        colorIndex="light-1"
        flex={false}
        style={{ borderRadius: "3px" }}
        className={className}
        separator="all"
        pad="small"
      >
        {body}
      </Box>
      {more && (
        <Box flex={false} justify="center" align="center">
          <MoreIcon />
        </Box>
      )}
    </Box>
  );
}

SectionBox.propTypes = {
  header: PropTypes.string,
  more: PropTypes.string,
  body: PropTypes.node,
  headerActions: PropTypes.node,
  emptyMessage: PropTypes.string,
  history: PropTypes.object,
  className: PropTypes.string
};

export default SectionBox;

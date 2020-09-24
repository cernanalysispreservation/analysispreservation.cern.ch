import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Anchor from "../../../../../partials/Anchor";
import { AiOutlineLink } from "react-icons/ai";

class URLWidget extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Box
        style={{ overflow: "hidden", wordBreak: "break-all" }}
        size={{ width: "xxlarge" }}
        justify="center"
        flex={false}
        pad={{ horizontal: "medium" }}
        alignSelf="end"
        wrap={true}
      >
        {this.props.value ? (
          <Box direction="row" responsive={false} align="center">
            <Anchor href={this.props.value} target="_blank">
              <Box direction="row" align="center" responsive={false}>
                <AiOutlineLink />
                <Box style={{ marginLeft: "5px" }}>{this.props.value}</Box>
              </Box>
            </Anchor>
          </Box>
        ) : (
          <Box>-</Box>
        )}
      </Box>
    );
  }
}

URLWidget.propTypes = {
  value: PropTypes.string
};

export default URLWidget;

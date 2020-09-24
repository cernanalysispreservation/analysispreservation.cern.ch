import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

import Anchor from "../../../../../partials/Anchor";
import { AiOutlineMail } from "react-icons/ai";

class EmailWidget extends React.Component {
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
            <Anchor href={`mailto:${this.props.value}`}>
              <Box direction="row" align="center" responsive={false}>
                <AiOutlineMail />
                <Box margin="none" size="small" style={{ marginLeft: "5px" }}>
                  {this.props.value}
                </Box>
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

EmailWidget.propTypes = {
  value: PropTypes.string
};

export default EmailWidget;

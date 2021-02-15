import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";

import Button from "../../../partials/Button";

class SelectContentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recommended: [
        {
          schemaId: "cms-analysis",
          schemaVersion: "0.0.1"
        },
        {
          schemaId: "lhcb",
          schemaVersion: "0.0.1"
        },
        {
          schemaId: "alice-analysis",
          schemaVersion: "0.0.1"
        }
      ]
    };
  }

  render() {
    let that = this;

    return (
      <Box size="medium">
        <Header justify="center">
          <Heading tag="h3">Select a pre defined Schema</Heading>
        </Header>
        <Box colorIndex="light-1" pad={{ vertical: "small" }} align="center">
          <Box
            style={{
              display: "grid",
              gridTemplateColumns:
                this.props.contentTypes && this.props.contentTypes.size > 1
                  ? "repeat(2, 1fr)"
                  : "repeat(1, 1fr)",
              alignItems: "center",
              gridGap: "10px"
            }}
          >
            {this.props.contentTypes &&
              this.props.contentTypes.map(item => (
                <Button
                  size="small"
                  key={item.get("deposit_group")}
                  onClick={that.props.select.bind(
                    this,
                    item.get("deposit_group"),
                    "0.0.1"
                  )}
                  text={item.get("name")}
                  background="#e6e6e6"
                  hoverColor="#d9d9d9"
                />
              ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

SelectContentType.propTypes = {
  select: PropTypes.func,
  contentTypes: PropTypes.object
};

export default SelectContentType;

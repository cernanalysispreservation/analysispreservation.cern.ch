import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Paragraph from "grommet/components/Paragraph";
import Label from "grommet/components/Label";

import { connect } from "react-redux";
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

  componentDidMount() {
    this.props.getSchemas();
  }

  render() {
    let that = this;

    return (
      <Box size="large">
        <Header
          flex={true}
          colorIndex="neutral-1"
          pad="small"
          direction="column"
          wrap={true}
        >
          <Label flex="true" size="medium" margin="none">
            Your content types
          </Label>
          <Paragraph flex="true" size="small" align="center">
            Choose from one of the existing schemas
          </Paragraph>
        </Header>
        <Box colorIndex="light-2" pad={{ vertical: "small" }} align="center">
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
                  size="large"
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
  list: PropTypes.object,
  select: PropTypes.func,
  getSchemas: PropTypes.func,
  contentTypes: PropTypes.object
};

const mapStateToProps = state => ({
  contentTypes: state.auth.getIn(["currentUser", "depositGroups"])
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectContentType);

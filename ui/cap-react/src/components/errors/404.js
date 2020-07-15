import React from "react";
import Box from "grommet/components/Box";
import Heading from "grommet/components/Heading";
import Label from "grommet/components/Label";
import Button from "../partials/Button";
import { withRouter } from "react-router";
import PropTypes from "prop-types";

const NotFoundPage = ({ history }) => {
  return (
    <Box flex colorIndex="light-1" align="center" justify="center">
      <Box style={{ color: "#006A93" }}>
        <Box
          direction="row"
          align="center"
          responsive={false}
          pad="small"
          style={{ letterSpacing: "1px" }}
        >
          <Heading>404</Heading>
          <Box
            style={{
              height: "5px",
              width: "20px",
              background: "#006A93",
              margin: "0 20px"
            }}
          />
          <Heading>Page was not found</Heading>
        </Box>
        <Box margin={{ top: "medium" }} align="center">
          <Label style={{ textAlign: "center" }}>
            The page your are looking for, either was removed <br />or<br /> the
            url path is not correct
          </Label>
        </Box>
        <Box
          direction="row"
          responsive={false}
          justify="between"
          margin={{ top: "large" }}
          pad="medium"
        >
          <Button text="Previous" secondary onClick={() => history.goBack()} />
          <Button text="Home" primary onClick={() => history.push("/")} />
        </Box>
      </Box>
    </Box>
  );
};

NotFoundPage.propTypes = {
  history: PropTypes.object
};

export default withRouter(NotFoundPage);

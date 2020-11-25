import React from "react";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Heading from "grommet/components/Heading";

import CreateForm from "./createModelForm";
import PropTypes from "prop-types";

class Create extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size="medium">
        <Header justify="center">
          <Heading tag="h3">Create your own Schema</Heading>
        </Header>
        <CreateForm
          onSubmit={this.props.createContentType}
          schema={{ type: "string" }}
        />
      </Box>
    );
  }
}

Create.propTypes = {
  createContentType: PropTypes.func
};

export default Create;

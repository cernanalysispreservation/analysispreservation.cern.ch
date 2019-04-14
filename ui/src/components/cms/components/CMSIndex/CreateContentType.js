import React from "react";
// import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Paragraph from "grommet/components/Paragraph";
import Label from "grommet/components/Label";

import CreateForm from "./createModelForm";
import PropTypes from "prop-types";

class Create extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box size="large" colorIndex="brand">
        <Header pad="small" justify="center" wrap={true}>
          <Label size="medium" margin="none">
            Create a new content type
          </Label>
          <Paragraph size="small" align="center">
            Provide a name and a description for the content type you want to
            create. Give access to specific users and groups now, or do i t on a
            later stage from the <strong>Settings</strong> page
          </Paragraph>
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

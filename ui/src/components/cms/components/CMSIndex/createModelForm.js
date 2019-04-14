import React from "react";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";

import Form from "../../../drafts/form/GrommetForm";
import PropTypes from "prop-types";

const createContentTypeSchema = {
  title: "Create Content Type",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Name",
      description: "Provide a name for your type"
    },
    description: {
      type: "string",
      title: "Description",
      description: "Give a small description of the content type"
    }
  }
};

const createContentTypeUISchema = {
  description: { "ui:widget": "textarea" }
};

class Create extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box colorIndex="light-2" pad="medium">
        <Form
          schema={createContentTypeSchema}
          uiSchema={createContentTypeUISchema}
          onSubmit={this.props.onSubmit}
        >
          <Box
            pad="small"
            justify="between"
            align="center"
            direction="row"
            wrap={false}
          >
            <Button label="Cancel" onClick={this.props.cancel} />
            <Button label="Create" type="submit" primary={true} />
          </Box>
        </Form>
      </Box>
    );
  }
}

Create.propTypes = {
  cancel: PropTypes.func,
  onSubmit: PropTypes.func
};

export default Create;

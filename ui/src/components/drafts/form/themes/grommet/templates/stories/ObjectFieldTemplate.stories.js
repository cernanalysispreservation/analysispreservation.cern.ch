import React, { Component } from "react";
import { storiesOf } from "@storybook/react";

import Grommet from "grommet/components/Grommet";
import Box from "grommet/components/Box";

import ObjectFieldTemplate from "../ObjectFieldTemplate";
import PropTypes from "prop-types";

const accordion = {
  "ui:object": "accordionObjectField"
};

const layer = {
  "ui:object": "layerObjectField"
};

class ObjectFieldTemplateStorie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idSchema: {
        $id: "different"
      },
      properties: [
        {
          content:
            "Different content depends on the case, form fields, buttons, etc.."
        }
      ]
    };
  }

  render() {
    return (
      <Grommet>
        <Box align="center" flex={true} wrap={false}>
          <Box size={{ width: "xlarge" }} pad="large" flex={false} wrap={false}>
            <ObjectFieldTemplate
              idSchema={this.state.idSchema}
              properties={this.state.properties}
              uiSchema={this.props.uiSchema}
              title="Field Title"
              description="Field Description"
            />
          </Box>
        </Box>
      </Grommet>
    );
  }
}

ObjectFieldTemplateStorie.propTypes = {
  uiSchema: PropTypes.object
};

storiesOf("Object Field Template", module)
  .add("Layer", () => <ObjectFieldTemplateStorie uiSchema={layer} />)
  .add("Accordion", () => <ObjectFieldTemplateStorie uiSchema={accordion} />);

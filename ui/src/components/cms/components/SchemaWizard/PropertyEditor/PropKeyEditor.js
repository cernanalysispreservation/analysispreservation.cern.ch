import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import Button from "grommet/components/Button";
import Paragraph from "grommet/components/Paragraph";

import Form from "../../../../drafts/form/GrommetForm";

import { propKeySchema } from "../../utils/schemas";

class PropKeyEditor extends React.Component {
  _onFieldTypeSelect = type => {
    this.props.onFormSchemaChange({
      ...this.props.schema,
      ...type.default
    });
  };

  _onPropertyKeyChange = ({ formData }) => {
    if (this.props.type == "new")
      this.props.addProperty(this.props.path, formData);
    else this.props.addProperty(this.props.path, formData);
  };

  render() {
    return (
      <Box size="large" flex={false}>
        <Box flex={true} pad="small">
          {this.props.type == "new" && (
            <Box>
              <Paragraph>
                <strong>You are about to create a new field.</strong> To
                continue with adding and edting it is important to provide a
                "property key", that will represent the value on this content
                type
              </Paragraph>
            </Box>
          )}

          <Box>
            <Form
              schema={propKeySchema}
              formData={this.props.path.pop()}
              onSubmit={this._onPropertyKeyChange}
            >
              <Box colorIndex="grey-4" justify="end" align="end">
                <Button
                  primary={true}
                  plain={true}
                  type="submit"
                  align="center"
                  label={this.props.type == "new" ? "create" : "change"}
                />
              </Box>
            </Form>
          </Box>
        </Box>
      </Box>
    );
  }
}

PropKeyEditor.propTypes = {
  cancel: PropTypes.func,
  onFormSchemaChange: PropTypes.func,
  field: PropTypes.object,
  path: PropTypes.array
};

export default PropKeyEditor;

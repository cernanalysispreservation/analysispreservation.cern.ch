import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";

import PropertyEditor from "../../containers/PropertyEditor";
import SchemaPreview from "../../containers/SchemaPreview";
import FormPreview from "../../containers/FormPreview";

import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import SelectFieldType from "../../containers/SelectFieldType";

class SchemaWizard extends React.Component {
  componentDidMount() {
    let { schema_name, schema_version } = this.props.match.params;
    if (schema_name) this.props.getSchema(schema_name, schema_version);
  }

  render() {
    if (this.props.current) {
      return (
        <DndProvider backend={HTML5Backend}>
          <Box
            colorIndex="light-2"
            flex={true}
            direction="row"
            wrap={false}
            justify="between"
          >
            {this.props.field ? <PropertyEditor /> : <SelectFieldType />}
            <Box direction="row" wrap={false} flex={true}>
              <SchemaPreview />
              <Box flex={true}>
                <FormPreview />
              </Box>
            </Box>
          </Box>
        </DndProvider>
      );
    }
    return null;
  }
}

SchemaWizard.propTypes = {
  current: PropTypes.object,
  onFieldTypeSelect: PropTypes.func,
  field: PropTypes.object,
  getSchema: PropTypes.func,
  match: PropTypes.object
};

export default SchemaWizard;

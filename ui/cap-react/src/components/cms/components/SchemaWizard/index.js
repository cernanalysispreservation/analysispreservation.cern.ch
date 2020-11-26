import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import Spinning from "grommet/components/icons/Spinning";

import PropertyEditor from "../../containers/PropertyEditor";
import SchemaPreview from "../../containers/SchemaPreview";
import FormPreview from "../../containers/FormPreview";

import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import SelectFieldType from "../../containers/SelectFieldType";
import Anchor from "../../../partials/Anchor";

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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(8, 1fr)"
            }}
          >
            {this.props.field ? <PropertyEditor /> : <SelectFieldType />}

            <Box style={{ gridColumn: "3/5" }} flex>
              {this.props.loader ? (
                <Box flex align="center" justify="center">
                  <Spinning size="large" />
                </Box>
              ) : (
                <SchemaPreview />
              )}
            </Box>
            <Box flex style={{ gridColumn: "5/9" }}>
              {this.props.loader ? (
                <Box flex align="center" justify="center">
                  <Spinning size="large" />
                </Box>
              ) : (
                <FormPreview />
              )}
            </Box>

            {!this.props.selected &&
              !this.props.loader && (
                <Box align="center" justify="center" flex>
                  Your form is not created properly, please try again
                  <Anchor label="here" path="/cms" />
                </Box>
              )}
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
  match: PropTypes.object,
  selected: PropTypes.object,
  history: PropTypes.object,
  loader: PropTypes.bool
};

export default SchemaWizard;

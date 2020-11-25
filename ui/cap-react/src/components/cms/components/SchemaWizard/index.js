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
            {this.props.loader ? (
              <Box align="center" justify="center" flex>
                <Spinning size="large" />
              </Box>
            ) : (
              <Box direction="row" wrap={false} flex={true}>
                <SchemaPreview />
                <Box flex={true}>
                  <FormPreview />
                </Box>
              </Box>
            )}
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

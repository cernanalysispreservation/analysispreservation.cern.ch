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

class SchemaWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  render() {
    return (
      <DndProvider backend={HTML5Backend}>
        <Box
          colorIndex="light-2"
          flex={true}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(8, 1fr)"
          }}
          id="schema-wizard"
        >
          {this.props.field ? <PropertyEditor /> : <SelectFieldType />}
          {this.props.loader ? (
            <Box
              style={{ gridColumn: "3/9" }}
              flex
              align="center"
              justify="center"
            >
              <Spinning size="large" />
            </Box>
          ) : (
            <React.Fragment>
              <Box style={{ gridColumn: "3/5" }} flex>
                <SchemaPreview />
              </Box>
              <Box flex style={{ gridColumn: "5/9" }}>
                <FormPreview />
              </Box>
            </React.Fragment>
          )}
        </Box>
      </DndProvider>
    );
  }
}

SchemaWizard.propTypes = {
  field: PropTypes.object,
  loader: PropTypes.bool
};

export default SchemaWizard;

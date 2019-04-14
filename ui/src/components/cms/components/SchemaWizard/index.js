import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import Tab from "../../../partials/Tab";
// import Tab from "grommet/components/Tab";
import Tabs from "grommet/components/Tabs";

import ContentTypeDetails from "../../containers/ContentTypeDetails";
import PropertyEditor from "../../containers/PropertyEditor";
import SchemaPreview from "../../containers/SchemaPreview";
import FormPreview from "../../containers/FormPreview";
import SchemaTree from "../../containers/SchemaTree";

import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import SelectFieldType from "../../containers/SelectFieldType";
import { Header } from "grommet";

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
            <SchemaPreview />
            <FormPreview />
          </Box>
        </DndProvider>
      );
    }
    return null;
  }
}

SchemaWizard.propTypes = {
  current: PropTypes.object,
  onFieldTypeSelect: PropTypes.func
};

export default SchemaWizard;

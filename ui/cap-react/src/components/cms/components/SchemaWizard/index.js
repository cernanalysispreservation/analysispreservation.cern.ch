import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";
import Header from "grommet/components/Header";
import Spinning from "grommet/components/icons/Spinning";

import PropertyEditor from "../../containers/PropertyEditor";
import SchemaPreview from "../../containers/SchemaPreview";
import FormPreview from "../../containers/FormPreview";

import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import SelectFieldType from "../../containers/SelectFieldType";
import Anchor from "../../../partials/Anchor";
import EditableField from "../../../partials/EditableField";
import SettingsModal from "./SettingsModal";

import { AiOutlineSetting, AiOutlineArrowLeft } from "react-icons/ai";

class SchemaWizard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }
  componentDidMount() {
    let { schema_name, schema_version } = this.props.match.params;
    if (schema_name) this.props.getSchema(schema_name, schema_version);
  }

  render() {
    if (this.props.current) {
      return (
        <DndProvider backend={HTML5Backend}>
          <Header
            pad={{ vertical: "none", horizontal: "small" }}
            size="small"
            fixed
          >
            <Box
              justify="between"
              direction="row"
              align="center"
              flex
              responsive={false}
            >
              <Box direction="row" align="center" responsive={false}>
                <Box
                  margin={{ right: "small" }}
                  onClick={() => this.props.history.push("/cms")}
                >
                  <AiOutlineArrowLeft size={20} />
                </Box>
                {!this.props.loader && (
                  <EditableField
                    size="small"
                    value={this.props.schema.get("title")}
                    emptyValue="add title"
                    onUpdate={value =>
                      this.props.updateSchemaProps({ title: value })
                    }
                  />
                )}
              </Box>
              <Box
                onClick={() =>
                  this.setState({
                    showModal: true
                  })
                }
              >
                <AiOutlineSetting size={20} />
              </Box>
            </Box>
          </Header>
          <SettingsModal
            show={this.state.showModal}
            onClose={() =>
              this.setState({
                showModal: false
              })
            }
          />
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
  loader: PropTypes.bool,
  schema: PropTypes.object,
  updateSchemaProps: PropTypes.func
};

export default SchemaWizard;

import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "../../../../../partials/AccordionPanel";

import FieldHeader from "../components/FieldHeader";
import ErrorFieldIndicator from "./ErrorFieldIndicator";

class AccordionObjectField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerActive: false
    };

    this._onClick = this._onClick.bind(this);
  }

  _onClick() {
    this.setState({ layerActive: true });
  }

  render() {
    if (this.props.idSchema["$id"] == "root") {
      return <Box>{this.props.properties.map(prop => prop.content)}</Box>;
    } else {
      return (
        <ErrorFieldIndicator
          errors={this.props.formContext.ref}
          id={this.props.idSchema.$id}
        >
          <Accordion animate={false} openMulti={false}>
            <AccordionPanel
              heading={
                <FieldHeader
                  title={this.props.title}
                  required={this.props.required}
                  description={this.props.description}
                  descriptionStyle={{ marginLeft: "10px" }}
                  uiSchema={this.props.uiSchema}
                />
              }
            >
              <Box
                colorIndex="light-2"
                pad="medium"
                style={{
                  display:
                    this.props.uiSchema["ui:options"] &&
                    this.props.uiSchema["ui:options"].display
                      ? this.props.uiSchema["ui:options"].display
                      : "grid",
                  gridTemplateColumns:
                    this.props.uiSchema["ui:options"] &&
                    this.props.uiSchema["ui:options"].display &&
                    this.props.uiSchema["ui:options"].display === "grid"
                      ? "repeat(4,1fr)"
                      : null
                }}
              >
                {this.props.properties.map(prop => prop.content)}
              </Box>
            </AccordionPanel>
          </Accordion>
        </ErrorFieldIndicator>
      );
    }
  }
}

AccordionObjectField.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  required: PropTypes.bool,
  idSchema: PropTypes.object,
  uiSchema: PropTypes.object,
  properties: PropTypes.array,
  formContext: PropTypes.object
};

export default AccordionObjectField;

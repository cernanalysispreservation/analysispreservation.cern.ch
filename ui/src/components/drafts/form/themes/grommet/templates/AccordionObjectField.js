import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "grommet/components/AccordionPanel";

import FieldHeader from "../components/FieldHeader";

class AccordionObjectField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      layerActive: false,
      display: "flex"
    };

    this._onClick = this._onClick.bind(this);
  }
  componentDidMount() {
    if (this.props.uiSchema["ui:options"]) {
      this.setState({
        display: this.props.uiSchema["ui:options"].display || "flex"
      });
    }
  }
  _onClick() {
    this.setState({ layerActive: true });
  }

  render() {
    if (this.props.idSchema["$id"] == "root") {
      return <Box>{this.props.properties.map(prop => prop.content)}</Box>;
    } else {
      return (
        <Accordion animate={false} openMulti={false}>
          <AccordionPanel
            heading={
              <FieldHeader
                title={this.props.title}
                required={this.props.required}
                description={this.props.description}
              />
            }
          >
            <Box
              pad="medium"
              colorIndex="light-2"
              style={{
                display: this.state.display,
                gridTemplateColumns:
                  this.state.display === "grid" ? "50% 50%" : null
              }}
            >
              {this.props.properties.map(prop => prop.content)}
            </Box>
          </AccordionPanel>
        </Accordion>
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
  properties: PropTypes.array
};

export default AccordionObjectField;

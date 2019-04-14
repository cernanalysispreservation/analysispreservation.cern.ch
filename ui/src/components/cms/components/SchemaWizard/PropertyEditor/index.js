import React from "react";

import Box from "grommet/components/Box";

import { PropTypes } from "prop-types";
import CustomizeField from "../../../containers/CustomizeField";
import Header from "grommet/components/Header";
import Accordion from "grommet/components/Accordion";
import AccordionPanel from "../../../../partials/AccordionPanel";

import SelectFieldType from "../../../containers/SelectFieldType";
import PropKeyEditor from "./PropKeyEditor";
import PropKeyView from "./PropKeyView";
import AddIcon from "grommet/components/icons/base/FormAdd";
import { Heading } from "grommet";

const renderPath = path => {
  let prev;
  let content;
  let result = [];
  console.log(path);

  path &&
    path.map(item => {
      if (result.length == 0) {
        if (item == "properties") content = "{ } #";
        else if (item == "items") content = "[ ] #";
      } else {
        if (item == "properties") {
          content = `{ } ${prev || ""}`;
          prev = null;
        } else if (item == "items") {
          content = `[ ] ${prev || ""}`;
          prev = null;
        } else prev = item;
      }

      if (!prev)
        result.push(
          <div
            style={{
              border: "1px solid #fff",
              borderRadius: "2px",
              float: "left",
              padding: "3px 10px",
              marginRight: "5px"
            }}
          >
            <span>{content}</span>
          </div>
        );
    });

  if (prev)
    result.push(
      <div
        style={{
          border: "1px solid #fff",
          borderRadius: "2px",
          float: "left",
          backgroundColor: "#006996",
          padding: "3px 10px",
          marginRight: "5px"
        }}
      >
        <span>{prev}</span>
      </div>
    );
  return result;
};

class PropertyEditor extends React.Component {
  render() {
    return (
      <Box size="medium" pad="medium" flex={false} colorIndex="grey-2">
        <Box margin={{ bottom: "large" }}>
          <Box
            direction="row"
            wrap={false}
            align="center"
            onClick={this.props.enableCreateMode}
          >
            <AddIcon />
            <div>add new</div>
          </Box>
        </Box>
        <Box margin={{ bottom: "large" }}>
          <Box wrap={false}>
            <Heading tag="h4">Selected field</Heading>
            <div>{renderPath(this.props.path.getIn(["path"]).toJS())}</div>
          </Box>
        </Box>
        <Box flex={true}>
          <CustomizeField
            path={this.props.path}
            cancel={this.props.cancel}
            key="customize"
          />
        </Box>
      </Box>
    );
  }
}

PropertyEditor.propTypes = {
  cancel: PropTypes.func,
  onFormSchemaChange: PropTypes.func,
  enableCreateMode: PropTypes.func,
  // field: PropTypes.object,
  path: PropTypes.array
};

export default PropertyEditor;

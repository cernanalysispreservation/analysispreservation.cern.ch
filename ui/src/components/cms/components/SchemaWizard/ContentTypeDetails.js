import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";

import PropKeyEditor from "./PropertyEditor/PropKeyEditor";
import PropKeyView from "./PropertyEditor/PropKeyView";

class ContentTypeDetails extends React.Component {
  render() {
    return (
      <Box size="medium" pad="small" flex={false}>
        {this.props.propKeyEditor ? (
          <PropKeyEditor
            addProperty={this.props.addProperty}
            path={this.props.propKeyEditor.get("path")}
            type={this.props.propKeyEditor.get("type")}
          />
        ) : (
          <PropKeyView path={this.props.path} propKey={this.props.path.pop()} />
        )}
      </Box>
    );
  }
}

ContentTypeDetails.propTypes = {
  cancel: PropTypes.func,
  onFormSchemaChange: PropTypes.func,
  field: PropTypes.object,
  path: PropTypes.array
};

export default ContentTypeDetails;

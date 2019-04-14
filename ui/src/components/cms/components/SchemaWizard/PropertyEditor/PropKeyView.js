import React from "react";
import { PropTypes } from "prop-types";

import Box from "grommet/components/Box";

import FormEditIcon from "grommet/components/icons/base/FormEdit";

class PropKeyView extends React.Component {
  render() {
    return (
      <Box pad="small" colorIndex="light-1" separator="all" direction="row">
        <Box pad="small" flex={true}>
          <span>
            Property Key:{" "}
            <strong>{this.props.propKey || "*****missing*****"}</strong>
          </span>
          <span>
            Base Path: <strong>{this.props.path}</strong>
          </span>
        </Box>
        <Box pad="small">
          <FormEditIcon
            onClick={() => {
              this.setState({ editEnabled: true });
            }}
          />
        </Box>
      </Box>
    );
  }
}

PropKeyView.propTypes = {
  cancel: PropTypes.func,
  onFormSchemaChange: PropTypes.func,
  field: PropTypes.object,
  path: PropTypes.array
};

export default PropKeyView;

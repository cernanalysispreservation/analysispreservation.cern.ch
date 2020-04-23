import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";

class ImportDataField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box style={{ overflow: "hidden" }} justify="center" flex={true}>
        {this.props.formData || ""}
      </Box>
    );
  }
}

ImportDataField.propTypes = {
  formData: PropTypes.object
};

export default ImportDataField;

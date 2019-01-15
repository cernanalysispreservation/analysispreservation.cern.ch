import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import Anchor from "grommet/components/Anchor";
import Box from "grommet/components/Box";

import Edit from "grommet/components/icons/base/FormEdit";
import { toggleFilemanagerLayer } from "../../../../../../actions/drafts";

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

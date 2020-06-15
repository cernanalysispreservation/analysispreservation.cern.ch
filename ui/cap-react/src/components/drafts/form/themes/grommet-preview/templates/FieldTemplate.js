import React from "react";
import PropTypes from "prop-types";

import Box from "grommet/components/Box";
import FieldHeader from "../components/FieldHeader";
import { connect } from "react-redux";
import { updatePreviewFieldsArray } from "../../../../../../actions/draftItem";

let FieldTemplate = function(props) {
  const { label, children } = props;

  if (["array", "object"].indexOf(props.schema.type) > -1) {
    return <span>{children}</span>;
  }
  let ch = children.filter(item => item !== undefined);
  ch.map(item => {
    props.updateFields({
      id: item.props.idSchema.$id,
      name: item.props.name,
      content: item.props.formData
    });
  });
  return children.props && children.props.formData === undefined ? null : (
    <Box flex={true} direction="row">
      {label ? (
        <Box flex={true}>
          <FieldHeader title={label} />
        </Box>
      ) : null}
      <Box flex={true}>{children}</Box>
    </Box>
  );
};

FieldTemplate.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOf([PropTypes.array, PropTypes.element]),
  schema: PropTypes.object,
  updateFields: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  updateFields: item => dispatch(updatePreviewFieldsArray(item))
});

export default connect(
  null,
  mapDispatchToProps
)(FieldTemplate);

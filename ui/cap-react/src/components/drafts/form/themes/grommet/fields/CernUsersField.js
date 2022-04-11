import React from "react";
import PropTypes from "prop-types";
import DepositAccess from "../../../../components/DepositAccess";
import { Box } from "grommet";
import { AiOutlineDelete } from "react-icons/ai";

const CernUsersField = ({ onChange, formData }) => {
  return formData ? (
    <Box pad={{ horizontal: "medium" }} justify="between" direction="row">
      {formData}
      <AiOutlineDelete size={18} onClick={() => onChange(undefined)} />
    </Box>
  ) : (
    <DepositAccess displayAsFormField updateField={onChange} />
  );
};

CernUsersField.propTypes = {
  onChange: PropTypes.func,
  formData: PropTypes.object
};

export default CernUsersField;

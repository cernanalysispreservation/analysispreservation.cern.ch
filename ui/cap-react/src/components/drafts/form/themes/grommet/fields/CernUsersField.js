import React from "react";
import PropTypes from "prop-types";
import DepositAccess from "../../../../components/DepositAccess";
import { Box } from "grommet";
import { AiOutlineDelete } from "react-icons/ai";

const CernUsersField = ({ onChange, formData, uiSchema }) => {
  const autoOpenModal =
    uiSchema["ui:options"] && uiSchema["ui:options"].autoOpenModal;

  let isFormDataEmpty = formData ? Object.keys(formData).length === 0 : true;
  return !isFormDataEmpty ? (
    <Box pad={{ horizontal: "medium" }} flex={true} justify="between" direction="row">
      {formData.name} - {formData.email} - {formData.department}
      {
        autoOpenModal ? null : <AiOutlineDelete size={18} onClick={() => onChange(undefined)} />
      }
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

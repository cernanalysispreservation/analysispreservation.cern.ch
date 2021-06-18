import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CleanForm from "../../../CleanForm";
import { schema } from "../../../../../cms/components/Notifications/NotificationWizard/NewNotification/utils/schemas";

const ContextField = ({ formData = [], onChange = null }) => {
  const [methodData, setMethodData] = useState({
    formData: formData.filter(item => item.method)
  });
  const [manualData, setManualData] = useState({
    formData: formData.filter(item => !item.method)
  });

  useEffect(
    () => {
      let combined = [...methodData.formData.map(i => (i.method ? i : {method: i})), ...manualData.formData];
      onChange(combined);
    },
    [methodData, manualData]
  );

  return (
    <div>
      <CleanForm
        schema={schema.definitions.method}
        onChange={setMethodData}
        formData={methodData.formData.map(i => (i.method ? i.method : i))}
      >
        <span />
      </CleanForm>

      <CleanForm
        schema={schema.definitions.params}
        onChange={setManualData}
        formData={manualData.formData}
        liveValidate
        uiSchema={{
          "ui:array": "default",
          items: {
            "ui:options": {
              stringify: ["path", "name"]
            }
          }
        }}
      >
        <span />
      </CleanForm>
    </div>
  );
};

ContextField.propTypes = {
  onChange: PropTypes.func,
  formData: PropTypes.array
};

export default ContextField;

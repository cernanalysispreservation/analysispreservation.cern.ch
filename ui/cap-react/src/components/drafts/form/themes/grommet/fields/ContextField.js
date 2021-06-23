import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import CleanForm from "../../../CleanForm";

const schemaForMethods = {
  type: "array",
  title: "Methods",
  uniqueItems: true,
  items: {
    type: "string",
    enum: [
      "published_id",
      "draft_id",
      "revision",
      "draft_revision",
      "draft_url",
      "published_url",
      "working_url",
      "submitter_url",
      "reviewer_url",
      "cms_stats_committee_by_pag"
    ]
  }
};

const schemaForManuallValues = {
  type: "array",
  title: "Manually param",
  items: {
    type: "object",
    title: "Context Parameter",
    properties: {
      name: {
        type: "string",
        title: "Name"
      },
      path: {
        type: "string",
        title: "Path"
      }
    }
  }
};

const ContextField = ({ formData = [], onChange = null }) => {
  const [methodData, setMethodData] = useState({
    formData: formData.filter(item => typeof item === "string")
  });
  const [manualData, setManualData] = useState({
    formData: formData.filter(item => typeof item === "object")
  });

  useEffect(
    () => {
      let combined = [...methodData.formData, ...manualData.formData];
      onChange(combined);
    },
    [methodData, manualData]
  );

  return (
    <div>
      <CleanForm
        schema={schemaForMethods}
        onChange={setMethodData}
        formData={methodData.formData}
      >
        <span />
      </CleanForm>

      <CleanForm
        schema={schemaForManuallValues}
        onChange={setManualData}
        formData={manualData.formData}
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

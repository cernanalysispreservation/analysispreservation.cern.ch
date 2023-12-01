import { commonFields, extraFields } from "react-formule";

import { FileOutlined } from "@ant-design/icons";
import CernUsers from "./customFields/CernUsers";
import CapFiles from "./customFields/CapFiles";
import SchemaPathSuggester from "./customFields/SchemaPathSuggester";

export const customFieldTypes = {
  advanced: {
    CapFiles: {
      title: "File upload",
      icon: <FileOutlined />,
      description: "Upload Files",
      child: {},
      optionsSchema: {
        type: "object",
        title: "File upload widget",
        properties: {
          ...commonFields.optionsSchema,
          readOnly: extraFields.optionsSchema.readOnly,
          isRequired: extraFields.optionsSchema.isRequired,
        },
      },
      optionsSchemaUiSchema: {
        readOnly: extraFields.optionsSchemaUiSchema.readOnly,
        isRequired: extraFields.optionsSchemaUiSchema.isRequired,
      },
      optionsUiSchema: {
        ...commonFields.optionsUiSchema,
      },
      optionsUiSchemaUiSchema: {
        ...commonFields.optionsUiSchemaUiSchema,
      },
      default: {
        schema: {
          type: "string",
        },
        uiSchema: {
          "ui:field": "CapFiles",
        },
      },
    },
  },
};

export const customFields = {
  cernUsers: CernUsers,
  CapFiles: CapFiles,
  schemaPathSuggester: SchemaPathSuggester,
};

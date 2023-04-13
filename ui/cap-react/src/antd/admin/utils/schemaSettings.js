export const commonSchema = {
  type: "object",
  title: "General Info",
  properties: {
    name: {
      title: "Field/property name",
      description: "Should be a string without spaces or other special chars",
      type: "string",
    },
    path: {
      title: "Path",
      description:
        "The title of the form field. How it will be displayed on the rendered form.",
      type: "string",
    },
  },
};

export const propKeySchema = {
  title: "Property Key",
  description: "Should be a string without spaces or other special chars",
  type: "string",
};

export const schemaSchema = {
  type: "object",
  title: "JSON Schema attributes",
  properties: {
    type: {
      title: "Property Type",
      type: "string",
      enum: ["string", "object", "array", "number", "boolean"],
    },
    title: {
      title: "Title",
      type: "string",
    },
    description: {
      title: "Description",
      type: "string",
    },
    placeholder: {
      title: "Placeholder",
      type: "string",
    },
    format: {
      title: "Format/Widget",
      type: "string",
    },
  },
};

export const uiSchema = {
  type: {
    "ui:options": {
      hidden: true,
    },
  },
};

export const configSchema = {
  schema: {
    title: "Schema Settings",
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Schema ID",
        description: "Unique ID of the schema",
      },
      version: {
        type: "string",
        title: "Version",
        pattern: "^([0-9]+)\\.([0-9]+)\\.([0-9]+)$",
      },
      fullname: {
        type: "string",
        title: "Fullname",
        description: "It will be used to display the schema on the UI",
      },
      experiment: {
        type: "string",
        title: "Experiment",
        enum: ["CMS", "LHCb", "ATLAS", "ALICE"],
      },
      is_indexed: {
        type: "boolean",
        title: "Should be visible and indexed?",
      },
      use_deposit_as_record: {
        type: "boolean",
        title: "Use same schema for deposit and record?",
      },
    },
  },
  uiSchema: {
    "ui:order": [
      "name",
      "version",
      "fullname",
      "experiment",
      "is_indexed",
      "use_deposit_as_record",
      "*",
    ],
    version: {
      "ui:options": {
        disableRegex: true,
      },
    },
  },
};

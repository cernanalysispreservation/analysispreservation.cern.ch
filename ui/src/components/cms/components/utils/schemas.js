export const commonSchema = {
  type: "object",
  title: "General Info",
  properties: {
    name: {
      title: "Field/property name",
      description: "Should be a string without spaces or other special chars",
      type: "string"
    },
    path: {
      title: "Path",
      description:
        "The title of the form field. How it will be displayed on the rendered form.",
      type: "string"
    }
  }
};

export const propKeySchema = {
  title: "Property Key",
  description: "Should be a string without spaces or other special chars",
  type: "string"
};

export const schemaSchema = {
  type: "object",
  title: "JSON Schema attributes",
  properties: {
    type: {
      title: "Property Type",
      type: "string",
      enum: ["string", "object", "array", "number", "boolean"]
    },
    title: {
      title: "Title",
      description:
        "The title of the form field. How it will be displayed on the rendered form.",
      type: "string"
    },
    description: {
      title: "Description",
      description:
        "The title of the form field. How it will be displayed on the rendered form.",
      type: "string"
    },
    placeholder: {
      title: "Placeholder",
      description:
        "The title of the form field. How it will be displayed on the rendered form.",
      type: "string"
    },
    format: {
      title: "Format/Widget",
      description:
        "The title of the form field. How it will be displayed on the rendered form.",
      type: "string"
    }
  }
};

export const uiSchema = {};

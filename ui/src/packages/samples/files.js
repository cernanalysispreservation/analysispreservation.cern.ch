module.exports = {
  schema: {
    title: "Files",
    type: "object",
    properties: {
      filesAccept: {
        type: "string",
        format: "data-url",
        title: "Single File with Accept attribute"
      }
    }
  },
  uiSchema: {
    filesAccept: {
      "ui:field": "CapFiles",
      "ui:options": { accept: ".pdf" }
    }
  },
  formData: {}
};

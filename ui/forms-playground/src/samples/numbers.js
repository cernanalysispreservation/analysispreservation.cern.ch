module.exports = {
  schema: {
    type: "object",
    title: "Number fields & widgets",
    properties: {
      number: {
        title: "Number",
        type: "number"
      },
      integer: {
        title: "Integer",
        type: "integer"
      },
      numberEnum: {
        type: "number",
        title: "Number enum",
        enum: [1, 2, 3]
      },
      numberEnumRadio: {
        type: "number",
        title: "Number enum",
        enum: [1, 2, 3]
      }
    }
  },
  uiSchema: {
    integer: {
      "ui:widget": "updown"
    },
    numberEnumRadio: {
      "ui:widget": "radio",
      "ui:options": {
        inline: true
      }
    }
  },
  formData: {
    number: 3.14,
    integer: 42,
    numberEnum: 2
  }
};

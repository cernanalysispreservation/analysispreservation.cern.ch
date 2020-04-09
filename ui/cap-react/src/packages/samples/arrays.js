module.exports = {
  schema: {
    definitions: {
      Thing: {
        type: "object",
        properties: {
          name: {
            type: "string",
            default: "Default name"
          }
        }
      }
    },
    type: "object",
    properties: {
      listOfStrings: {
        type: "array",
        title: "Default Array Field",
        items: {
          type: "string",
          default: "bazinga"
        }
      },

      fixedItemsList: {
        type: "array",
        title: "Accordion Array Field",
        items: [
          {
            title: "A string value",
            type: "string",
            default: "lorem ipsum"
          },
          {
            title: "a boolean value",
            type: "boolean"
          }
        ],
        additionalItems: {
          title: "Additional item",
          type: "number"
        }
      },

      nestedList: {
        type: "array",
        title: "Layer Array Field",
        items: {
          type: "array",
          title: "Inner list",
          items: {
            type: "string",
            default: "lorem ipsum"
          }
        }
      },
      unorderable: {
        title: "String Array Field",
        type: "array",
        items: {
          type: "string",
          default: "lorem ipsum"
        }
      }
    }
  },
  uiSchema: {
    listOfStrings: {
      items: { "ui:emptyValue": "" }
    },
    nestedList: {
      "ui:array": "LayerArrayField"
    },
    fixedItemsList: {
      "ui:array": "AccordionArrayField",
      items: [{ "ui:widget": "textarea" }, { "ui:widget": "select" }],
      additionalItems: {
        "ui:widget": "updown"
      }
    },
    unorderable: {
      "ui:array": "StringArrayField",
      "ui:options": {
        orderable: false
      }
    }
  },
  formData: {
    listOfStrings: ["foo", "bar"],
    multipleChoicesList: ["foo", "bar"],
    fixedItemsList: ["Some text", true, 123],
    nestedList: [["lorem", "ipsum"], ["dolor"]],
    unorderable: ["one", "two"],
    unremovable: ["one", "two"],
    noToolbar: ["one", "two"],
    fixedNoToolbar: [42, true, "additional item one", "additional item two"]
  }
};

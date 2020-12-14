const simple = {
  string: {
    title: "Text",
    description: "Titles, names, paragraphs, IDs, list of names",
    child: {},
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {}
    }
  },
  number: {
    title: "Number",
    description: "IDs, order number, rating, quantity",
    child: {},
    default: {
      schema: {
        type: "number"
      },
      uiSchema: {}
    }
  },
  radio: {
    title: "Radio Widget",
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "Radio Widget UI Options",
      properties: {
        "ui:readonly": {
          type: "string",
          enum: [true, false],
          title: "Readonly"
        },
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {}
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "Radio Widget Title",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "The title of the form field. How it will be displayed on the rendered form."
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "The title of the form field. How it will be displayed on the rendered form."
        },
        enum: {
          title: "Define your options",
          type: "array",
          description: "The options for the radio widget",
          items: {
            title: "Radio Option",
            type: "string"
          }
        }
      }
    },
    default: {
      schema: {
        type: "string",
        enum: ["Option A", "Option B"]
      },
      uiSchema: {
        "ui:widget": "radio"
      }
    }
  },
  checkboxes: {
    title: "Checkbox Widget",
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "Radio Widget UI Options",
      properties: {
        "ui:readonly": {
          type: "string",
          enum: [true, false],
          title: "Readonly"
        },
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {}
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "Checkboxes Widget Title",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "The title of the form field. How it will be displayed on the rendered form."
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "The title of the form field. How it will be displayed on the rendered form."
        },
        type: {
          title: "Type of the checkbox",
          enum: ["boolean", "string"],
          enumNames: ["One Option", "Multiple Options"],
          type: "string"
        },
        enum: {
          title: "Define your options",
          type: "array",
          description: "The options for the widget",
          items: {
            title: "Option",
            type: "string"
          }
        }
      }
    },
    default: {
      schema: {
        type: "boolean",
        enum: ["Option A", "Option B"]
      },
      uiSchema: {
        "ui:widget": "checkboxes"
      }
    }
  },
  textarea: {
    title: "Text Area",
    description: "Text Area field",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "Text Area Options Schema",
      properties: {
        "ui:readonly": {
          type: "string",
          enum: [true, false],
          title: "Readonly"
        },
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            rows: {
              title: "Rows",
              description: "The number of the textarea rows",
              type: "number"
            },
            maxLength: {
              title: "Max Length",
              description:
                "Provide a number as the maximum limit of characters, infinity if not provided",
              type: "number"
            },
            minLength: {
              title: "Min Length",
              description:
                "Provide a number as the minimum limit of charactes, empty if not provded",
              type: "number"
            },
            placeholder: {
              title: "Placeholder",
              description: "Provide a placeholder for the field",
              type: "string"
            }
          }
        }
      }
    },
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:widget": "textarea"
      }
    }
  },
  object: {
    title: "JSON Object",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {}
    }
  },
  reference: {
    title: "Reference",
    description: "For example, an analysis can reference its author(s)",
    child: {},
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {}
    }
  },
  boolean: {
    title: "Boolean",
    description: "Yes or no, 1 or 0, true or false",
    child: {},
    default: {
      schema: {
        type: "boolean"
      },
      uiSchema: {}
    }
  },
  array: {
    title: "Array",
    description:
      "A list of things. List of strings, numbers, objects, references",
    child: {},
    default: {
      schema: {
        type: "array",
        items: {}
      },
      uiSchema: {}
    }
  }
};

const advanced = {
  accordion: {
    title: "Accordion Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:object": "accordionObjectField"
      }
    }
  },
  tabfield: {
    title: "Tab Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:object": "tabView"
      }
    }
  },
  layer: {
    title: "Layer/Modal Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:object": "layerObjectField"
      }
    }
  },
  switch: {
    title: "Switch",
    description: "Yes or no, 1 or 0, true or false",
    child: {},
    default: {
      schema: {
        type: "boolean"
      },
      uiSchema: {
        "ui:widget": "switch"
      }
    }
  },
  zenodo: {
    title: "Zenodo Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:servicesList": [
          {
            value: "zenodo",
            label: "ZENODO"
          }
        ],
        "ui:field": "idFetcher"
      }
    }
  },
  orcid: {
    title: "ORCiD Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:servicesList": [
          {
            value: "orcid",
            label: "ORCID"
          }
        ],
        "ui:field": "idFetcher"
      }
    }
  },
  getterId: {
    title: "Id Getter Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:servicesList": [
          {
            value: "orcid",
            label: "ORCID"
          },
          {
            value: "ror",
            label: "ROR"
          },
          {
            value: "zenodo",
            label: "ZENODO"
          }
        ],
        "ui:field": "idFetcher"
      }
    }
  },
  ror: {
    title: "ROR Field",
    description: "Data in JSON format, Grouped section",
    child: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:servicesList": [
          {
            value: "ror",
            label: "ROR"
          }
        ],
        "ui:field": "idFetcher"
      }
    }
  },
  tags: {
    title: "Tags Field",
    description: "Add keywords, tags, etc",
    child: {},
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:widget": "tags"
      }
    }
  }
};

const fields = {
  advanced: {
    title: "Advanced Fields",
    description: "",
    fields: advanced
  },
  simple: {
    title: "Simple Fields",
    description: "",
    fields: simple
  }
};

export default fields;

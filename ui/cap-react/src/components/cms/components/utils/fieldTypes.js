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

import React from "react";
import Box from "grommet/components/Box";
import {
  BsType,
  BsCheckBox,
  BsToggleOff,
  BsListOl,
  BsCircle,
  BsBraces,
  BsLayoutSidebar,
  BsSquareHalf,
  BsGrid,
  BsHash,
  BsTag
} from "react-icons/bs";
import {
  AiOutlineCloudDownload,
  AiOutlineBorderTop,
  AiOutlineFile,
  AiOutlineContainer,
  AiOutlineBook
} from "react-icons/ai";

const simple = {
  text: {
    title: "Text",
    icon: <BsType size={16} />,
    description: "Titles, names, paragraphs, IDs, list of names",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Text Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your text field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your text field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        },
        pattern: {
          title:
            "Provide a regex for your input, only when you want a strivt format",
          description:
            "In order to be active, you have to split your regex into parts in the Field Layout info",
          type: "string",
          pattern: "^^[w]*$$"
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      },
      pattern: {
        "ui:options": {
          masked_array: [
            {
              fixed: "^",
              placeholder: "^"
            },
            {
              regexp: "^.*$",
              placeholder: "XXXX"
            },
            { fixed: "$", placeholder: "$" }
          ]
        }
      }
    },
    optionsUiSchema: {
      type: "object",
      title: "Switch Widget UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            },
            suggestions: {
              type: "string",
              title: "Add a suggestion URL endpoint",
              description: "Provide an URL endpoint, to fetch data from there"
            },
            masked_array: {
              type: "array",
              title: "Add step-by-step validation for your pattern",
              description:
                "Split the regex into parts, and you will have real time validation for each part while writting",
              items: {
                type: "object",
                title: "Regex parts",
                description:
                  "Your input can be either a fixed a value or you can provide a regex expression",
                oneOf: [
                  {
                    title: "Fixed input",
                    properties: {
                      fixed: {
                        type: "string",
                        title: "Provide the fixed input",
                        description:
                          "This input is required only when you want to define a fixed value"
                      }
                    }
                  },
                  {
                    title: "Regex Input",
                    properties: {
                      regexp: {
                        type: "string",
                        title: "Provide the regexp of this part",
                        pattern: "^^[w]*$$"
                      },
                      length: {
                        type: "integer",
                        title: "Provide the max length",
                        description: "This is the max length of this input part"
                      },
                      placeholder: {
                        type: "string",
                        title: "Placeholder",
                        description: "Give a placeholder for your input "
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:widget": "text",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  CapFiles: {
    title: "File Upload",
    icon: <AiOutlineFile size={16} />,
    description: "Upload Files",
    child: {},
    optionsSchema: {
      type: "object",
      title: "File upload widget",
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
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:field": "CapFiles"
      }
    }
  },
  number: {
    title: "Float or Integer",
    icon: <BsHash size={16} />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Number Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your number field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your number field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "number"
      },
      uiSchema: {
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  integer: {
    title: "Integer",
    icon: <BsHash size={16} />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Integer Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your integer field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your integer field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "integer"
      },
      uiSchema: {
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  select: {
    title: "Select Widget",
    icon: <BsGrid size={16} />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },

    optionsSchema: {
      type: "object",
      title: "Select Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your select field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your select field"
        },
        type: {
          title: "Type",
          type: "string",
          enum: ["string", "number", "array"],
          enumNames: [
            "Select one value (text)",
            "Select one value (number)",
            "Select multiple values"
          ]
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      },
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["string"]
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
            {
              properties: {
                type: {
                  enum: ["number"]
                },
                enum: {
                  title: "Define your options",
                  type: "array",
                  description: "The options for the widget",
                  items: {
                    title: "Option",
                    type: "number"
                  }
                }
              }
            },
            {
              properties: {
                type: {
                  enum: ["array"]
                },
                items: {
                  type: "object",
                  title: "Define your options",
                  properties: {
                    enum: {
                      title: "Options List",
                      type: "array",
                      items: { type: "string", title: "Option" }
                    }
                  }
                }
              }
            }
          ]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    default: {
      schema: {
        enum: ["Option A", "Option B", "Option C"],
        type: "string",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["Option A", "Option B", "Option C", "Option D"]
        }
      },
      uiSchema: {
        "ui:widget": "select",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  radio: {
    title: "Radio Widget",
    icon: <BsCircle size={16} />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "Radio Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your radio field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your radio field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
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
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    default: {
      schema: {
        type: "string",
        enum: ["Option A", "Option B"]
      },
      uiSchema: {
        "ui:widget": "radio",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  switch: {
    title: "Switch Widget",
    icon: <BsToggleOff size={16} />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            },
            falseToUndefined: {
              type: "boolean",
              title: "Do you want to return undefined instead of false?",
              description:
                "In some cases the returned value is preferred to be undefined than false"
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "Switch Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your switch field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your switch field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        },
        type: {
          type: "string",
          title: "The type of the returned value",
          description: "Define the type of the returned value",
          enum: ["boolean", "string", "number"],
          enumNames: ["Boolean", "String", "Number"]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    default: {
      schema: {
        type: "boolean"
      },
      uiSchema: {
        "ui:widget": "switch",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  checkboxes: {
    title: "Checkbox Widget",
    icon: <BsCheckBox size={16} />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "Checkbox Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your checkbox field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your checkbox field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        },
        type: {
          title: "Type of the checkbox",
          enum: ["boolean", "string"],
          enumNames: ["One Option", "Multiple Options"],
          type: "string"
        }
      },
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["boolean"]
                }
              }
            },
            {
              properties: {
                type: {
                  enum: ["string"]
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
            }
          ]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    default: {
      schema: {
        type: "boolean",
        enum: ["Option A", "Option B"]
      },
      uiSchema: {
        "ui:widget": "checkboxes",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  richeditor: {
    title: "Rich Editor",
    icon: <AiOutlineBook size={16} />,
    description: "Rich Editor Field",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "Rich Editor Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your rich editor field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your rich editor field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      }
    },
    optionsSchemaUiSchema: {},
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:widget": "richeditor",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  textarea: {
    title: "Text Area",
    icon: <AiOutlineContainer size={16} />,
    description: "Text Area field",
    child: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            },
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
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    optionsSchema: {
      type: "object",
      title: "TextArea Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your textarea field"
        },
        description: {
          title: "Description",
          type: "string",
          description:
            "Provide the description you want to be displayed to your textarea field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:widget": "textarea",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  object: {
    title: "JSON Object",
    icon: <BsBraces size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Object Schema",
      properties: {
        title: {
          type: "string",
          title: "Title",
          description:
            "Provide the title you want to be displayed to your object"
        },
        description: {
          type: "string",
          title: "Description",
          description:
            "Provide the description you want to be displayed to your object"
        }
      }
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              description: "Select the inline position of the field",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            },
            hidden: {
              type: "boolean",
              title: "Do you want this field to be hidden?",
              description: "If yes, this field will not be visible in the form"
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    optionsSchemaUiSchema: {},
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  // reference: {
  //   title: "Reference",
  //   description: "For example, an analysis can reference its author(s)",
  //   child: {},
  //   default: {
  //     schema: {
  //       type: "string"
  //     },
  //     uiSchema: {
  //       "ui:options": {
  //         grid: {
  //           gridColumns: "1/5"
  //         }
  //       }
  //     }
  //   }
  // },
  boolean: {
    title: "Boolean",
    icon: <Box>1|0</Box>,
    description: "Yes or no, 1 or 0, true or false",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Boolean Schema ",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the element",
          description:
            "Provide the title you want to be displayed to your boolean field"
        },
        description: {
          type: "string",
          title: "Provide a desctiption for the element",
          description:
            "Provide the description you want to be displayed to your boolean field"
        },
        readOnly: {
          type: "boolean",
          title: "Do you want this field to be read only?",
          enum: [true, false],
          enumNames: ["ReadOnly", "Editable"]
        }
      }
    },
    optionsSchemaUiSchema: {
      readOnly: {
        "ui:widget": "select"
      }
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "boolean"
      },
      uiSchema: {
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  array: {
    title: "Array",
    icon: <BsListOl size={16} />,
    description:
      "A list of things. List of strings, numbers, objects, references",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Array Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for your array",
          description:
            "Provide the title you want to be displayed to your array"
        },
        description: {
          title: "Provide a descritpion for the element",
          type: "string",
          description:
            "Provide the description you want to be displayed to your array"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "array",
        items: {}
      },
      uiSchema: {
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  }
};

const advanced = {
  accordionObjectField: {
    title: "Accordion Field",
    icon: <AiOutlineBorderTop size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Accordion Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the Accordion Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Accordrion Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Radio Widget UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:object": "accordionObjectField",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  tabView: {
    title: "Tab Field",
    icon: <BsLayoutSidebar size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Tab Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the Tab Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Tab Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Radio Widget UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
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
  layerObjectField: {
    title: "Layer Field",
    icon: <BsSquareHalf size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Layer Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the Layer Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Layer Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Radio Widget UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
    default: {
      schema: {
        type: "object",
        properties: {}
      },
      uiSchema: {
        "ui:object": "layerObjectField",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  // switch: {
  //   title: "Switch",
  //   description: "Yes or no, 1 or 0, true or false",
  //   child: {},
  //   default: {
  //     schema: {
  //       type: "boolean"
  //     },
  //     uiSchema: {
  //       "ui:widget": "switch"
  //     }
  //   }
  // },
  zenodo: {
    title: "Zenodo Field",
    icon: <AiOutlineCloudDownload size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Zenodo Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the Zenodo Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Zenodo Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Zenodo UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
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
        "ui:field": "idFetcher",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  orcid: {
    title: "ORCiD Field",
    icon: <AiOutlineCloudDownload size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Orcid Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the Orcid Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Orcid Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Orcid UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
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
        "ui:field": "idFetcher",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  idFetcher: {
    title: "Id Getter Field",
    icon: <AiOutlineCloudDownload size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "ID Fetcher Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the IdFetcher Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Accordrion Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Radio Widget UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
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
        "ui:field": "idFetcher",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  ror: {
    title: "ROR Field",
    icon: <AiOutlineCloudDownload size={16} />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Ror Field Schema",
      properties: {
        title: {
          type: "string",
          title: "Provide a title for the Ror Field",
          description: "This title will be used later in the form"
        },
        description: {
          type: "string",
          title: "Provide a description for the Ror Field",
          description: "This description will be used later in the form"
        }
      }
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "Ror UI Options",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            grid: {
              type: "object",
              title: "Grid Options",
              properties: {
                gridColumns: {
                  title: "Grid Columns",
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    optionsUiSchemaUiSchema: {
      "ui:options": {
        grid: {
          gridColumns: {
            "ui:widget": "selectColumns"
          }
        }
      }
    },
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
        "ui:field": "idFetcher",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
      }
    }
  },
  tags: {
    title: "Tags Field",
    icon: <BsTag size={16} />,
    description: "Add keywords, tags, etc",
    child: {},
    optionsSchema: {
      title: "Tags Schema",
      type: "object",
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
        pattern: {
          type: "string",
          title: "Pattern",
          description: "Provide a regex expression for your pattern"
        },
        delimeter: {
          type: "string",
          descritpion: "Provide a delimeter for your input",
          title: "Delimeter"
        }
      }
    },
    optionsUiSchema: {
      type: "object",
      properties: {}
    },
    default: {
      schema: {
        type: "string"
      },
      uiSchema: {
        "ui:widget": "tags",
        "ui:options": {
          grid: {
            gridColumns: "1/5"
          }
        }
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

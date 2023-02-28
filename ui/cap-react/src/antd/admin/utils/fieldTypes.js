import React from "react";

import {
  AimOutlined,
  AppstoreOutlined,
  BookOutlined,
  BorderHorizontalOutlined,
  BorderTopOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  CloudDownloadOutlined,
  ContainerOutlined,
  FileOutlined,
  FontSizeOutlined,
  LayoutOutlined,
  LinkOutlined,
  NumberOutlined,
  SwapOutlined,
  TagOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";

// COMMON / EXTRA PROPERTIES:

const common = {
  optionsSchema: {
    title: {
      type: "string",
      title: "Title",
      description:
        "Provide the title that you want to be displayed for your field",
    },
    description: {
      title: "Description",
      type: "string",
      description:
        "Provide the description that you want to be displayed for your field",
    },
  },
  optionsUiSchema: {
    type: "object",
    title: "UI Schema",
    properties: {
      "ui:options": {
        type: "object",
        title: "UI Options",
        properties: {
          span: {
            title: "Field Width",
            type: "integer",
            defaultValue: 24,
            values: [6, 8, 12, 16, 18, 24],
            labels: ["25%", "33%", "50%", "66%", "75%", "100%"],
          },
        },
      },
    },
  },
  optionsUiSchemaUiSchema: {
    "ui:options": {
      span: {
        "ui:widget": "slider",
      },
    },
  },
};

const extra = {
  optionsSchema: {
    readOnly: {
      type: "boolean",
      title: "Do you want this field to be read only?",
      enum: [true, false],
      enumNames: ["ReadOnly", "Editable"],
    },
  },
  optionsSchemaUiSchema: {
    readOnly: {
      "ui:widget": "switch",
    },
  },
};

// FIELDS:

const simple = {
  text: {
    title: "Text",
    icon: <FontSizeOutlined />,
    description: "Titles, names, paragraphs, IDs, list of names",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Text Schema",
      properties: {
        ...common.optionsSchema,
        pattern: {
          title:
            "Provide a regex for your input, only when you want a strict format",
          description:
            "In order to be active, you have to split your regex into parts in the Field Layout info",
          type: "string",
          pattern: "^^[w]*$$",
        },
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      pattern: {
        "ui:options": {
          masked_array: [
            {
              fixed: "^",
              placeholder: "^",
            },
            {
              regexp: "^.*$",
              placeholder: "XXXX",
            },
            { fixed: "$", placeholder: "$" },
          ],
        },
      },
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            suggestions: {
              type: "string",
              title: "Add a suggestion URL endpoint",
              description: "Provide an URL endpoint, to fetch data from there",
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
                          "This input is required only when you want to define a fixed value",
                      },
                    },
                  },
                  {
                    title: "Regex Input",
                    properties: {
                      regexp: {
                        type: "string",
                        title: "Provide the regexp of this part",
                        pattern: "^^[w]*$$",
                      },
                      length: {
                        type: "integer",
                        title: "Provide the max length",
                        description:
                          "This is the max length of this input part",
                      },
                      placeholder: {
                        type: "string",
                        title: "Placeholder",
                        description: "Give a placeholder for your input ",
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "text",
      },
    },
  },
  uri: {
    title: "Uri text",
    icon: <LinkOutlined />,
    description: "Add uri text",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Uri Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            suggestions: {
              type: "string",
              title: "Add a suggestion URL endpoint",
              description: "Provide an URL endpoint, to fetch data from there",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
        format: "uri",
      },
    },
  },
  date: {
    title: "Date",
    icon: <CalendarOutlined />,
    description: "Date",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Date Schema",
      properties: {
        ...common.optionsSchema,
        format: {
          type: "string",
          title: "Type",
          enum: ["date", "date-time"],
          default: "date",
        },
        customFormat: {
          type: "string",
          title: "Format",
          description:
            "Define the date format ([help](https://devhints.io/datetime#momentjs-format)). Remember to include the time in the format if you have selected `date-time` as a type",
        },
        minDate: {
          type: "string",
          title: "Minimum date allowed",
        },
        maxDate: {
          type: "string",
          title: "Maximum date allowed",
        },
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      customFormat: {
        "ui:placeholder": "DD/MM/YYYY",
        "ui:options": {
          descriptionIsMarkdown: true,
        },
      },
      minDate: {
        "ui:widget": "date",
      },
      maxDate: {
        "ui:widget": "date",
      },
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "date",
      },
    },
  },
  CapFiles: {
    title: "File Upload",
    icon: <FileOutlined />,
    description: "Upload Files",
    child: {},
    optionsSchema: {
      type: "object",
      title: "File upload widget",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
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
  number: {
    title: "Float or Integer",
    icon: <NumberOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Number Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "number",
      },
      uiSchema: {},
    },
  },
  integer: {
    title: "Integer",
    icon: <NumberOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Integer Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "integer",
      },
      uiSchema: {},
    },
  },
  select: {
    title: "Select Widget",
    icon: <AppstoreOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },

    optionsSchema: {
      type: "object",
      title: "Select Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type",
          type: "string",
          enum: ["string", "number", "array"],
          enumNames: [
            "Select one value (text)",
            "Select one value (number)",
            "Select multiple values",
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
      },
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["string"],
                },
                enum: {
                  title: "Define your options",
                  type: "array",
                  description: "The options for the widget",
                  items: {
                    title: "Option",
                    type: "string",
                  },
                },
              },
            },
            {
              properties: {
                type: {
                  enum: ["number"],
                },
                enum: {
                  title: "Define your options",
                  type: "array",
                  description: "The options for the widget",
                  items: {
                    title: "Option",
                    type: "number",
                  },
                },
              },
            },
            {
              properties: {
                type: {
                  enum: ["array"],
                },
                items: {
                  type: "object",
                  title: "Define your options",
                  properties: {
                    enum: {
                      title: "Options List",
                      type: "array",
                      items: { type: "string", title: "Option" },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    default: {
      schema: {
        enum: ["Option A", "Option B", "Option C"],
        type: "string",
        uniqueItems: true,
        items: {
          type: "string",
          enum: ["Option A", "Option B", "Option C", "Option D"],
        },
      },
      uiSchema: {
        "ui:widget": "select",
      },
    },
  },
  radio: {
    title: "Radio Widget",
    icon: <AimOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    optionsSchema: {
      type: "object",
      title: "Radio Schema",
      properties: {
        ...common.optionsSchema,
        enum: {
          title: "Define your options",
          type: "array",
          description: "The options for the radio widget",
          items: {
            title: "Radio Option",
            type: "string",
          },
        },
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    default: {
      schema: {
        type: "string",
        enum: ["Option A", "Option B"],
      },
      uiSchema: {
        "ui:widget": "radio",
      },
    },
  },
  switch: {
    title: "Switch Widget",
    icon: <SwapOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Switch Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          type: "string",
          title: "The type of the returned value",
          description: "Define the type of the returned value",
          enum: ["boolean", "string", "number"],
          enumNames: ["Boolean", "String", "Number"],
        },
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            falseToUndefined: {
              type: "boolean",
              title: "Do you want to return undefined instead of false?",
              description:
                "In some cases the returned value is preferred to be undefined than false",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "boolean",
      },
      uiSchema: {
        "ui:widget": "switch",
      },
    },
  },
  checkbox: {
    title: "Checkbox Widget",
    icon: <CheckSquareOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    optionsSchema: {
      type: "object",
      title: "Checkbox Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type",
          enum: ["boolean", "array"],
          enumNames: ["One Option", "Multiple Options"],
          type: "string",
        },
        readOnly: extra.optionsSchema.readOnly,
      },
      dependencies: {
        type: {
          oneOf: [
            {
              properties: {
                type: {
                  enum: ["boolean"],
                },
                checkedValue: {
                  title: "Returned value when checked",
                  description: "Default: true",
                  type: "string",
                },
                uncheckedValue: {
                  title: "Returned value when unchecked",
                  description: "Default: false",
                  type: "string",
                },
              },
            },
            {
              properties: {
                type: {
                  enum: ["array"],
                },
                items: {
                  title: "Define your options",
                  type: "object",
                  description: "The options for the widget",
                  properties: {
                    enum: {
                      title: "Options List",
                      type: "array",
                      items: {
                        title: "Option",
                        type: "string",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    default: {
      schema: {
        type: "boolean",
        items: {
          type: "string",
          enum: ["Option A", "Option B"],
        },
        uniqueItems: true,
      },
      uiSchema: {
        "ui:widget": "checkbox",
      },
    },
  },
  richeditor: {
    title: "Rich Editor",
    icon: <BookOutlined />,
    description: "Rich Editor Field",
    child: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    optionsSchema: {
      type: "object",
      title: "Rich Editor Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {},
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "richeditor",
      },
    },
  },
  textarea: {
    title: "Text Area",
    icon: <ContainerOutlined />,
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
            ...common.optionsUiSchema.properties["ui:options"].properties,
            rows: {
              title: "Rows",
              description: "The number of the textarea rows",
              type: "number",
            },
            maxLength: {
              title: "Max Length",
              description:
                "Provide a number as the maximum limit of characters, infinity if not provided",
              type: "number",
            },
            minLength: {
              title: "Min Length",
              description:
                "Provide a number as the minimum limit of charactes, empty if not provded",
              type: "number",
            },
            placeholder: {
              title: "Placeholder",
              description: "Provide a placeholder for the field",
              type: "string",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    optionsSchema: {
      type: "object",
      title: "TextArea Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
    },
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "textarea",
      },
    },
  },
  object: {
    title: "JSON Object",
    icon: <div>&#123;&#32;&#125;</div>,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Object Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        "ui:options": {
          type: "object",
          title: "UI Options",
          properties: {
            ...common.optionsUiSchema.properties["ui:options"].properties,
            hidden: {
              type: "boolean",
              title: "Do you want this field to be hidden?",
              description: "If yes, this field will not be visible in the form",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    optionsSchemaUiSchema: {},
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {},
    },
  },
  array: {
    title: "Array",
    icon: <UnorderedListOutlined />,
    description:
      "A list of things. List of strings, numbers, objects, references",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Array Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "array",
        items: {},
      },
      uiSchema: {},
    },
  },
};

const advanced = {
  accordionObjectField: {
    title: "Accordion Field",
    icon: <BorderTopOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Accordion Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "accordionObjectField",
      },
    },
  },
  tabView: {
    title: "Tab Field",
    icon: <LayoutOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Tab Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "tabView",
      },
    },
  },
  layerObjectField: {
    title: "Layer Field",
    icon: <BorderHorizontalOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Layer Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:object": "layerObjectField",
      },
    },
  },
  zenodo: {
    title: "Zenodo Field",
    icon: <CloudDownloadOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Zenodo Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:servicesList": ["zenodo"],
        "ui:field": "idFetcher",
      },
    },
  },
  orcid: {
    title: "ORCiD Field",
    icon: <CloudDownloadOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Orcid Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:servicesList": ["orcid"],
        "ui:field": "idFetcher",
      },
    },
  },
  idFetcher: {
    title: "Id Fetcher Field",
    icon: <CloudDownloadOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "ID Fetcher Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      type: "object",
      title: "UI Schema",
      properties: {
        ...common.optionsUiSchema.properties,
        "ui:servicesList": {
          title: "Select the services you want to allow",
          type: "array",
          items: {
            type: "string",
            enum: ["orcid", "ror", "zenodo"],
          },
          uniqueItems: "true",
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:servicesList": {
        "ui:widget": "checkboxes",
      },
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:servicesList": ["orcid", "ror", "zenodo"],
        "ui:field": "idFetcher",
      },
    },
  },
  ror: {
    title: "ROR Field",
    icon: <CloudDownloadOutlined />,
    description: "Data in JSON format, Grouped section",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Ror Field Schema",
      properties: {
        ...common.optionsSchema,
      },
    },
    optionsSchemaUiSchema: {},
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {
        "ui:servicesList": ["ror"],
        "ui:field": "idFetcher",
      },
    },
  },
  tags: {
    title: "Tags Field",
    icon: <TagOutlined />,
    description: "Add keywords, tags, etc",
    child: {},
    optionsSchema: {
      title: "Tags Schema",
      type: "object",
      properties: {
        ...common.optionsSchema,
        tagPattern: {
          type: "string",
          title: "Pattern",
          description: "Provide a regex expression for your pattern",
        },
        tagPatternErrorMessage: {
          type: "string",
          title: "Pattern error message",
          description:
            "Provide a message to display when the input does not match the pattern",
        },
      },
    },
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
    },
    default: {
      schema: {
        type: "array",
        items: {
          type: "string",
        },
      },
      uiSchema: {
        "ui:field": "tags",
      },
    },
  },
};

const fields = {
  advanced: {
    title: "Advanced Fields",
    description: "",
    fields: advanced,
  },
  simple: {
    title: "Simple Fields",
    description: "",
    fields: simple,
  },
};

export default fields;

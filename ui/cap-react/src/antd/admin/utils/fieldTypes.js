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
      description: "Provide a title to be displayed in your field",
    },
    description: {
      title: "Description",
      type: "string",
      description: "Provide a description to be displayed in your field",
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
    },
  },
  optionsSchemaUiSchema: {
    readOnly: {
      "ui:widget": "switch",
    },
  },
};

// FIELDS:

const collections = {
  object: {
    title: "Object",
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
    optionsSchemaUiSchema: {},
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
    default: {
      schema: {
        type: "object",
        properties: {},
      },
      uiSchema: {},
    },
  },
  array: {
    title: "List",
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
  accordionObjectField: {
    title: "Accordion",
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
    title: "Tab",
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
    title: "Layer",
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
};

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
          title: "Validation regex",
          description:
            "The input will be validated against this regex on form submission",
          type: "string",
          pattern: "^^[w]*$$",
        },
        readOnly: extra.optionsSchema.readOnly,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      pattern: {
        "ui:placeholder": "^.*$",
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
            convertToUppercase: {
              type: "boolean",
              title: "Convert input to uppercase",
            },
            mask: {
              type: "string",
              title: "Input mask",
              description:
                "Add a mask to visualize and limit the format of the input. Use the following format: `0` (number), `a` (lowercase letter), `A` (uppercase letter), `*` (letter or number). You can escape all these with `\\`. The rest of the characters will be treated as constants",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        mask: {
          "ui:placeholder": "BN-000/aa",
          "ui:options": {
            descriptionIsMarkdown: true,
          },
        },
      },
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
  textarea: {
    title: "Text area",
    icon: <ContainerOutlined />,
    description: "Text Area field",
    child: {},
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
    default: {
      schema: {
        type: "string",
      },
      uiSchema: {
        "ui:widget": "textarea",
      },
    },
  },
  number: {
    title: "Number",
    icon: <NumberOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Number Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type of the number",
          type: "string",
          oneOf: [
            { const: "integer", title: "Integer" },
            { const: "number", title: "Float" },
          ],
        },
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
  checkbox: {
    title: "Checkbox",
    icon: <CheckSquareOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Checkbox Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type",
          type: "string",
          oneOf: [
            { const: "boolean", title: "One Option" },
            { const: "array", title: "Multiple Options" },
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
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
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
  switch: {
    title: "Switch",
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
          oneOf: [
            { const: "boolean", title: "Boolean" },
            { const: "string", title: "String" },
            { const: "number", title: "Number" },
          ],
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
  radio: {
    title: "Radio",
    icon: <AimOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
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
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
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
  select: {
    title: "Select",
    icon: <AppstoreOutlined />,
    description: "IDs, order number, rating, quantity",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Select Schema",
      properties: {
        ...common.optionsSchema,
        type: {
          title: "Type",
          type: "string",
          oneOf: [
            { const: "string", title: "Select one value (text)" },
            { const: "number", title: "Select one value (number)" },
            { const: "array", title: "Select multiple values" },
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
    optionsUiSchema: {
      ...common.optionsUiSchema,
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
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
            "Define the date format ([help](https://day.js.org/docs/en/display/format#list-of-all-available-formats)). Remember to include the time in the format if you have selected `date-time` as type",
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
};

const advanced = {
  uri: {
    title: "URI",
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
  richeditor: {
    title: "Rich editor",
    icon: <BookOutlined />,
    description: "Rich Editor Field",
    child: {},
    optionsSchema: {
      type: "object",
      title: "Rich Editor Schema",
      properties: {
        ...common.optionsSchema,
        readOnly: extra.optionsSchema.readOnly,
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
        type: "string",
      },
      uiSchema: {
        "ui:widget": "richeditor",
      },
    },
  },
  idFetcher: {
    title: "ID fetcher",
    icon: <CloudDownloadOutlined />,
    description: "Fetch data from ZENODO, ORCiD or ROR",
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
            oneOf: [
              { const: "orcid", title: "ORCiD" },
              { const: "ror", title: "ROR" },
              { const: "zenodo", title: "Zenodo" },
            ],
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
  tags: {
    title: "Tags",
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
          description: "Provide a regex for your pattern",
        },
        tagPatternErrorMessage: {
          type: "string",
          title: "Pattern error message",
          description:
            "Provide a message to display when the input does not match the pattern",
        },
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
        items: {
          type: "string",
        },
      },
      uiSchema: {
        "ui:field": "tags",
      },
    },
  },
  CapFiles: {
    title: "File upload",
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
};

// HIDDEN FIELDS (not directly selectable by the user):

export const hiddenFields = {
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
        type: {
          title: "Type of the number",
          type: "string",
          oneOf: [
            { const: "integer", title: "Integer" },
            { const: "number", title: "Float" },
          ],
        },
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
};

const fields = {
  collections: {
    title: "Collections",
    description: "",
    fields: collections,
  },
  simple: {
    title: "Fields",
    description: "",
    fields: simple,
  },
  advanced: {
    title: "Advanced fields",
    description: "",
    fields: advanced,
  },
};

export default fields;

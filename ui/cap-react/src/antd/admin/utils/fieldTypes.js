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
    },
    description: {
      title: "Description",
      type: "string",
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
    tooltip: { title: "Tooltip", type: "string" },
    readOnly: {
      type: "boolean",
      title: "Read-only",
    },
    isRequired: {
      title: "Required",
      type: "boolean",
    },
  },
  optionsSchemaUiSchema: {
    readOnly: {
      "ui:widget": "switch",
    },
    isRequired: {
      "ui:widget": "required",
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
              tooltip: "If enabled, this field will not be visible in the form",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        hidden: {
          "ui:widget": "switch",
        },
      },
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
        tooltip: extra.optionsSchema.tooltip,
        pattern: {
          title: "Validation regex",
          tooltip:
            "The input will be validated against this regex on form submission",
          type: "string",
          format: "regex",
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,

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
              tooltip: "Provide an URL endpoint to fetch data from",
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
        convertToUppercase: { "ui:widget": "switch" },
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
        tooltip: extra.optionsSchema.tooltip,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
              title: "Number of rows",
              description: "Default: 4",
              type: "number",
            },
            maxLength: {
              title: "Max characters",
              type: "number",
            },
            minLength: {
              title: "Min characters",
              type: "number",
            },
            placeholder: {
              title: "Placeholder",
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
        tooltip: extra.optionsSchema.tooltip,
        type: {
          title: "Type of the number",
          type: "string",
          oneOf: [
            { const: "integer", title: "Integer" },
            { const: "number", title: "Float" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
        type: {
          title: "Type",
          type: "string",
          oneOf: [
            { const: "boolean", title: "One Option" },
            { const: "array", title: "Multiple Options" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
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
                  title: "Options",
                  type: "object",
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
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
        type: {
          type: "string",
          title: "Type of the returned value",
          oneOf: [
            { const: "boolean", title: "Boolean" },
            { const: "string", title: "String" },
            { const: "number", title: "Number" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
              title: "Return undefined instead of false",
              tooltip:
                "In some cases the returned value can be preferred to be undefined",
            },
          },
        },
      },
    },
    optionsUiSchemaUiSchema: {
      ...common.optionsUiSchemaUiSchema,
      "ui:options": {
        ...common.optionsUiSchemaUiSchema["ui:options"],
        falseToUndefined: {
          "ui:widget": "switch",
        },
      },
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
        tooltip: extra.optionsSchema.tooltip,
        enum: {
          title: "Options",
          type: "array",
          items: {
            title: "Radio Option",
            type: "string",
          },
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
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
        isRequired: extra.optionsSchema.isRequired,
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
                  title: "Options",
                  type: "array",
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
                  title: "Options",
                  type: "array",
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
                  title: "Options",
                  type: "object",
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
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
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
        isRequired: extra.optionsSchema.isRequired,
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
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
              tooltip: "Provide a URL endpoint to fetch data from",
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
        tooltip: extra.optionsSchema.tooltip,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
    },
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
        "ui:widget": "checkbox",
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
        tooltip: extra.optionsSchema.tooltip,
        tagPattern: {
          type: "string",
          title: "Pattern",
          tooltip: "Only tags matching this regex will be allowed",
        },
        tagPatternErrorMessage: {
          type: "string",
          title: "Pattern error message",
          tooltip:
            "Message to display when the input does not match the pattern",
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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
        tooltip: extra.optionsSchema.tooltip,
        type: {
          title: "Type of the number",
          type: "string",
          oneOf: [
            { const: "integer", title: "Integer" },
            { const: "number", title: "Float" },
          ],
        },
        readOnly: extra.optionsSchema.readOnly,
        isRequired: extra.optionsSchema.isRequired,
      },
    },
    optionsSchemaUiSchema: {
      readOnly: extra.optionsSchemaUiSchema.readOnly,
      isRequired: extra.optionsSchemaUiSchema.isRequired,
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

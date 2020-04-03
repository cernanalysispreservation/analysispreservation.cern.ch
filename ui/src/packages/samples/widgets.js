import React from "react";

export default {
  schema: {
    title: "Widgets",
    type: "object",
    properties: {
      radio: {
        type: "object",
        title: "Radio field",
        properties: {
          radio: {
            type: "string",
            title: "Radio buttons",
            enum: ["Choice 1", "Choice 2", "Choice 3"]
          }
        }
      },
      updown: {
        type: "object",
        title: "Updown field",
        properties: {
          updown: {
            type: "number",
            title: "Updown buttons"
          }
        }
      },
      switch: {
        type: "object",
        title: "Switch field",
        properties: {
          switch: {
            type: "boolean",
            title: "Switch buttons"
          }
        }
      },
      checkbox: {
        type: "object",
        title: "Checbox field",
        properties: {
          checkbox: {
            type: "boolean",
            title: "Checkbox buttons"
          }
        }
      },
      select: {
        type: "object",
        title: "Select field",
        properties: {
          select: {
            type: "boolean",
            title: "Select"
          }
        }
      },
      string: {
        type: "object",
        title: "String field",
        properties: {
          default: {
            type: "string",
            title: "text input"
          },
          textarea: {
            type: "string",
            title: "textarea"
          }
        }
      },

      disabled: {
        type: "string",
        title: "A disabled field",
        default: "I am disabled."
      },
      readonly: {
        type: "string",
        title: "A readonly field",
        default: "I am read-only."
      }
    }
  },
  uiSchema: {
    select: {
      select: {
        "ui:widget": "select"
      }
    },
    updown: {
      updown: {
        "ui:widget": "updown"
      }
    },
    switch: {
      switch: {
        "ui:widget": "switch"
      }
    },
    checkbox: {
      checkbox: {
        "ui:widget": "checkboxes"
      }
    },
    radio: {
      radio: {
        "ui:widget": "radio"
      }
    },
    string: {
      textarea: {
        "ui:widget": "textarea",
        "ui:options": {
          rows: 5
        }
      }
    },
    disabled: {
      "ui:disabled": true
    },
    readonly: {
      "ui:readonly": true
    }
  },
  formData: {
    updown: { updown: 12 },
    radio: {
      radio: true
    },
    string: {
      default: "Hello...",
      textarea: "... World"
    }
  }
};

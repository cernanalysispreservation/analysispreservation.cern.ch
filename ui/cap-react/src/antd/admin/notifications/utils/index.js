export const schema = {
  type: "object",
  title: "Notification Configuration",
  definitions: {
    ctx: {
      type: "array",
      title: "Context (ctx) Options",
      uniqueItems: true,
      items: {
        anyOf: [
          {
            title: "Manually params",
            type: "object",
            properties: {
              name: {
                type: "string",
                title: "Variable name",
                description: "Provide the value for the path",
              },
              path: {
                type: "string",
                title: "Variable Path",
                description: "Provide the path for the value",
              },
            },
            required: ["name", "path"],
          },
          {
            title: "Select from Method",
            properties: {
              method: {
                type: "string",
                title: "Variable Method",
                enum: [
                  "draft_url",
                  "published_url",
                  "working_url",
                  "submitter_email",
                  "reviewer_email",
                  "cms_stats_committee_by_pag",
                  "published_id",
                  "draft_id",
                  "revision",
                  "draft_revision",
                ],
              },
            },
            required: ["method"],
          },
        ],
      },
    },
    mails: {
      type: "object",
      title: "Mails",
      properties: {
        default: {
          type: "array",
          title: "Default",
          uniqueItems: true,
          items: {
            type: "string",
            title: "Mail",
            description: "Provide simple email without parameters",
          },
        },
        formatted: {
          type: "array",
          title: "Formatted",
          uniqueItems: true,
          items: {
            type: "object",
            title: "Mail",
            properties: {
              template: {
                type: "string",
                title: "Template",
              },
              ctx: {
                $ref: "#/definitions/ctx",
              },
            },
          },
        },
      },
    },
    method: {
      type: "array",
      title: "Methods",
      uniqueItems: true,
      items: {
        type: "string",
        enum: [
          "published_id",
          "draft_id",
          "revision",
          "draft_revision",
          "draft_url",
          "published_url",
          "working_url",
          "submitter_url",
          "reviewer_url",
          "cms_stats_committee_by_pag",
        ],
      },
    },
    checks: {
      title: "Checks",
      type: "object",
      additionalProperties: false,
      properties: {
        op: {
          type: "string",
          title: "AND/OR",
        },
        checks: {
          type: "array",
          items: {
            oneOf: [
              { $ref: "#/definitions/checks" },
              { $ref: "#/definitions/condition" },
            ],
          },
        },
      },
    },
    condition: {
      type: "object",
      title: "Add Check",
      additionalProperties: false,
      properties: {
        path: {
          type: "string",
          title: "Path",
        },
        condition: {
          type: "string",
          title: "Condition",
        },
        value: {
          type: "string",
          title: "Value",
        },
        params: {
          type: "object",
        },
      },
    },
    params: {
      type: "array",
      title: "Context Parameter",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
            title: "Name",
          },
          path: {
            type: "string",
            title: "Path",
          },
        },
      },
    },
  },
  properties: {
    ctx: {
      $ref: "#/definitions/ctx",
    },
    subject: {
      title: "Email Subject",
      anyOf: [
        {
          title: "Default Subject",
          type: "object",
          additionalProperties: false,
          description:
            "The default email temaplate for this action will be used",
        },
        {
          type: "object",
          additionalProperties: false,
          title: "Customize Current Template",
          properties: {
            template: {
              type: "string",
              title: "Template string (Jinja format)",
            },
            ctx: {
              $ref: "#/definitions/ctx",
            },
          },
        },
        {
          type: "object",
          title: "Edit Template",
          additionalProperties: false,
          properties: {
            template_file: {
              type: "string",
              title: "Template file (path)",
            },
            ctx: {
              $ref: "#/definitions/ctx",
            },
          },
        },
      ],
    },
    body: {
      title: "Email Body",
      anyOf: [
        {
          title: "Default Body",
          type: "object",
          description:
            "The default email temaplate for this action will be used",
        },
        {
          type: "object",
          title: "Customize Current Template",
          additionalProperties: false,
          properties: {
            template_file: {
              type: "string",
              title: "Template file (path)",
            },
            ctx: {
              $ref: "#/definitions/ctx",
            },
            base_template: {
              type: "string",
              title: "Base Template",
            },
            plain: {
              type: "boolean",
              title: "Plain text or HTML",
            },
          },
        },
        {
          type: "object",
          title: "Edit Template",
          additionalProperties: false,
          properties: {
            template: {
              type: "string",
              title: "Template type (string/path)",
            },
            ctx: {
              $ref: "#/definitions/ctx",
            },
            base_template: {
              type: "string",
              title: "Base Template",
            },
            plain: {
              type: "boolean",
              title: "Plain text or HTML",
            },
          },
        },
      ],
    },
    recipients: {
      type: "object",
      title: "Email Recipients List",
      properties: {
        recipients: {
          type: "array",
          title: "TO",
          uniqueItems: true,
          items: {
            additionalProperties: false,
            type: "object",
            properties: {
              // op: {
              //   type: "string",
              //   title: "AND/OR",
              //   enum: ["and", "or"],
              //   default: "and"
              // },
              // checks: {
              //   type: "array",
              //   items: {
              //     oneOf: [
              //       { $ref: "#/definitions/checks" },
              //       { $ref: "#/definitions/condition" }
              //     ]
              //   }
              // },
              mails: {
                $ref: "#/definitions/mails",
              },
              method: {
                $ref: "#/definitions/method",
              },
            },
          },
        },
        bcc: {
          type: "array",
          title: "BCC",
          uniqueItems: true,
          items: {
            additionalProperties: false,
            type: "object",
            properties: {
              mails: {
                $ref: "#/definitions/mails",
              },
              method: {
                $ref: "#/definitions/method",
              },
            },
          },
        },
        cc: {
          type: "array",
          title: "CC",
          uniqueItems: true,
          items: {
            additionalProperties: false,
            type: "object",
            properties: {
              mails: {
                $ref: "#/definitions/mails",
              },
              method: {
                $ref: "#/definitions/method",
              },
            },
          },
        },
      },
    },
  },
};

export const uiSchema = {
  ctx: {
    "ui:field": "ctx",
    items: {
      "ui:options": {
        stringify: [
          "method",
          "path",
          // {"type": "text", "text": " -|- "},
          "name",
        ],
      },
    },
  },
  subject: {
    ctx: {
      "ui:field": "ctx",
    },
    template: {
      "ui:widget": "richeditor",
    },
    template_file: {
      "ui:widget": "richeditor",
    },
  },
  body: {
    ctx: {
      "ui:field": "ctx",
    },
    template: {
      "ui:widget": "richeditor",
    },
    template_file: {
      "ui:widget": "richeditor",
    },
  },
  recipients: {
    recipients: {
      items: {
        mails: {
          default: {
            "ui:widget": "tags",
          },
          formatted: {
            "ui:array": "default",
            items: {
              ctx: {
                "ui:field": "ctx",
              },
            },
          },
        },
      },
    },
    bcc: {
      items: {
        mails: {
          formatted: {
            "ui:array": "default",
            items: {
              ctx: {
                "ui:field": "ctx",
              },
            },
          },
        },
      },
    },
    cc: {
      items: {
        mails: {
          formatted: {
            "ui:array": "default",
            items: {
              ctx: {
                "ui:field": "ctx",
              },
            },
          },
        },
      },
    },
  },
  "ui:order": ["ctx", "recipients", "subject", "body"],
};

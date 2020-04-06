module.exports = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      firstName: {
        type: "string",
        title: "First name",
        default: "Chuck"
      },
      lastName: {
        type: "string",
        title: "Last name"
      },
      age: {
        type: "integer",
        title: "Age"
      },
      bio: {
        type: "string",
        title: "Bio"
      },
      password: {
        type: "string",
        title: "Password",
        minLength: 3
      },
      telephone: {
        type: "string",
        title: "Telephone",
        minLength: 10
      },
      ntuples_production: {
        items: {
          properties: {
            code_base: {
              "x-cap-file": {},
              type: "string",
              description: "Include your code for n-tuple production",
              title: "Your Code"
            }
          },
          type: "object",
          description: "Add instructions to run your code",
          title: ""
        },
        title: "N-tuples Production",
        type: "array",
        description: "Provide details on the intermediate n-tuples production",
        id: "ntuples_production"
      }
    }
  },
  uiSchema: {
    "ui:object": "tabView",
    "ui:options": {
      display: "grid",
      full: true,
      view: {
        vertical: true,
        sidebarColor: "brand"
      }
    },
    ntuples_production: {
      "ui:array": "AccordionArrayField"
    },
    firstName: {
      "ui:autofocus": true,
      "ui:emptyValue": ""
    },
    age: {
      "ui:widget": "updown",
      "ui:title": "Age of person",
      "ui:description": "(earthian year)"
    },
    bio: {
      "ui:widget": "textarea"
    },
    password: {
      "ui:widget": "password",
      "ui:help": "Hint: Make it strong!"
    },
    date: {
      "ui:widget": "alt-datetime"
    },
    telephone: {
      "ui:options": {
        inputType: "tel"
      }
    }
  },
  formData: {
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed"
  }
};

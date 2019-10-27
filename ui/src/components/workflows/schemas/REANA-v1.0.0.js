export const reana_workflow_spec_schema = {
  $schema: "http://json-schema.org/draft-04/schema#",
  definitions: {},
  id: "reana_spec",
  type: "object",
  title: "REANA analysis specification",
  description:
    "Full analysis specification including data, sofware, environment and workflow enabling reproducibility on a REANA cluster.",
  required: ["workflow"],
  properties: {
    environments: {
      id: "/properties/environments",
      type: "array",
      title: "Set of analysis' environments.",
      description: "All container images needed to reproduce the analysis.",
      items: {
        id: "/properties/environments/items",
        type: "object",
        optional: true,
        title: "Analysis environments.",
        description:
          "Analysis environments represented by container technology and image name.",
        properties: {
          image: {
            id: "/properties/environments/items/properties/image",
            type: "string",
            title: "Environment image id.",
            description:
              "String which represents an image used as environment for one or more steps of an analysis.",
            default: "busybox"
          },
          type: {
            id: "/properties/environments/items/properties/type",
            type: "string",
            title: "Container technology.",
            description:
              "Name which represents a supported container technology to provide as a REANA environment.",
            default: "docker"
          }
        }
      }
    },
    metadata: {
      id: "/properties/metadata",
      type: "object",
      title: "Analysis metadata.",
      properties: {
        author: {
          id: "/properties/metadata/properties/author",
          type: "string",
          title: "Analysis author.",
          description: "User or group who created the analysis.",
          default: "@reanahub/developers"
        },
        title: {
          id: "/properties/metadata/properties/title",
          type: "string",
          title: "Analysis title",
          default: "REANA analysis example"
        }
      }
    },
    outputs: {
      id: "/properties/outputs",
      type: "object",
      title: "Analysis outputs.",
      properties: {
        files: {
          id: "/properties/outputs/properties/files",
          type: "array",
          title: "Analysis results.",
          description:
            "Expected output from analysis represented by a set of files.",
          items: {
            id: "/properties/outputs/properties/files/items",
            type: "string",
            title: "Relative path to the file."
          }
        }
      }
    },
    inputs: {
      id: "/properties/inputs",
      type: "object",
      title: "Analysis inputs.",
      properties: {
        files: {
          id: "/properties/inputs/properties/files",
          type: "array",
          title: "Analysis input files.",
          description: "List of files provided as input for a given analysis.",
          optional: true,
          items: {
            id: "/properties/inputs/properties/files/items",
            type: "string",
            title: "Relative path to the file."
          }
        },
        directories: {
          id: "/properties/inputs/properties/directories",
          type: "array",
          title: "Analysis input directories.",
          description:
            "List of directories provided as input for a given analysis.",
          optional: true,
          items: {
            id: "/properties/inputs/properties/directories/items",
            type: "string",
            title: "Relative path to the directory."
          }
        },
        parameters: {
          id: "/properties/inputs/properties/parameters",
          type: "object",
          title: "Analysis parameters.",
          description:
            "Key value data structure which represents the analysis parameters.",
          optional: true
        }
      }
    },
    workflow: {
      id: "/properties/workflow",
      type: "object",
      title: "Analysis workflow.",
      description:
        "Workflow which represents the steps that need to be run to reproduce an analysis.",
      properties: {
        specification: {
          id: "/properties/workflow/properties/specification",
          type: "object",
          title: "Workflow specification in yaml format."
        },
        file: {
          id: "/properties/workflow/properties/file",
          type: "string",
          title: "Workflow file name."
        },
        type: {
          id: "/properties/workflow/properties/type",
          type: "string",
          title: "Workflow engine.",
          description:
            "Name which represents a supported workflow engine to be used to reproduce the analysis."
        },
        resources: {
          id: "/properties/workflow/properties/resources",
          type: "object",
          title: "Workflow resources in yaml format.",
          properties: {
            cvmfs: {
              id: "/properties/workflow/properties/resources/properties/cvmfs",
              type: "array",
              items: {
                type: "string",
                title: "CVMFS repos",
                optional: false
              }
            }
          }
        }
      },
      required: ["type"]
    }
  }
};

export const schema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Workflow Name"
    },
    workflow_json: reana_workflow_spec_schema
  },
  title: "Create new REANA workflow",
  description:
    "Start a new workflow and run it on the REANA cluster. Provide a name, inputs, specification, outputs and all the elements necessary  to run your ana "
};

export const uiSchema = {
  // "input": {
  // 	// "items": {},
  // 	"ui:options": {
  // 		"grid": {
  // 			// "gridColumns": "1/3"
  // 		}
  // 	}
  // },
  workflow_json: {
    "ui:field": "jsoneditor"
  },
  // "output": {
  // 	"items": {},
  // 	"ui:options": {
  // 		"grid": {
  // 			// "gridColumns": "3/5"
  // 		}
  // 	}
  // },
  "ui:options": { size: "full" },
  "ui:order": ["name", "workflow_json", "*"]
};
export const _uiSchema = {
  "ui:order": ["inputs", "workflow", "outputs", "*"],
  "ui:options": {
    size: "full"
  }
};

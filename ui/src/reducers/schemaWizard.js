import { Map, fromJS, List } from "immutable";

import {
  SCHEMA_INIT,
  CURRENT_UPDATE_PATH,
  CURRENT_UPDATE_SCHEMA_PATH,
  CURRENT_UPDATE_UI_SCHEMA_PATH,
  LIST_UPDATE,
  PROPERTY_SELECT,
  PROPERTY_SELECT_CLEAR,
  CREATE_MODE_ENABLE,
  ADD_PROPERTY,
  ADD_PROPERTY_INIT
} from "../actions/schemaWizard";

const initialState = Map({
  list: {},
  selected: null,
  init: null,
  current: fromJS({
    //   schema: {},
    //   uiSchema: {}
    // }),
    schema: {
      title: "boom",
      description: "bloom",
      type: "object",
      properties: {
        aaaa1: {
          type: "string",
          title: "AAAAAAA"
        },
        aaaaa1: {
          type: "boolean",
          title: "AAAAAAA"
        },
        bbbbbb1: {
          type: "object",
          properties: {
            workflow_title: {
              type: "string",
              title: "Workflow Title"
            },
            workflow: {
              oneOf: [
                {
                  type: "object",
                  properties: {
                    aaaa1: {
                      type: "string",
                      title: "AAAAAAA"
                    },
                    aaaaa1: {
                      type: "boolean",
                      title: "AAAAAAA"
                    }
                  }
                },
                { title: "afasdfsasfdas", type: "string" }
              ]
            }
          }
        },
        cccc1: {
          type: "array",
          items: {
            type: "object",
            properties: {
              aaaa2: { type: "string" },
              bbbb2: { type: "object", properties: {} }
            }
          }
        },
        ddddd1: {
          type: "array",
          items: {
            type: "object",
            properties: {
              aaaa2: { type: "string" },
              bbbb2: { type: "object", properties: {} }
            }
          }
        }
      }
    },
    uiSchema: {
      // "bbbbbb1": {
      //   "ui:array": "AccordionArrayField"
      // }
      // "ui:object": "tabView",
      "ui:options": {
        view: {
          container: "centered",
          innerLayout: "centered",
          vertical: "true"
        }
      },
      aaaa1: {
        "ui:options": {
          view: {
            // layout: "1/2"
          }
        }
      },
      bbbbbb1: {
        "ui:object": "tabView",
        "ui:options": {
          full: true,
          view: {
            // container: "inline",
            // padding: "small",
            // layout: "1/2",
            // innerLayout: "centered",
            vertical: "true"
            // sidebarColor: "grey-4"
          }
        }
      }
    }
  }),
  field: null,
  propKeyEditor: null,
  editView: false
});

export default function schemaReducer(state = initialState, action) {
  switch (action.type) {
    case SCHEMA_INIT:
      return state
        .set("selected", action.id)
        .set("init", Map(state.getIn(["list", action.id])))
        .set("current", fromJS(state.getIn(["list", action.id])));
    case LIST_UPDATE:
      return state.set("list", Map(action.items));

    case ADD_PROPERTY_INIT:
      return state.set(
        "propKeyEditor",
        Map({ path: action.path, type: "new" })
      );
    case ADD_PROPERTY:
      return state
        .setIn(
          ["current", "schema", ...action.path, "properties", action.key],
          fromJS({})
        )
        .set("propKeyEditor", null);
    case PROPERTY_SELECT:
      return state.set(
        "field",
        fromJS({
          path: action.path.schema,
          uiPath: action.path.uiSchema
        }).set("editView", true)
      );
    case PROPERTY_SELECT_CLEAR:
      return state.set("field", null);
    case CREATE_MODE_ENABLE:
      return state.set("field", null);
    case CURRENT_UPDATE_PATH:
      return state
        .setIn(
          ["current", "schema", ...action.path.schema],
          fromJS(action.value.schema)
        )
        .setIn(
          ["current", "uiSchema", ...action.path.uiSchema],
          fromJS(action.value.uiSchema)
        );
    case CURRENT_UPDATE_SCHEMA_PATH:
      return state.setIn(
        ["current", "schema", ...action.path],
        fromJS(action.value)
      );
    case CURRENT_UPDATE_UI_SCHEMA_PATH:
      return state.setIn(
        ["current", "uiSchema", ...action.path],
        fromJS(action.value)
      );
    default:
      return state;
  }
}

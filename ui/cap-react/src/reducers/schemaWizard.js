import { Map, fromJS } from "immutable";

import {
  SCHEMA_INIT,
  CURRENT_UPDATE_CONFIG,
  CURRENT_UPDATE_PATH,
  CURRENT_UPDATE_SCHEMA_PATH,
  CURRENT_UPDATE_UI_SCHEMA_PATH,
  PROPERTY_SELECT,
  CREATE_MODE_ENABLE,
  ADD_PROPERTY,
  ADD_PROPERTY_INIT,
  SCHEMA_ERROR,
  SCHEMA_INIT_REQUEST,
  UPDATE_SCHEMA_CONFIG,
  UPDATE_CONDITIONS_SCHEMA_CONFIG,
  UPDATE_EMAIL_LIST_TO_CONDITION,
  UPDATE_CONFIG_SCHEMA_CONDITION,
  SET_SELECTED_NOTIFICATION,
  CLEAR_SELECTED_NOTIFICATION,
  UPDATE_NOTIFICATION_BY_INDEX,
  ADD_NEW_NOTIFICATION,
  UPDATE_CONDITION_LIST,
  REMOVE_NOTIFICATION,
  UPDATE_CONDITION_VALUE_BY_PATH
} from "../actions/schemaWizard";

const initialState = Map({
  current: fromJS({
    schema: {},
    uiSchema: {}
  }),
  initial: fromJS({
    schema: {},
    uiSchema: {}
  }),
  config: {},
  field: null,
  propKeyEditor: null,
  error: null,
  loader: false,
  schemaConfig: fromJS({
    reviewable: true,
    notifications: {
      actions: {
        publish: [],
        review: [
          {
            subject: {
              template:
                'Antonios Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - {{ "New Version of Published Analysis" if revision > 0 else "New Published Analysis" }} | CERN Analysis Preservation',
              ctx: [
                {
                  name: "cadi_id",
                  path: "analysis_context.cadi_id"
                },
                {
                  method: "revision"
                },
                {
                  method: "published_id"
                }
              ]
            },
            body: {
              template: "jfdkl fdskj fdsljf lkfjds",
              ctx: [
                {
                  name: "cadi_id",
                  path: "analysis_context.cadi_id"
                },
                {
                  name: "title",
                  path: "general_title"
                }
              ]
            },
            recipients: {
              bcc: [
                {
                  method: "get_cms_stat_recipients"
                },
                {
                  method: "get_owner"
                },
                {
                  op: "and",
                  checks: [
                    {
                      path: "parton_distribution_functions",
                      condition: "exists"
                    },
                    {
                      path: "parton_distribution",
                      condition: "exists"
                    },
                    {
                      op: "and",
                      checks: [
                        {
                          path: "mhden",
                          condition: "fdjshk"
                        },
                        {
                          path: "emd",
                          condition: "fdjshk"
                        },
                        {
                          path: "duo",
                          condition: "fdjshk"
                        }
                      ]
                    }
                  ],
                  mails: {
                    default: ["pdf-forum-placeholder@cern.ch"],
                    formatted: []
                  }
                },
                {
                  op: "or",
                  checks: [
                    {
                      path: "cadi_id",
                      condition: "exists"
                    },
                    {
                      path: "cadi_id",
                      condition: "exists"
                    },
                    {
                      path: "cadi_id",
                      condition: "exists"
                    }
                  ],
                  mails: {
                    default: ["cms@cern.ch", "fhdjhsk@fjd,fd", "kfhj@kvjfj"],
                    formatted: [
                      {
                        template:
                          "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern.ch{% endif %}",
                        ctx: [
                          {
                            name: "cadi_id",
                            type: "path",
                            path: "analysis_context.cadi_id"
                          }
                        ]
                      }
                    ]
                  }
                },
                {
                  mails: {
                    default: [
                      "some-recipient-placeholder@cern.ch",
                      "antonio@fkjdhk.com",
                      "papa@cern.ch",
                      "papa2@fkjdhk.com",
                      "papa3@cern.ch",
                      "papa4@fkjdhk.com",
                      "papa5@cern.ch",
                      "papa6@fkjdhk.com",
                      "papa7@cern.ch",
                      "papa8@fkjdhk.com"
                    ],
                    formatted: []
                  }
                }
              ],
              cc: [],
              to: []
            }
          },
          {
            subject: {
              template:
                'Antonios Questionnaire for {{ cadi_id if cadi_id else "" }} {{ published_id }} - {{ "New Version of Published Analysis" if revision > 0 else "New Published Analysis" }} | CERN Analysis Preservation',
              ctx: [
                {
                  name: "cadi_id",
                  path: "analysis_context.cadi_id"
                },
                {
                  method: "revision"
                },
                {
                  method: "published_id"
                }
              ]
            },
            body: {
              template: "jfdkl fdskj fdsljf lkfjds",
              ctx: [
                {
                  name: "cadi_id",
                  path: "analysis_context.cadi_id"
                },
                {
                  name: "title",
                  path: "general_title"
                }
              ]
            },
            recipients: {
              bcc: [
                {
                  method: "get_cms_stat_recipients"
                },
                {
                  method: "get_owner"
                },
                {
                  op: "and",
                  checks: [
                    {
                      path: "parton_distribution_functions",
                      condition: "exists"
                    },
                    {
                      path: "parton_distribution",
                      condition: "exists"
                    },
                    {
                      op: "and",
                      checks: [
                        {
                          path: "mhden",
                          condition: "fdjshk"
                        },
                        {
                          path: "emd",
                          condition: "fdjshk"
                        },
                        {
                          path: "duo",
                          condition: "fdjshk"
                        }
                      ]
                    }
                  ],
                  mails: {
                    default: ["pdf-forum-placeholder@cern.ch"],
                    formatted: []
                  }
                },
                {
                  op: "or",
                  checks: [
                    {
                      path: "cadi_id",
                      condition: "exists"
                    },
                    {
                      path: "cadi_id",
                      condition: "exists"
                    },
                    {
                      path: "cadi_id",
                      condition: "exists"
                    }
                  ],
                  mails: {
                    default: ["cms@cern.ch", "fhdjhsk@fjd,fd", "kfhj@kvjfj"],
                    formatted: [
                      {
                        template:
                          "{% if cadi_id %}hn-cms-{{ cadi_id }}@cern.ch{% endif %}",
                        ctx: [
                          {
                            name: "cadi_id",
                            type: "path",
                            path: "analysis_context.cadi_id"
                          }
                        ]
                      }
                    ]
                  }
                },
                {
                  mails: {
                    default: [
                      "some-recipient-placeholder@cern.ch",
                      "antonio@fkjdhk.com",
                      "papa@cern.ch",
                      "papa2@fkjdhk.com",
                      "papa3@cern.ch",
                      "papa4@fkjdhk.com",
                      "papa5@cern.ch",
                      "papa6@fkjdhk.com",
                      "papa7@cern.ch",
                      "papa8@fkjdhk.com"
                    ],
                    formatted: []
                  }
                }
              ],
              cc: [],
              to: []
            }
          }
        ]
      }
    }
  })
});

export default function schemaReducer(state = initialState, action) {
  switch (action.type) {
    case SCHEMA_INIT_REQUEST:
      return initialState.set("loader", true);
    case SCHEMA_INIT:
      return state
        .set("current", fromJS(action.data))
        .set("initial", fromJS(action.data))
        .set("config", action.configs)
        .set("loader", false);
    case SCHEMA_ERROR:
      return state.set("error", action.payload).set("loader", false);

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
        })
      );
    case CREATE_MODE_ENABLE:
      return state.set("field", null);
    case CURRENT_UPDATE_PATH:
      return state
        .setIn(
          ["current", "uiSchema", ...action.path.uiSchema],
          fromJS(action.value.uiSchema)
        )
        .setIn(
          ["current", "schema", ...action.path.schema],
          fromJS(action.value.schema)
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
    case CURRENT_UPDATE_CONFIG:
      return state.set("config", action.config);
    case UPDATE_SCHEMA_CONFIG:
      return state.set("schemaConfig", fromJS(action.payload));
    case UPDATE_CONDITIONS_SCHEMA_CONFIG:
      return state.setIn(
        ["schemaConfig", "notifications", "actions", action.payload.action],
        fromJS(action.payload.conditions)
      );
    case UPDATE_EMAIL_LIST_TO_CONDITION:
      return state.setIn(
        [...action.payload.path],
        fromJS(action.payload.mails)
      );
    case UPDATE_CONFIG_SCHEMA_CONDITION:
      return state.setIn(
        [...action.payload.path],
        fromJS(action.payload.conditions)
      );
    case SET_SELECTED_NOTIFICATION:
      return state
        .set("selectedNotification", action.payload.notification)
        .set("selectedNotificationIndex", action.payload.index)
        .set("selectedNotificationCategory", action.payload.category);
    case CLEAR_SELECTED_NOTIFICATION:
      return state.set("selectedNotification", null);
    case UPDATE_NOTIFICATION_BY_INDEX:
      return state.setIn([...action.payload.path], action.payload.value);
    case ADD_NEW_NOTIFICATION:
      return state
        .setIn(action.payload.path, action.payload.item)
        .set("selectedNotification", action.payload.notification)
        .set("selectedNotificationCategory", action.payload.category)
        .set("selectedNotificationIndex", action.payload.index - 1);
    case UPDATE_CONDITION_LIST:
      return state.setIn(action.payload.path, action.payload.condition);
    case REMOVE_NOTIFICATION:
      return state.setIn(action.payload.path, action.payload.notification);
    case UPDATE_CONDITION_VALUE_BY_PATH:
      return state.setIn(action.payload.path, action.payload.condition);
    default:
      return state;
  }
}

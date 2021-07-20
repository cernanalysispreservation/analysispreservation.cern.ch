import axios from "axios";
import { List, fromJS } from "immutable";
import { push } from "connected-react-router";
import cogoToast from "cogo-toast";
import { slugify, _initSchemaStructure } from "../components/cms/utils";

export const ADD_PROPERTY = "ADD_PROPERTY";
export const ADD_PROPERTY_INIT = "ADD_PROPERTY_INIT";

export const CREATE_MODE_ENABLE = "CREATE_MODE_ENABLE";

export const PROPERTY_SELECT = "PROPERTY_SELECT";

export const SCHEMA_INIT_REQUEST = "SCHEMA_INIT_REQUEST";
export const SCHEMA_INIT = "SCHEMA_INIT";
export const SCHEMA_ERROR = "SCHEMA_ERROR";

export const CURRENT_UPDATE_CONFIG = "CURRENT_UPDATE_CONFIG";
export const CURRENT_UPDATE_PATH = "CURRENT_UPDATE_PATH";
export const CURRENT_UPDATE_SCHEMA_PATH = "CURRENT_UPDATE_SCHEMA_PATH";
export const CURRENT_UPDATE_UI_SCHEMA_PATH = "CURRENT_UPDATE_UI_SCHEMA_PATH";

export const UPDATE_SCHEMA_CONFIG = "UPDATE_SCHEMA_CONFIG";
export const UPDATE_CONDITIONS_SCHEMA_CONFIG =
  "UPDATE_CONDITIONS_SCHEMA_CONFIG";
export const UPDATE_EMAIL_LIST_TO_CONDITION = "UPDATE_EMAIL_LIST_TO_CONDITION";
export const UPDATE_OPERATOR_OF_CONDITION = "UPDATE_OPERATOR_OF_CONDITION";
export const UPDATE_CHECK_IN_CONDITION = "UPDATE_CHECK_IN_CONDITION";
export const UPDATE_CONFIG_SCHEMA_CONDITION = "UPDATE_CONFIG_SCHEMA_CONDITION";

export const SET_SELECTED_NOTIFICATION = "SET_SELECTED_NOTIFICATION";
export const CLEAR_SELECTED_NOTIFICATION = "CLEAR_SELECTED_NOTIFICATION";

export const UPDATE_NOTIFICATION_BY_INDEX = "UPDATE_NOTIFICATION_BY_INDEX";
export const ADD_NEW_NOTIFICATION = "ADD_NEW_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const UPDATE_CONDITION_LIST = "UPDATE_CONDITION_LIST";
export const UPDATE_CONDITION_VALUE_BY_PATH = "UPDATE_CONDITION_VALUE_BY_PATH";

export function updateNotification(data) {
  return {
    type: UPDATE_NOTIFICATION_BY_INDEX,
    payload: data
  };
}

export function updateConditionValueByPath(data) {
  return {
    type: UPDATE_CONDITION_VALUE_BY_PATH,
    payload: data
  };
}

export function addNewNotification(item) {
  return {
    type: ADD_NEW_NOTIFICATION,
    payload: item
  };
}

export function deleteNotification(notification) {
  return {
    type: REMOVE_NOTIFICATION,
    payload: notification
  };
}

export function updateConditions(condition) {
  return {
    type: UPDATE_CONDITION_LIST,
    payload: condition
  };
}

export function setSelectedNotification(notification, index, category) {
  return {
    type: SET_SELECTED_NOTIFICATION,
    payload: { notification, index, category }
  };
}

export function clearSelectedNotification() {
  return {
    type: CLEAR_SELECTED_NOTIFICATION
  };
}

export function schemaConfigUpdate(data) {
  return { type: UPDATE_SCHEMA_CONFIG, payload: data };
}

export function updateConditionInConfig(item) {
  return { type: UPDATE_CONFIG_SCHEMA_CONDITION, payload: item };
}

export function updateEmailListToCondition(item) {
  return { type: UPDATE_EMAIL_LIST_TO_CONDITION, payload: item };
}

export function updateConditionsToConfigSchema(conditions, action) {
  return {
    type: UPDATE_CONDITIONS_SCHEMA_CONFIG,
    payload: { conditions, action }
  };
}

export function schemaError(error) {
  return {
    type: SCHEMA_ERROR,
    payload: error
  };
}

export function schemaInitRequest() {
  return {
    type: SCHEMA_INIT_REQUEST
  };
}

export function schemaInit(id, data, configs = {}) {
  return {
    type: SCHEMA_INIT,
    id,
    data,
    configs
  };
}

export function enableCreateMode() {
  return { type: CREATE_MODE_ENABLE };
}

export function selectProperty(path) {
  return {
    type: PROPERTY_SELECT,
    path
  };
}

export function initSchemaWizard(data) {
  return function(dispatch) {
    const { id, deposit_schema, deposit_options, ...configs } = data;

    dispatch(
      schemaInit(
        id || "Schema Name",
        { schema: deposit_schema, uiSchema: deposit_options },
        configs
      )
    );
    dispatch(push("/cms/edit"));
  };
}

export function getSchema(name, version = null) {
  let schemaLink;

  if (version) schemaLink = `/api/jsonschemas/${name}/${version}?resolve=1`;
  else schemaLink = `/api/jsonschemas/${name}?resolve=1`;
  return function(dispatch) {
    dispatch(schemaInitRequest());
    axios
      .get(schemaLink)
      .then(resp => {
        let schema = resp.data;
        let { id, deposit_schema, deposit_options, ...configs } = schema;
        if (deposit_schema && deposit_options)
          dispatch(
            schemaInit(
              id || "Schema Name",
              { schema: deposit_schema, uiSchema: deposit_options },
              configs
            )
          );
      })
      .catch(err => {
        dispatch(schemaError(err));
      });
  };
}

export function getSchemasLocalStorage() {
  return function() {
    //let availableSchemas = localStorage.getItem("availableSchemas");
    let availableSchemas = JSON.parse(availableSchemas);
  };
}

export function createContentType(content_type) {
  return function(dispatch) {
    dispatch(schemaInitRequest());
    let name = content_type.formData.name;
    let description = content_type.formData.description;
    const _id = slugify(Math.random().toString() + "_" + name);

    dispatch(
      schemaInit(_id, _initSchemaStructure(name, description), {
        fullname: name
      })
    );
    dispatch(push("/cms/edit"));
  };
}

export function selectContentType(id) {
  return function(dispatch) {
    dispatch(getSchema(id));
    dispatch(push(`/cms/edit`));
  };
}

export function selectFieldType(path, change) {
  return function(dispatch) {
    dispatch(updateByPath(path, change));
  };
}
export function updateCurrentSchemaWithField(schema) {
  return function(dispatch, getState) {
    let state = getState().schemaWizard;
    let propKey = state.getIn(["field", "propKey"]);
    let path = state.getIn(["field", "path"]).toJS();

    const pathToChange = propKey ? [...path, propKey] : path;
    dispatch(updateSchemaByPath(pathToChange, schema));
  };
}

export function updateSchemaConfig(config) {
  return {
    type: CURRENT_UPDATE_CONFIG,
    config
  };
}

export function updateSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_SCHEMA_PATH,
    path,
    value
  };
}

export function updateUiSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_UI_SCHEMA_PATH,
    path,
    value
  };
}

export function updateByPath(path, value) {
  return {
    type: CURRENT_UPDATE_PATH,
    path,
    value
  };
}

export function addByPath({ schema: path, uiSchema: uiPath }, data) {
  return function(dispatch, getState) {
    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();

    let _path = path;
    let _uiPath = uiPath;

    let random_name = `item_${Math.random()
      .toString(36)
      .substring(2, 8)}`;

    if (schema.type) {
      if (schema.type == "object") {
        if (!schema.properties) schema.properties = {};
        _path = [...path, "properties", random_name];
        _uiPath = [...uiPath, random_name];
      } else if (schema.type == "array") {
        if (!schema.items) schema.items = {};
        _path = [...path, "items"];
        _uiPath = [...uiPath, "items"];
      }

      dispatch(updateByPath({ schema: _path, uiSchema: _uiPath }, data));
    }
  };
}

export function initAddProperty(path) {
  return {
    type: ADD_PROPERTY_INIT,
    path
  };
}

export function addProperty(path, key) {
  return {
    type: ADD_PROPERTY,
    path,
    key
  };
}

// delete item from schema and uiSchema
export function deleteByPath(item) {
  return function(dispatch, getState) {
    const { path, uiPath } = item;
    const uiItemToDelete = uiPath.pop();

    // ********* schema **********
    let itemToDelete = path.pop();
    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    itemToDelete = itemToDelete === "items" ? path.pop() : itemToDelete;

    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();

    delete schema[itemToDelete];

    // ********* uiSchema **********
    let uiSchema = getState()
      .schemaWizard.getIn(["current", "uiSchema", ...uiPath])
      .toJS();

    delete uiSchema[uiItemToDelete];

    if (uiSchema["ui:order"]) {
      // remove the itemToDelete from the ui:order
      uiSchema["ui:order"] = uiSchema["ui:order"].filter(
        item => item !== uiItemToDelete
      );
    }

    // ********* update changes **********
    dispatch(
      updateByPath({ schema: path, uiSchema: uiPath }, { schema, uiSchema })
    );
    dispatch(enableCreateMode());
  };
}

// update the id field of a property
export function renameIdByPath(item, newName) {
  return function(dispatch, getState) {
    const path = item.path;
    const uiPath = item.uiPath;

    let itemToDelete = path.pop();
    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    itemToDelete = itemToDelete === "items" ? path.pop() : itemToDelete;

    const uiItemToDelete = uiPath.pop();

    // check if the new id is empty or exact same with the current id
    if (newName === itemToDelete || newName === "") {
      cogoToast.warn("Make sure that the new id is different and not empty", {
        position: "top-center",
        bar: { size: "0" },
        hideAfter: 3
      });
      return;
    }

    // navigate to the correct path
    let schema = getState()
      .schemaWizard.getIn(["current", "schema", ...path])
      .toJS();
    let uiSchema = getState()
      .schemaWizard.getIn(["current", "uiSchema", ...uiPath])
      .toJS();

    // ********* schema **********
    let keys = Object.keys(schema);
    // make sure that the new name is unique among sibling widgets
    if (keys.includes(newName)) {
      cogoToast.error("The id should be unique, this name already exists", {
        position: "top-center",
        bar: { size: "0" },
        hideAfter: 3
      });
      return;
    }

    // create new obj with the information and then delete the old one
    schema[newName] = schema[itemToDelete];
    delete schema[itemToDelete];

    // ********* uiSchema **********
    if (!uiSchema["ui:order"]) {
      uiSchema["ui:order"] = [];
    }
    // update the uiOrder array
    let pos = uiSchema["ui:order"].indexOf(uiItemToDelete);
    if (pos > -1) {
      uiSchema["ui:order"][pos] = newName;
    }

    if (uiSchema[uiItemToDelete]) {
      uiSchema[newName] = uiSchema[uiItemToDelete];
    }
    // remove from the uiSchema
    delete uiSchema[uiItemToDelete];

    // ********* update changes **********
    dispatch(
      updateByPath({ schema: path, uiSchema: uiPath }, { schema, uiSchema })
    );

    dispatch(
      selectProperty({
        schema: [...path, newName],
        uiSchema: [...uiPath, newName]
      })
    );
  };
}

export function updateSchemaProps(prop) {
  return function(dispatch, getState) {
    const { title, description, configs } = prop;

    let schema = getState()
      .schemaWizard.getIn(["current", "schema"])
      .toJS();

    if (configs) {
      dispatch(updateSchemaConfig(configs));
      return;
    }

    if (title) {
      schema.title = title;
    }

    if (description) {
      schema.description = description;
    }

    dispatch(updateSchemaByPath([], schema));
  };
}

export function updateOperatorToCheck(path, index, action) {
  return function(dispatch, getState) {
    const i = getState().schemaWizard.get("selectedNotificationIndex");
    const category = getState().schemaWizard.get(
      "selectedNotificationCategory"
    );
    const valuesPath = [
      "schemaConfig",
      "notifications",
      "actions",
      category,
      i,
      "recipients",
      action,
      index,
      ...path
    ];

    let conditions = getState().schemaWizard.getIn(valuesPath);
    if (conditions.get("op") == "and") conditions = conditions.set("op", "or");
    else conditions = conditions.set("op", "and");

    const item = {
      conditions,
      path: valuesPath
    };

    dispatch(updateConditionInConfig(item));
  };
}

export function updateChecksInConditions(
  path,
  index,
  howToUpdate = "add",
  emailType,
  type
) {
  return function(dispatch, getState) {
    const i = getState().schemaWizard.get("selectedNotificationIndex");
    const category = getState().schemaWizard.get(
      "selectedNotificationCategory"
    );
    const newObject = {
      path: undefined,
      condition: "Action..",
      value: "Value.."
    };

    const multiple = {
      op: "and",
      checks: [
        {
          path: "first",
          condition: "equals",
          value: "yes"
        },
        {
          path: "second",
          condition: "exists",
          value: "true"
        }
      ]
    };
    const valuesPath = [
      "schemaConfig",
      "notifications",
      "actions",
      category,
      i,
      "recipients",
      emailType,
      index,
      ...path
    ];

    let conditions = getState().schemaWizard.getIn(valuesPath);

    if (howToUpdate == "delete") {
      conditions = conditions.filter(item => item != type);
    } else {
      conditions = conditions.toJS();
      conditions.checks.push(type ? multiple : newObject);
    }

    const item = {
      conditions,
      path: valuesPath
    };
    dispatch(updateConditionInConfig(item));
  };
}

export function updateNotificationByIndex(key, value) {
  return function(dispatch, getState) {
    const state = getState();
    const index = state.schemaWizard.get("selectedNotificationIndex");
    const category = state.schemaWizard.get("selectedNotificationCategory");
    let path = [
      "schemaConfig",
      "notifications",
      "actions",
      category,
      index,
      ...key
    ];

    let item = state.schemaWizard.getIn(path);

    let newItem = item;

    if (item.includes(value)) {
      if (List.isList(item)) {
        let ind = item.indexOf(value);
        newItem = item.delete(ind);
      } else newItem = value;
    } else {
      if (List.isList(item)) newItem = item.push(value);
      else newItem = value;
    }

    dispatch(updateNotification({ path, value: newItem }));
  };
}

export function createNewNotification(category) {
  return function(dispatch, getState) {
    const newNotification = {
      subject: {
        template: "",
        ctx: []
      },
      body: {
        template: "",
        ctx: []
      },
      recipients: {
        bcc: [
          {
            mails: {
              default: [],
              formatted: []
            }
          }
        ],
        cc: [
          {
            mails: {
              default: [],
              formatted: []
            }
          }
        ],
        to: [
          {
            mails: {
              default: [],
              formatted: []
            }
          }
        ]
      }
    };

    const valuesPath = ["schemaConfig", "notifications", "actions", category];

    let notifications = getState().schemaWizard.getIn(valuesPath);
    notifications = notifications.push(fromJS(newNotification));

    dispatch(
      addNewNotification({
        path: valuesPath,
        item: notifications,
        category,
        index: notifications.size
      })
    );
    dispatch(push(`/notifications/${category}/create`));
  };
}

export function addNewCondition(emailType) {
  return function(dispatch, getState) {
    const i = getState().schemaWizard.get("selectedNotificationIndex");
    const category = getState().schemaWizard.get(
      "selectedNotificationCategory"
    );

    const newCondition = {
      op: "and",
      checks: [
        {
          condition: "exists"
        }
      ],
      mails: {
        formatted: [],
        default: []
      }
    };

    const path = [
      "schemaConfig",
      "notifications",
      "actions",
      category,
      i,
      "recipients",
      emailType
    ];
    let condition = getState().schemaWizard.getIn(path);
    condition = condition.push(fromJS(newCondition));

    dispatch(updateConditions({ path, condition }));
  };
}

export function removeCondition(emailType, item) {
  return function(dispatch, getState) {
    const i = getState().schemaWizard.get("selectedNotificationIndex");
    const category = getState().schemaWizard.get(
      "selectedNotificationCategory"
    );

    const path = [
      "schemaConfig",
      "notifications",
      "actions",
      category,
      i,
      "recipients",
      emailType
    ];

    const cond = getState().schemaWizard.getIn(path);
    const itemToDelete = cond.indexOf(item.mail);
    const updatedCond = cond.delete(itemToDelete);

    dispatch(updateConditions({ path, condition: updatedCond }));
  };
}

export function removeNotification(index, category) {
  return function(dispatch, getState) {
    const path = ["schemaConfig", "notifications", "actions", category];

    let notification = getState().schemaWizard.getIn(path);

    let newNotification = notification.delete(index);
    dispatch(deleteNotification({ path, notification: newNotification }));
  };
}

export function updateValueByPath(
  checkIndex,
  emailType,
  path,
  item,
  cond,
  val
) {
  return function(dispatch, getState) {
    const i = getState().schemaWizard.get("selectedNotificationIndex");
    const category = getState().schemaWizard.get(
      "selectedNotificationCategory"
    );

    let valuesPath = [
      "schemaConfig",
      "notifications",
      "actions",
      category,
      i,
      "recipients",
      emailType,
      checkIndex,
      ...path
    ];
    let condition = getState().schemaWizard.getIn(valuesPath);
    // mostly the cases of the first level where the path is an empty array
    if (condition.has("checks")) {
      condition = condition.get("checks");
      let ind = condition.indexOf(item);
      condition = condition.get(ind);
      valuesPath = [...valuesPath, "checks", ind];
    }
    condition = condition.set(cond, val);

    dispatch(
      updateConditionValueByPath({
        path: valuesPath,
        condition
      })
    );
  };
}

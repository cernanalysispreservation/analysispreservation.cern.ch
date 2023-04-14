import axios from "axios";
import { merge } from "lodash-es";
import { fromJS } from "immutable";
import { push } from "connected-react-router";
import { notification } from "antd";
import { CMS, CMS_NEW } from "../antd/routes";
import { slugify, _initSchemaStructure } from "../antd/admin/utils";
import { updateDepositGroups } from "./auth";

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

export const UPDATE_NOTIFICATION_BY_INDEX = "UPDATE_NOTIFICATION_BY_INDEX";
export const ADD_NEW_NOTIFICATION = "ADD_NEW_NOTIFICATION";
export const REMOVE_NOTIFICATION = "REMOVE_NOTIFICATION";
export const CREATE_NOTIFICATION_GROUP = "CREATE_NOTIFICATION_GROUP";

const NOTIFICATIONS = {
  notifications: {
    actions: {
      review: [],
      publish: [],
    },
  },
};

export function updateNotification(data) {
  return {
    type: UPDATE_NOTIFICATION_BY_INDEX,
    payload: data,
  };
}

export function addNewNotification(item) {
  return {
    type: ADD_NEW_NOTIFICATION,
    payload: item,
  };
}

export function deleteNotification(notification) {
  return {
    type: REMOVE_NOTIFICATION,
    payload: notification,
  };
}

export function schemaError(error) {
  return {
    type: SCHEMA_ERROR,
    payload: error,
  };
}

export function schemaInitRequest() {
  return {
    type: SCHEMA_INIT_REQUEST,
  };
}

export function schemaInit(id, data, configs = {}) {
  return {
    type: SCHEMA_INIT,
    id,
    data,
    configs,
  };
}

export function enableCreateMode() {
  return { type: CREATE_MODE_ENABLE };
}

export function selectProperty(path) {
  return {
    type: PROPERTY_SELECT,
    path,
  };
}

export function initSchemaWizard(data) {
  return function(dispatch) {
    const { id, deposit_schema, deposit_options, ...configs } = data;

    configs.config = merge(configs.config, NOTIFICATIONS);
    dispatch(
      schemaInit(
        id || "Schema Name",
        { schema: deposit_schema, uiSchema: deposit_options },
        configs
      )
    );
    dispatch(push(CMS_NEW));
  };
}

export function getSchema(name, version = null) {
  let schemaLink;

  if (version)
    schemaLink = `/api/jsonschemas/${name}/${version}?resolve=1&config=1`;
  else schemaLink = `/api/jsonschemas/${name}?resolve=1&config=1`;
  return function(dispatch) {
    dispatch(schemaInitRequest());
    axios
      .get(schemaLink)
      .then(resp => {
        let schema = resp.data;
        let { id, deposit_schema, deposit_options, ...configs } = schema;

        configs.config = merge(configs.config, NOTIFICATIONS);

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
        dispatch(push(CMS));
        notification.error({
          message: "Schema fetch failed",
          description: "Make sure that schema name and version are correct ",
        });
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

    let { name, description } = content_type;
    const _id = slugify(Math.random().toString() + "_" + name);
    let config = {
      config: merge({ fullname: name }, NOTIFICATIONS),
    };

    dispatch(schemaInit(_id, _initSchemaStructure(name, description), config));
    dispatch(push(CMS_NEW));
  };
}

export function selectContentType(id) {
  return function(dispatch) {
    dispatch(push(`${CMS}/${id}`));
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
    config,
  };
}

export function updateSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_SCHEMA_PATH,
    path,
    value,
  };
}

export function updateUiSchemaByPath(path, value) {
  return {
    type: CURRENT_UPDATE_UI_SCHEMA_PATH,
    path,
    value,
  };
}

export function updateByPath(path, value) {
  return {
    type: CURRENT_UPDATE_PATH,
    path,
    value,
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
    path,
  };
}

export function addProperty(path, key) {
  return {
    type: ADD_PROPERTY,
    path,
    key,
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
      notification.warning({
        description: "Make sure that the new id is different and not empty",
      });
      return;
    }

    if (newName.indexOf(" ") >= 0) {
      notification.warning({ description: "An id cannot contain spaces" });
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
      notification.error({
        description: "The id should be unique, this name already exists",
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
        uiSchema: [...uiPath, newName],
      })
    );
  };
}

export function createNotificationCategory(category) {
  return {
    type: CREATE_NOTIFICATION_GROUP,
    path: ["config", "config", "notifications", "actions", category],
  };
}

export function createNewNotification(category) {
  return function(dispatch, getState) {
    const valuesPath = [
      "config",
      "config",
      "notifications",
      "actions",
      category,
    ];

    let notifications = fromJS(getState().schemaWizard.getIn(valuesPath, []));
    notifications = notifications.push(fromJS({}));

    dispatch(
      addNewNotification({
        path: valuesPath,
        item: notifications,
        category,
        index: notifications.size - 1,
      })
    );

    return notifications.size - 1;
  };
}

export function removeNotification(index, category) {
  return function(dispatch, getState) {
    const path = ["config", "config", "notifications", "actions", category];

    let notification = getState().schemaWizard.getIn(path);

    let newNotification = notification.delete(index);
    dispatch(deleteNotification({ path, notification: newNotification }));
    const pathname = getState().router.location.pathname;
    dispatch(push(pathname.split(`/${index}`)[0]));
  };
}

export function updateNotificationData(data, index, category) {
  return function(dispatch) {
    const valuesPath = [
      "config",
      "config",
      "notifications",
      "actions",
      category,
      index,
    ];

    dispatch(updateNotification({ path: valuesPath, value: fromJS(data) }));
  };
}

export function saveSchemaChanges() {
  return function(dispatch, getState) {
    const state = getState();
    const config = state.schemaWizard.get("config");
    const pathname = state.router.location.pathname;
    const sendData = {
      deposit_schema: state.schemaWizard.getIn(["current", "schema"]).toJS(),
      deposit_options: state.schemaWizard.getIn(["current", "uiSchema"]).toJS(),
      ...config.toJS(),
    };

    // check if there is no name or version
    // these fields are required for the schema to be created or updated
    if (
      !config.get("name") ||
      !config.get("version") ||
      !config.get("fullname")
    ) {
      notification.warning({
        description: "schema name fullname and version are required",
        message: "Missing information",
      });
      return;
    }

    // check whether there are changes to the deposit schema
    const isSchemaUpdated = !state.schemaWizard
      .getIn(["current", "schema"])
      .isSubset(state.schemaWizard.getIn(["initial", "schema"]));
    // check whether there are changes to the config object
    const isConfigVersionUpdated =
      config.get("version") != state.schemaWizard.get("initialConfig").version;

    if (isSchemaUpdated && !isConfigVersionUpdated) {
      notification.warning({
        message: "These changes require new version",
        description: "please make sure to update the version of the schema",
      });
      return;
    }

    if (pathname.startsWith(CMS_NEW) || isSchemaUpdated) {
      return axios
        .post("/api/jsonschemas", sendData)
        .then(res => {
          const { deposit_options, deposit_schema, ...configs } = res.data;
          configs.config = merge(configs.config, NOTIFICATIONS);
          dispatch(
            schemaInit(
              "Schema Name",
              { schema: deposit_schema, uiSchema: deposit_options },
              configs
            )
          );
          notification.success({
            message: "New schema created",
            description: "schema successfully created",
          });
          dispatch(updateDepositGroups());
          dispatch(
            push(`/admin/${config.get("name")}/${config.get("version")}`)
          );
        })
        .catch(err => {
          let errorHeading, errorMessage;
          if (typeof err.response.data.message === "object") {
            let errMsg = Object.entries(err.response.data.message);
            errorHeading = errMsg[0][0];
            errorMessage = errMsg[0][1][0];
          } else {
            errorHeading = "Schema Creation";
            errorMessage =
              err.response.data.message ||
              "Error while creating, please try again";
          }
          notification.error({
            message: errorHeading,
            description: errorMessage,
          });
        });
    }

    return axios
      .put(
        `/api/jsonschemas/${config.get("name")}/${config.get("version")}`,
        sendData
      )
      .then(() =>
        notification.success({
          message: "Schema Updated",
          description: "changes successfully applied",
        })
      )
      .catch(() =>
        notification.error({
          message: "Schema Updates",
          description: "Error while saving, please try again",
        })
      );
  };
}

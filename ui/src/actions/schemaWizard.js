import axios from "axios";

import exampleSchemas from "../components/schemas/static/example1";
import {
  slugify,
  _initSchemaStructure,
  _addSchemaToLocalStorage
} from "../components/cms/utils";

const SCHEMA_REST_URL = path => `/api/schemas${path}`;

export const LIST_UPDATE = "LIST_UPDATE";

export const ADD_PROPERTY = "ADD_PROPERTY";
export const ADD_PROPERTY_INIT = "ADD_PROPERTY_INIT";

export const CREATE_MODE_ENABLE = "CREATE_MODE_ENABLE";

export const PROPERTY_SELECT = "PROPERTY_SELECT";

export const SCHEMA_INIT = "SCHEMA_INIT";

export const CURRENT_UPDATE_PATH = "CURRENT_UPDATE_PATH";
export const CURRENT_UPDATE_SCHEMA_PATH = "CURRENT_UPDATE_SCHEMA_PATH";
export const CURRENT_UPDATE_UI_SCHEMA_PATH = "CURRENT_UPDATE_UI_SCHEMA_PATH";

export function schemaInit(id) {
  return {
    type: SCHEMA_INIT,
    id
  };
}

export function listUpdate(items) {
  return {
    type: LIST_UPDATE,
    items
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

export function getSchemas() {
  return function(dispatch) {
    // dispatch(schemasListRequest());

    let availableSchemas = localStorage.getItem("availableSchemas");
    availableSchemas = JSON.parse(availableSchemas);

    console.log("availableSchema::", availableSchemas);
    // let uri = SCHEMA_REST_URL("");

    dispatch(listUpdate({}));
  };
}

export function createContentType(content_type) {
  return function(dispatch) {
    // dispatch(schemasListRequest());

    let name = content_type.formData.name;
    let description = content_type.formData.description;
    const _id = slugify(Math.random().toString() + "_" + name);

    _initSchemaStructure(name, description);
    let availableSchemas = _addSchemaToLocalStorage(_id, name, description);
    console.log("availableSchema::", availableSchemas);

    // let uri = SCHEMA_REST_URL("");

    dispatch(listUpdate(availableSchemas));
  };
}

export function selectContentType(id) {
  return function(dispatch) {
    // dispatch(schemasListRequest());

    let availableSchemas = localStorage.getItem("availableSchemas") || "{}";
    availableSchemas = JSON.parse(availableSchemas);

    if (id in availableSchemas) dispatch(schemaInit(id));
    // console.log("select::", availableSchemas[id])
    else console.log("select::", `ERROR: Schema '${id}' does not exists`);

    // dispatch(listUpdate(availableSchemas));
  };
}

export function selectFieldType(path, change) {
  return function(dispatch, getState) {
    // const pathToChange = propKey ? [...path, propKey] : path;

    dispatch(updateByPath(path, change));
  };
}
export function updateCurrentSchemaWithField(schema) {
  return function(dispatch, getState) {
    let state = getState().schemaWizard;
    let propKey = state.getIn(["field", "propKey"]);
    let path = state.getIn(["field", "path"]).toJS();

    const pathToChange = propKey ? [...path, propKey] : path;
    console.log("prop::::", propKey, path, pathToChange);
    dispatch(updateSchemaByPath(pathToChange, schema));
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

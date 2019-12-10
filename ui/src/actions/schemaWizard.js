import axios from "axios";
import { replace } from "react-router-redux";

import { slugify, _initSchemaStructure } from "../components/cms/utils";

export const LIST_UPDATE = "LIST_UPDATE";

export const ADD_PROPERTY = "ADD_PROPERTY";
export const ADD_PROPERTY_INIT = "ADD_PROPERTY_INIT";

export const CREATE_MODE_ENABLE = "CREATE_MODE_ENABLE";

export const PROPERTY_SELECT = "PROPERTY_SELECT";

export const SCHEMA_INIT = "SCHEMA_INIT";
export const SCHEMA_ERROR = "SCHEMA_ERROR";

export const CURRENT_UPDATE_PATH = "CURRENT_UPDATE_PATH";
export const CURRENT_UPDATE_SCHEMA_PATH = "CURRENT_UPDATE_SCHEMA_PATH";
export const CURRENT_UPDATE_UI_SCHEMA_PATH = "CURRENT_UPDATE_UI_SCHEMA_PATH";

export function schemaError(error) {
  return {
    type: SCHEMA_ERROR,
    payload: error
  };
}

export function schemaInit(id, data) {
  return {
    type: SCHEMA_INIT,
    id,
    data
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
    axios
      .get("/api/jsonschemas?resolve=1")
      .then(resp => {
        let schemas = resp.data;
        let _schemas = {};
        schemas.map(schema => {
          _schemas[schema.name] = {
            [schema.version]: schema
          };
        });

        dispatch(listUpdate(_schemas));
      })
      .catch(err => {
        dispatch(schemaError(err));
      });
  };
}

export function getSchema(name, version = null) {
  let schemaLink;
  if (version) schemaLink = `/api/jsonschemas/${name}/${version}?resolve=1`;
  else schemaLink = `/api/jsonschemas/${name}?resolve=1`;

  return function(dispatch) {
    axios
      .get(schemaLink)
      .then(resp => {
        let schema = resp.data;
        let { id, version, deposit_schema, deposit_options } = schema;

        if (deposit_schema && deposit_options)
          dispatch(
            schemaInit(
              { id, version },
              { schema: deposit_schema, uiSchema: deposit_options }
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
    let name = content_type.formData.name;
    let description = content_type.formData.description;
    const _id = slugify(Math.random().toString() + "_" + name);

    dispatch(schemaInit({ id: _id }, _initSchemaStructure(name, description)));
    dispatch(replace("/cms/edit"));
  };
}

export function selectContentType(id, version) {
  return function(dispatch, getState) {
    let state = getState();
    let data = state.schemaWizard.getIn(["list", id]);

    if (data && data[version]) {
      let { deposit_schema, deposit_options } = data[version];

      if (deposit_schema && deposit_options)
        dispatch(
          schemaInit(
            { id, version },
            { schema: deposit_schema, uiSchema: deposit_options }
          )
        );
      dispatch(replace("/cms/edit"));
    }
  };
}

export function fetchAndSelectContentType(id, version) {
  return function(dispatch, getState) {
    // dispatch(schemasListRequest());
    let state = getState();
    let data = state.schemaWizard.getIn(["list", id]);

    if (data && data[version]) {
      let { deposit_schema, deposit_options } = data[version];

      if (deposit_schema && deposit_options)
        dispatch(
          schemaInit(
            { id, version },
            { schema: deposit_schema, uiSchema: deposit_options }
          )
        );
      dispatch(replace("/cms/edit"));
    }
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

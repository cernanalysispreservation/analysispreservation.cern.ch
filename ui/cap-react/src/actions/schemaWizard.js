import axios from "axios";
import { push } from "connected-react-router";
import cogoToast from "cogo-toast";
import { slugify, _initSchemaStructure } from "../components/cms/utils";

export const LIST_UPDATE = "LIST_UPDATE";

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
      .get("/api/jsonschemas")
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

export function initSchemaWizard(data) {
  return function(dispatch) {
    const {  id, deposit_schema, deposit_options, ...configs } = data;

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

    dispatch(schemaInit(_id, _initSchemaStructure(name, description), {fullname: name}));
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
    let schema = getState()
      .schemaWizard.getIn(["current", "schema"])
      .toJS();

    let uiSchema = getState()
      .schemaWizard.getIn(["current", "uiSchema"])
      .toJS();

    const path = item.path;
    const uiPath = item.uiPath;

    // ********* schema **********

    let itemToDelete = path.pop();
    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    itemToDelete = itemToDelete === "items" ? path.pop() : itemToDelete;

    // shallow copy schema object in order to navigate through the object
    // but the changes will reflect to the original one --> schema
    let tempSchema = Object.assign({}, schema);

    // schema update
    for (let p in path) {
      tempSchema = tempSchema[path[p]];
    }
    delete tempSchema[itemToDelete];

    // ********* uiSchema **********

    if (uiPath.length === 1) {
      // remove from the uiSchema
      delete uiSchema[uiPath[0]];
      // update the uiOrder array
      uiSchema["ui:order"] = uiSchema["ui:order"].filter(
        item => item !== uiPath[0]
      );
    } else {
      let tempUiSchema = Object.assign({}, uiSchema);
      const uiItemToDelete = uiPath.pop();
      for (let i in uiPath) {
        tempUiSchema = tempUiSchema[uiPath[i]];
      }
      // remove from the uiSchema
      delete tempUiSchema[uiItemToDelete];
      // update the uiOrder array
      tempUiSchema["ui:order"] = tempUiSchema["ui:order"].filter(
        item => item !== uiItemToDelete
      );
    }

    // ********* update changes **********
    dispatch(updateByPath({ schema: [], uiSchema: [] }, { schema, uiSchema }));
    dispatch(enableCreateMode());
  };
}

// update the id field of a property
export function renameIdByPath(item, newName) {
  return function(dispatch, getState) {
    let schema = getState()
      .schemaWizard.getIn(["current", "schema"])
      .toJS();

    let uiSchema = getState()
      .schemaWizard.getIn(["current", "uiSchema"])
      .toJS();

    const path = item.path;
    const uiPath = item.uiPath;

    // ********* schema **********

    let itemToDelete = path.pop();
    // if the last item is items then pop again since it is an array, in order to fetch the proper id
    itemToDelete = itemToDelete === "items" ? path.pop() : itemToDelete;

    if (newName === itemToDelete || newName === "") return;

    // shallow copy schema object in order to navigate through the object
    // but the changes will reflect to the original one --> schema
    let tempSchema = Object.assign({}, schema);

    // schema update
    for (let p in path) {
      tempSchema = tempSchema[path[p]];
    }

    let keys = Object.keys(tempSchema);
    if (keys.includes(newName)) {
      cogoToast.error("The id should be unique, this name already exists", {
        position: "top-center",
        bar: { size: "0" },
        hideAfter: 3
      });
      return;
    }

    tempSchema[newName] = tempSchema[itemToDelete];

    delete tempSchema[itemToDelete];

    // ********* uiSchema **********

    if (uiPath.length === 1) {
      // remove from the uiSchema
      uiSchema[newName] = uiSchema[uiPath[0]];
      // update the uiOrder array
      let pos = uiSchema["ui:order"].indexOf(uiPath[0]);

      if (pos > -1) {
        uiSchema["ui:order"][pos] = newName;
      }
      delete uiSchema[uiPath[0]];
    } else {
      let tempUiSchema = Object.assign({}, uiSchema);
      const uiItemToDelete = uiPath.pop();

      for (let i in uiPath) {
        tempUiSchema = tempUiSchema[uiPath[i]];
      }

      if (!tempUiSchema["ui:order"]) {
        tempUiSchema["ui:order"] = [];
      }
      // update the uiOrder array
      let pos = tempUiSchema["ui:order"].indexOf(uiItemToDelete);
      if (pos > -1) {
        tempUiSchema["ui:order"][pos] = newName;
      }

      if (tempUiSchema[uiItemToDelete]) {
        tempUiSchema[newName] = tempUiSchema[uiItemToDelete];
        delete tempUiSchema[uiItemToDelete];
      }
      // remove from the uiSchema
    }

    // ********* update changes **********
    dispatch(updateByPath({ schema: [], uiSchema: [] }, { schema, uiSchema }));
    dispatch(enableCreateMode());
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

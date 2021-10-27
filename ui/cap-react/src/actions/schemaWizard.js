import axios from "axios";
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

export function saveSchemaChanges() {
  return function(dispatch, getState) {
    const state = getState();
    const config = state.schemaWizard.get("config");
    const sendData = {
      deposit_schema: state.schemaWizard.getIn(["current", "schema"]).toJS(),
      deposit_options: state.schemaWizard.getIn(["current", "uiSchema"]).toJS(),
      ...config
    };
    let { name, version, fullname } = config;

    // check if there is no name or version
    // these fields are required for the schema to be created or updated
    if (!name || !version || !fullname) {
      cogoToast.warn("schema name fullname and version are required", {
        position: "top-center",
        heading: "Missing information",
        bar: { size: "0" },
        hideAfter: 5
      });
      return;
    }

    // decide whether the current edited schema exists in the groups or not
    // if yes then we should check if there is update to the schema and then
    // require update of the version. If not then we should update the uiSchema
    // updates and save
    const groups = state.auth.getIn(["currentUser", "depositGroups"]);

    // holds the value if the schema already exists in the deposit groups of the user
    const schemaAlreadyExists = groups.filter(
      item => item.get("deposit_group") === name
    ).size;

    // check whether threre are changes to the config object
    const isConfigVersionUpdated =
      version != state.schemaWizard.get("initialConfig").version;

    // check whether there are changes to the deposit schema
    const isSchemaUpdated = !state.schemaWizard
      .getIn(["current", "schema"])
      .isSubset(state.schemaWizard.getIn(["initial", "schema"]));

    if (schemaAlreadyExists && isSchemaUpdated && !isConfigVersionUpdated) {
      cogoToast.warn("please make sure to update the version of the schema", {
        position: "top-center",
        heading: "These changes require new version",
        bar: { size: "0" },
        hideAfter: 5
      });
      return;
    }

    const shouldUpdate = schemaAlreadyExists && !isSchemaUpdated;

    if (shouldUpdate) {
      axios
        .put(`/api/jsonschemas/${name}/${version}`, sendData)
        .then(() =>
          cogoToast.success("changes successfully applied", {
            position: "top-center",
            heading: "Schema Updated",
            bar: { size: "0" },
            hideAfter: 3
          })
        )
        .catch(() =>
          cogoToast.error("Error while saving, please try again", {
            position: "top-center",
            heading: "Schema Updates",
            bar: { size: "0" },
            hideAfter: 3
          })
        );
    } else {
      axios
        .post("/api/jsonschemas", sendData)
        .then(() =>
          cogoToast.success("schema successfully created", {
            position: "top-center",
            heading: "New schema created",
            bar: { size: "0" },
            hideAfter: 3
          })
        )
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
          cogoToast.error(errorMessage, {
            position: "top-center",
            heading: errorHeading,
            bar: { size: "0" },
            hideAfter: 3
          });
        });
    }
  };
}

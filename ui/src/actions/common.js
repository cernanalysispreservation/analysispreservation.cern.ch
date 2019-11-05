import axios from "axios";

export const FETCH_SCHEMA_REQUEST = "FETCH_SCHEMA_REQUEST";
export const FETCH_SCHEMA_SUCCESS = "FETCH_SCHEMA_SUCCESS";
export const FETCH_SCHEMA_ERROR = "FETCH_SCHEMA_ERROR";

// TOFIX REMOVE AND ADD TO LOCALSTORAGE
export const fetchSchemaRequest = () => ({ type: FETCH_SCHEMA_REQUEST });
export const fetchSchemaSuccess = schema => ({
  type: FETCH_SCHEMA_SUCCESS,
  schema
});
export const fetchSchemaError = error => ({ type: FETCH_SCHEMA_ERROR, error });

let getLocation = function(href) {
  let l = document.createElement("a");
  l.href = href;
  return l;
};

export function fetchAndAssignSchema(
  schemaURL = null,
  schemaID = null,
  schemaVersion = "-v0.0.1"
) {
  return dispatch => {
    let _schemaId, _schemaURL, _schemaApiUrlPath, _uiSchemaApiUrlPath;

    if (schemaURL) {
      _schemaURL = getLocation(schemaURL);

      let schemaUrlPath = _schemaURL.pathname;
      let uiSchemaUrlPath = schemaUrlPath.startsWith("/schemas/records/")
        ? schemaUrlPath.replace(
            "/schemas/records/",
            "/schemas/options/deposits/records/"
          )
        : schemaUrlPath.replace(
            "/schemas/deposits/",
            "/schemas/options/deposits/"
          );

      _schemaApiUrlPath = `/api${schemaUrlPath}`;
      _uiSchemaApiUrlPath = `/api${uiSchemaUrlPath}`;

      _schemaId = _schemaURL.href;
    } else if (schemaID) {
      _schemaApiUrlPath = `/api/schemas/deposits/records/${schemaID}${schemaVersion}.json`;
      _uiSchemaApiUrlPath = `/api/schemas/options/deposits/records/${schemaID}${schemaVersion}.json`;
      _schemaId = `https://analysispreservation.cern.ch${_schemaApiUrlPath}`;
    }

    if (_schemaApiUrlPath && _uiSchemaApiUrlPath && _schemaId) {
      dispatch(fetchSchemaRequest());
      axios
        .get(_schemaApiUrlPath)
        .then(response => {
          let schema = response.data;
          axios
            .get(_uiSchemaApiUrlPath)
            .then(response => {
              let uiSchema = response.data;
              dispatch(
                fetchSchemaSuccess({
                  schema: schema,
                  schemaId: _schemaId,
                  uiSchema: uiSchema
                })
              );
            })
            .catch(error => {
              dispatch(fetchSchemaError(error.response));
            });
        })
        .catch(error => {
          dispatch(fetchSchemaError(error.response));
        });
    } else {
      dispatch(
        fetchSchemaError({
          message:
            "Something went wrong when fetching the schema. Please check that you are in the correct location"
        })
      );
    }
  };
}

export function fetchSchemaByNameVersion(name = null) {
  return dispatch => {
    axios
      .get(`/api/jsonschemas/${name}`)
      .then(resp => {
        let { links, version } = resp.data;
        axios
          .get(links.deposit)
          .then(resp => {
            let schema = resp.data;
            axios
              .get(links.deposit.replace("/schemas/", "/schemas/options/"))
              .then(resp => {
                let uiSchema = resp.data;
                dispatch(
                  fetchSchemaSuccess({
                    schema: schema,
                    schemaId: { name, version },
                    uiSchema: uiSchema
                  })
                );
              })
              .catch(error => {
                dispatch(
                  fetchSchemaError({
                    message: error.response.data.message,
                    status: error.response.status,
                    statusText: error.response.statusText
                  })
                );
              });
          })
          .catch(error => {
            dispatch(
              fetchSchemaError({
                message: error.response.data.message,
                status: error.response.status,
                statusText: error.response.statusText
              })
            );
          });
      })
      .catch(error => {
        dispatch(
          fetchSchemaError({
            message: error.response.data.message,
            status: error.response.status,
            statusText: error.response.statusText
          })
        );
      });
  };
}

let _addErrors = (errors, path) => {
  errors.addError({ schema: path.schema, uiSchema: path.uiSchema });
  Object.keys(errors).map(error => {
    if (error != "__errors" && error != "addError") {
      _addErrors(errors[error], {
        schema: [...path, "properties", error],
        uiSchema: [...path, error]
      });
    }
  });
  return errors;
};
export const _validate = function(formData, errors) {
  return _addErrors(errors, { schema: [], uiSchema: [] });
};

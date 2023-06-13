export const slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const _initSchemaStructure = (
  name = "New schema",
  description = ""
) => ({
  schema: {
    title: name,
    description: description,
    type: "object",
    properties: {},
  },
  uiSchema: {},
});

export const _addSchemaToLocalStorage = (_id, name, description) => {
  let availableSchemas = localStorage.getItem("availableSchemas") || "{}";
  let newAvailableSchemas = Object.assign(availableSchemas, {
    [_id]: _initSchemaStructure(name, description),
  });

  localStorage.setItem("availableSchemas", JSON.stringify(newAvailableSchemas));

  return newAvailableSchemas;
};

let _addErrors = (errors, path) => {
  errors.addError({ schema: path.schema, uiSchema: path.uiSchema });

  Object.keys(errors).map(error => {
    if (error != "__errors" && error != "addError") {
      _addErrors(errors[error], {
        schema: [...path.schema, "properties", error],
        uiSchema: [...path.uiSchema, error],
      });
    }
  });
  return errors;
};
export const _validate = function (formData, errors) {
  return _addErrors(errors, { schema: [], uiSchema: [] });
};

export const shoudDisplayGuideLinePopUp = schema => {
  return schema.get("properties") && schema.get("properties").size === 0;
};

export const isItTheArrayField = (schema, uiSchema) => {
  return (
    schema.type === "array" && !uiSchema["ui:field"] && !uiSchema["ui:widget"]
  );
};

export const SIZE_OPTIONS = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

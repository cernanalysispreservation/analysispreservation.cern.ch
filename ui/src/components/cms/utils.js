export const slugify = text => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};

export const _initSchemaStructure = (name, description) => ({
  schema: {
    title: name,
    description: description,
    type: "object",
    properties: {}
  },
  uiSchema: {}
});

export const _addSchemaToLocalStorage = (_id, name, description) => {
  let availableSchemas = localStorage.getItem("availableSchemas") || "{}";
  let newAvailableSchemas = Object.assign(availableSchemas, {
    [_id]: _initSchemaStructure(name, description)
  });

  localStorage.setItem("availableSchemas", JSON.stringify(newAvailableSchemas));

  return newAvailableSchemas;
};

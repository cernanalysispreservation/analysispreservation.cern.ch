export const SIZE_OPTIONS = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

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

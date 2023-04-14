import { omit } from "lodash-es";

export const transformSchema = schema => {
  const schemaFieldsToRemove = [
    "_access",
    "_deposit",
    "_cap_status",
    "_buckets",
    "_files",
    "$ana_type",
    "$schema",
    "general_title",
    "_experiment",
    "_fetched_from",
    "_user_edited",
    "control_number",
    "_review",
  ];

  schema.properties = omit(schema.properties, schemaFieldsToRemove);
  schema = {
    type: schema.type,
    properties: schema.properties,
    dependencies: schema.dependencies,
  };
  return schema;
};

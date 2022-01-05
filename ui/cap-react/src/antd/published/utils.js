import { transformSchema } from "../partials/Utils/schema";

export const shouldDisplayTabButton = schemas => {
  // make the properties iterable
  const propertiesArray = Object.entries(
    transformSchema(schemas.schema).properties
  );

  // calculate how many are objects || arrays
  const allObjectsOrArrays = propertiesArray.filter(
    item => item[1].type === "object" || item[1].type === "array"
  );

  // calculate how many are strings
  const allStrings = propertiesArray.filter(item => item[1].type === "string");

  // in order to display the tabView button there are 2 criterias, either one should be true in order to display:
  // 1) all of the fields should be either objects || arrays
  // 2) not all of them should be strings
  const shouldDisplayTabViewButton =
    allObjectsOrArrays.length === propertiesArray.length ||
    allStrings.length < propertiesArray.length;

  return shouldDisplayTabViewButton;
};

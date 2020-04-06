import arrays from "./arrays";
import anyOf from "./anyOf";
import oneOf from "./oneOf";
import allOf from "./allOf";
import numbers from "./numbers";
import simple from "./simple";
import widgets from "./widgets";
import ordering from "./ordering";
import references from "./references";
import errors from "./errors";
import validation from "./validation";
import propertyDependencies from "./propertyDependencies";
import schemaDependencies from "./schemaDependencies";
import additionalProperties from "./additionalProperties";
import nullable from "./nullable";
import nullField from "./null";
import errorSchema from "./errorSchema";

import accordion from "./accordion";
import fields from "./fields";

export const samples = {
  Simple: simple,
  Arrays: arrays,
  Numbers: numbers,
  Widgets: widgets,
  Fields: fields,
  Ordering: ordering,
  References: references,
  Errors: errors,
  Validation: validation,
  "Property dependencies": propertyDependencies,
  "Schema dependencies": schemaDependencies,
  "Additional Properties": additionalProperties,
  "Any Of": anyOf,
  "One Of": oneOf,
  "All Of": allOf,
  "Null fields": nullField,
  Nullable: nullable,
  ErrorSchema: errorSchema,
  Accordion: accordion
};

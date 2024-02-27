import { initFormuleSchema } from "react-formule";
import { merge } from "lodash-es";
import store from "../../../store/configureStore";
import { updateSchemaConfig } from "../../../actions/builder";

export const SIZE_OPTIONS = {
  xsmall: 8,
  small: 12,
  medium: 16,
  large: 20,
  xlarge: 24,
};

const NOTIFICATIONS = {
  notifications: {
    actions: {
      review: [],
      publish: [],
    },
  },
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

export const initFormuleSchemaWithNotifications = (
  data = {},
  name,
  description
) => {
  data.config = merge(data.config || {}, NOTIFICATIONS);
  initFormuleSchema(data, name, description);
  /* eslint no-unused-vars: ["error", { "ignoreRestSiblings": true }]*/
  const { deposit_schema, deposit_options, ...configs } = data;
  store.dispatch(updateSchemaConfig(configs));
};

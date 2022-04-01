import { matchPath } from "react-router-dom";
import {
  DRAFT_ITEM,
  DRAFT_ITEM_EDIT,
  DRAFT_ITEM_INTEGRATIONS,
  DRAFT_ITEM_SETTINGS
} from "../../routes";

export const getSelectedMenuItem = path => {
  if (
    matchPath(path, {
      path: DRAFT_ITEM,
      exact: true
    })
  )
    return "overview";
  if (
    matchPath(path, {
      path: DRAFT_ITEM_EDIT,
      exact: true
    })
  )
    return "edit";
  if (
    matchPath(path, {
      path: DRAFT_ITEM_INTEGRATIONS,
      exact: true
    })
  )
    return "connect";
  if (
    matchPath(path, {
      path: DRAFT_ITEM_SETTINGS,
      exact: true
    })
  )
    return "settings";
};

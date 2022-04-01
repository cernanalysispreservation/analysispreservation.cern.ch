export const HOME = "/";

export const WELCOME = "/login";
export const ABOUT = "/about";
export const POLICY = "/policy";
export const SEARCH_TIPS = "/search-tips";
export const STATUS = "/status";

export const CMS = "/admin";
export const CMS_NEW = `${CMS}/new`;
export const CMS_SCHEMA_PATH = `${CMS}/:schema_name?/:schema_version?`;
export const CMS_EDIT = `${CMS_SCHEMA_PATH}/builder`;
export const CMS_NOTIFICATION = `${CMS_SCHEMA_PATH}/notifications`;
export const CMS_NOTIFICATION_CATEGORY = `${CMS_NOTIFICATION}/:category`;
export const CMS_NOTIFICATION_EDIT = `${CMS_NOTIFICATION_CATEGORY}/:id`;
export const COLLECTION_BASE = "/collection";
export const COLLECTION = `${COLLECTION_BASE}/:collection_name/:version?`;

export const DRAFTS = "/drafts";
export const DRAFT_ITEM = `${DRAFTS}/:draft_id`;
export const DRAFT_ITEM_EDIT = `${DRAFT_ITEM}/edit`;
export const DRAFT_ITEM_SETTINGS = `${DRAFT_ITEM}/settings`;
export const DRAFT_ITEM_INTEGRATIONS = `${DRAFT_ITEM}/integrations`;
export const DRAFT_ITEM_WORKFLOWS = `${DRAFT_ITEM}/workflows`;

export const PUBLISHED = "/published";
export const PUBLISHED_ITEM = `${PUBLISHED}/:id`;
export const PUBLISHED_ITEM_RUNS = `${PUBLISHED_ITEM}/runs`;
export const PUBLISHED_ITEM_RUNS_CREATE = `${PUBLISHED_ITEM_RUNS}/create`;

export const SETTINGS = "/settings";
export const SETTINGS_AUTH_CONNECT = `${SETTINGS}/auth/connect`;

export const WORKFLOWS = "/workflows";
export const CREATE = "/create";
export const CREATE_INDEX = `${CREATE}/:anatype?`;
export const SEARCH = "/search/:anatype?";

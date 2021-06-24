export const HOME = "/";

export const WELCOME = "/login";
export const ABOUT = "/about";
export const POLICY = "/policy";
export const SEARCH_TIPS = "/search-tips";
export const STATUS = "/status";

export const CMS = "/cms";
export const CMS_EDIT = `${CMS}/edit/:schema_name?/:schema_version?`;

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
export const CREATE_INDEX = "/create/:anatype?";
export const SEARCH = "/search/:anatype?";

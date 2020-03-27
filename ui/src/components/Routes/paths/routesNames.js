// home
export const HOME = "/";

// login
export const LOGIN = "/login";

// about
export const ABOUT = "/about";

// status
export const STATUS = "/status";

// cms - dynamic form builder
export const CMS = "/cms";
export const CMS_EDIT = `${CMS}/edit/:schema_name?/:schema_version?`;

// search tips
export const SEARCH_TIPS = "/search-tips";

//search
export const SEARCH = "/search";
export const DRAFT = "/drafts";

// published
export const PUBLISHED = "/published";
export const PUBLISHED_PREVIEW = `${PUBLISHED}/:id`;
export const PUBLISHED_RUNS = `${PUBLISHED_PREVIEW}/runs`;
export const PUBLISHED_RUNS_CREATE = `${PUBLISHED_RUNS}/create`;

// settings
export const SETTINGS = "/settings";
export const SETTINGS_CONNECT = `${SETTINGS}/auth/connect`;

// workflows
export const WORKFLOWS = "/workflows";
export const WORKFLOWS_CREATE = `${WORKFLOWS}/create`;
export const WORKFLOWS_ITEM = `${WORKFLOWS}/:workflow_id`;

// drafts
export const DRAFT_ITEM = `${DRAFT}/:draft_id`;
export const DRAFT_EDIT = `${DRAFT_ITEM}/edit`;
export const DRAFT_SETTINGS = `${DRAFT_ITEM}/settings`;
export const DRAFT_INTEGRATIONS = `${DRAFT_ITEM}/integrations`;
export const DRAFT_WORKFLOWS = `${DRAFT_ITEM}/integrations`;

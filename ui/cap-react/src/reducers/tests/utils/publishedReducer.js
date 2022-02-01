import { Map } from "immutable";

export const ERROR = "This is an error";
export const REVIEW = "This is my review";

export const initialState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  reviewLoading: false,
  error: null,
  files: Map({})
});
export const loadingState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: true,
  reviewLoading: false,
  error: null,
  files: Map({})
});
export const errorState = Map({
  id: null,
  data: null,
  schema: null,
  uiSchema: null,
  loading: false,
  reviewLoading: false,
  error: ERROR,
  files: Map({})
});

export const publishedSuccessState = Map({
  id: "CAP.CMS.6WKQ.PKY3",
  data: null,
  schema: {
    fullname: "CMS Statistics Questionnaire",
    name: "cms-stats-questionnaire",
    version: "0.0.2"
  },
  access: {
    "record-admin": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-read": {
      roles: ["cms-member@cern.ch"],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-update": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    }
  },
  can_review: true,
  can_update: true,
  created: "2021-08-27T07:35:35.077238+00:00",
  created_by: {
    email: "cms@inveniosoftware.org",
    profile: {}
  },
  metadata: {
    general_title: "Hello"
  },
  schemas: {
    config_reviewable: true,
    schema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      additionalProperties: false,
      properties: {},
      title: "CMS Statistics Questionnaire",
      type: "object"
    }
  },
  review: [],
  uiSchema: null,
  draft_id: "1023b92bc26e4bc3904c8640667e6600",
  status: "published",
  loading: false,
  reviewLoading: false,
  error: null,
  files: Map({}),
  labels: [],
  is_owner: false,
  experiment: "CMS",
  revision: 0,
  updated: "2021-08-27T07:35:35.077246+00:00",
  type: "record"
});
export const reviewErrorState = Map({
  id: "CAP.CMS.6WKQ.PKY3",
  data: null,
  schema: {
    fullname: "CMS Statistics Questionnaire",
    name: "cms-stats-questionnaire",
    version: "0.0.2"
  },
  access: {
    "record-admin": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-read": {
      roles: ["cms-member@cern.ch"],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-update": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    }
  },
  can_review: true,
  can_update: true,
  created: "2021-08-27T07:35:35.077238+00:00",
  created_by: {
    email: "cms@inveniosoftware.org",
    profile: {}
  },
  metadata: {
    general_title: "Hello"
  },
  schemas: {
    config_reviewable: true,
    schema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      additionalProperties: false,
      properties: {},
      title: "CMS Statistics Questionnaire",
      type: "object"
    }
  },
  review: [],
  uiSchema: null,
  draft_id: "1023b92bc26e4bc3904c8640667e6600",
  status: "published",
  loading: false,
  reviewLoading: false,
  error: null,
  files: Map({}),
  labels: [],
  is_owner: false,
  experiment: "CMS",
  revision: 0,
  updated: "2021-08-27T07:35:35.077246+00:00",
  type: "record",
  reviewError: ERROR
});
export const reviewSuccessState = Map({
  id: "CAP.CMS.6WKQ.PKY3",
  data: null,
  schema: {
    fullname: "CMS Statistics Questionnaire",
    name: "cms-stats-questionnaire",
    version: "0.0.2"
  },
  access: {
    "record-admin": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-read": {
      roles: ["cms-member@cern.ch"],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-update": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    }
  },
  can_review: true,
  can_update: true,
  created: "2021-08-27T07:35:35.077238+00:00",
  created_by: {
    email: "cms@inveniosoftware.org",
    profile: {}
  },
  metadata: {
    general_title: "Hello"
  },
  schemas: {
    config_reviewable: true,
    schema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      additionalProperties: false,
      properties: {},
      title: "CMS Statistics Questionnaire",
      type: "object"
    }
  },
  uiSchema: null,
  draft_id: "1023b92bc26e4bc3904c8640667e6600",
  status: "published",
  loading: false,
  reviewLoading: false,
  error: null,
  files: Map({}),
  labels: [],
  is_owner: false,
  experiment: "CMS",
  revision: 0,
  updated: "2021-08-27T07:35:35.077246+00:00",
  type: "record",
  review: REVIEW
});

export const publishedSuccessPayload = {
  id: "CAP.CMS.6WKQ.PKY3",
  schema: {
    fullname: "CMS Statistics Questionnaire",
    name: "cms-stats-questionnaire",
    version: "0.0.2"
  },
  access: {
    "record-admin": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-read": {
      roles: ["cms-member@cern.ch"],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    },
    "record-update": {
      roles: [],
      users: [
        {
          email: "cms@inveniosoftware.org",
          profile: {}
        }
      ]
    }
  },
  can_review: true,
  can_update: true,
  created: "2021-08-27T07:35:35.077238+00:00",
  created_by: {
    email: "cms@inveniosoftware.org",
    profile: {}
  },
  metadata: {
    general_title: "Hello"
  },
  schemas: {
    config_reviewable: true,
    schema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      additionalProperties: false,
      properties: {},
      title: "CMS Statistics Questionnaire",
      type: "object"
    }
  },
  review: [],
  draft_id: "1023b92bc26e4bc3904c8640667e6600",
  status: "published",
  loading: false,
  labels: [],
  is_owner: false,
  experiment: "CMS",
  revision: 0,
  updated: "2021-08-27T07:35:35.077246+00:00",
  type: "record",
  files: Map({})
};

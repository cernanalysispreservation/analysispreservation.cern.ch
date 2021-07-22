const BODY_METHODS = [
  { label: "draft_url", value: "draft_url" },
  { label: "published_url", value: "published_url" },
  { label: "working_url", value: "working_url" },
  { label: "submitter_email", value: "submitter_email" },
  { label: "reviewer_email", value: "reviewer_email" },
  { label: "cms_stats_committee_by_pag", value: "cms_stats_committee_by_pag" }
];

const SUBJECT_METHODS = [
  { label: "published_id", value: "published_id" },
  { label: "draft_id", value: "draft_id" },
  { label: "revision", value: "revision" },
  { label: "draft_revision", value: "draft_revision" }
];

export const getMethodsByType = type => {
  const choices = {
    Body: BODY_METHODS,
    Subject: SUBJECT_METHODS
  };

  return choices[type];
};

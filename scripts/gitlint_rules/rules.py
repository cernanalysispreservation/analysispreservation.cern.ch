from gitlint.rules import CommitRule, RuleViolation

COMMIT_SUBJECTS = [
    "alice",
    "atlas",
    "cms",
    "lhcb",
    "ui",
    "access",
    "deposits",
    "auth",
    "devops",
    "docker",
    "docs",
    "faser",
    "files",
    "fixtures",
    "global",
    "mail",
    "records",
    "repos",
    "schemas",
    "scripts",
    "search",
    "services",
    "tests",
    "workflows",
    "format",
]


class SignedOffBy(CommitRule):
    """This rule will enforce that each commit contains a "Signed-off-by" line."""  # noqa

    name = "body-requires-signed-off-by"
    id = "CAP1"

    def validate(self, commit):
        for line in commit.message.body:
            if line.startswith("Signed-off-by"):
                return

        msg = "Body does not contain a 'Signed-Off-By' line"
        return [RuleViolation(self.id, msg, line_nr=1)]


class ApprovedSubject(CommitRule):
    """Validate subject of each commit.

    This rule will enforce that each commit starts with one of the approved
    subjects, as presented in the list above.
    """

    name = "approved-subject-in-title"
    id = "CAP2"

    def validate(self, commit):
        for subject in COMMIT_SUBJECTS:
            if commit.message.title.startswith(f'{subject}: '):
                return

        msg = (
            f"Subject not approved, please start with one of: "
            f"{COMMIT_SUBJECTS}"
        )
        return [RuleViolation(self.id, msg, line_nr=1)]

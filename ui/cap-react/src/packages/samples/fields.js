module.exports = {
  schema: {
    title: "A registration form",
    description: "A simple form example.",
    type: "object",
    required: ["firstName", "lastName"],
    properties: {
      filesAccept: {
        type: "string",
        format: "data-url",
        title: "Select files from CapFiles field"
      },
      zenodo: {
        type: "object",
        properties: {},
        title: "Zenodo IdFetcher field"
      },
      orcid: {
        type: "object",
        properties: {},
        title: "ORCID IdFetcher field"
      },
      ror: {
        type: "object",
        properties: {},
        title: "ROR IdFetcher field"
      },
      idFetcher: {
        type: "object",
        properties: {},
        title: "IdFetcher field"
      },
      repo: {
        type: "string",
        title: "Repo link"
      }
    }
  },
  uiSchema: {
    filesAccept: {
      "ui:field": "CapFiles"
    },
    zenodo: {
      "ui:servicesList": [
        {
          value: "zenodo",
          label: "ZENODO"
        }
      ],
      "ui:field": "idFetcher"
    },
    orcid: {
      "ui:servicesList": [
        {
          value: "orcid",
          label: "ORCID"
        }
      ],
      "ui:field": "idFetcher"
    },
    ror: {
      "ui:servicesList": [
        {
          value: "ror",
          label: "ROR"
        }
      ],
      "ui:field": "idFetcher"
    },
    idFetcher: {
      "ui:servicesList": [
        {
          value: "ror",
          label: "ROR"
        },
        {
          value: "orcid",
          label: "ORCID"
        },
        {
          value: "zenodo",
          label: "ZENODO"
        }
      ],
      "ui:field": "idFetcher"
    },
    repo: {
      "ui:placeholder":
        "Repository/File URL. Please provide a valid Github or CERN Gitlab url",
      "ui:field": "repo",
      "ui:options": {
        type: "file",
        pattern: /(http:\/\/|https:\/\/|root:\/\/)(github\.com|gitlab\.cern\.ch|gitlab-test\.cern\.ch)?(\/.*)?$/
      }
    }
  },
  formData: {
    lastName: "Norris",
    age: 75,
    bio: "Roundhouse kicking asses since 1940",
    password: "noneed"
  }
};

export const applicationSchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "Name",
      description: "Name of application (displayed to users)."
    },
    descrition: {
      type: "string",
      title: "Description",
      description:
        "Optional. Description of the application (displayed to users)."
    },
    website_url: {
      type: "string",
      title: "Website URL",
      description: "URL of your application (displayed to users)."
    },
    redirect_uris: {
      type: "string",
      title: "URL of your application (displayed to users).",
      description:
        "One redirect URI per line. This is your application's authorization callback URLs. HTTPS must be used for all hosts except localhost (for testing purposes)."
    },
    client_type: {
      type: "string",
      title: "Description",
      description:
        "Select confidential if your application is capable of keeping the issued client secret confidential (e.g. a web application), select public if your application cannot (e.g. a browser-based JavaScript application). If you select public, your application MUST validate the redirect URI.",
      enum: ["Confidential", "Public"]
    }
  }
};

export const tokenSchema = {
  type: "object",
  title: "Personal access token",
  properties: {
    name: {
      type: "string",
      title: "Name",
      description: "Give a name to your personal access token."
    }
    // "scopes": {
    //   "type": "string",
    //   "title": "Scopes",
    //   "description": "Scopes assign permissions to your personal access token. A personal access token works just like a normal OAuth access token for authentication against the API.",
    //   "enum": [
    //     "deposit:actions",
    //     "deposit:write",
    //     "user::email"
    //   ]
    // }
  },
  required: ["name"]
};

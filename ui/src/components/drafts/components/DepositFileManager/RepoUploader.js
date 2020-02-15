import React from "react";

import Box from "grommet/components/Box";

import CleanForm from "../../form/CleanForm";

const uiSchema = {
  "ui:placeholder":
    "Repository/File URL. Please provide a valid Github or CERN Gitlab url",
  "ui:field": "repo",
  "ui:options": {
    type: "file",
    pattern: /(http:\/\/|https:\/\/|root:\/\/)(github\.com|gitlab\.cern\.ch|gitlab-test\.cern\.ch)?(\/.*)?$/
  }
};

class RepoUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: []
    };
  }

  formDataChange = data => {
    this.setState({ formData: data });
  };

  clearFormData = () => {
    this.setState({ formData: [] });
  };

  _renderRepoUpload = () => (
    <Box>
      <Box flex={true}>
        <CleanForm
          formData={this.state.formData}
          schema={{ type: "string" }}
          showErrorList={false}
          uiSchema={uiSchema}
          onChange={change => {
            this.formDataChange(change.formData);
          }}
        >
          <span />
        </CleanForm>
      </Box>
    </Box>
  );

  render() {
    return <Box flex={true}>{this._renderRepoUpload()}</Box>;
  }
}

RepoUploader.propTypes = {};

export default RepoUploader;

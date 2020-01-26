import React from "react";

import Box from "grommet/components/Box";

import HorizontalWithText from "../../../partials/HorizontalWithText";

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
    <Box pad={{ horizontal: "medium" }}>
      <HorizontalWithText
        text="Upload Repositories & Repository Files"
        background="#e8e8e8"
        color="#666"
      />
      <Box margin={{ top: "medium" }}>
        <Box flex={true}>
          <CleanForm
            formData={this.state.formData}
            schema={{ type: "string" }}
            uiSchema={uiSchema}
            onChange={change => {
              this.formDataChange(change.formData);
            }}
          >
            <span />
          </CleanForm>
        </Box>
      </Box>
    </Box>
  );

  render() {
    return (
      <Box flex={true} colorIndex="grey-4">
        {this._renderRepoUpload()}
      </Box>
    );
  }
}

RepoUploader.propTypes = {};

export default RepoUploader;

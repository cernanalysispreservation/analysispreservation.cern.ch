import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import TextInput from "grommet/components/TextInput";

import { uploadViaRepoUrl } from "../../../../../../../actions/files";

import { Box, Label } from "grommet";
import Status from "grommet/components/icons/Status";

import { StatusIcon } from "grommet/components/icons";

import { CloseIcon, TipIcon, RefreshIcon } from "grommet/components/icons/base";
import RepoActions from "./RepoActions";

// eslint-disable-next-line no-useless-escape
const regex = /(https|http):\/\/(github\.com|gitlab\.cern\.ch|gitlab-test\.cern\.ch)[:|\/]([\w]+)\/([\w\.-]+)(\.git|\/tree\/|\/-\/tree\/|\/blob\/|\/-\/blob\/|\/releases\/tag\/|\/-\/tags\/)?\/?([\w.-]+)?\/?(.+)?/;
const acceptedResources = [
  "github.com",
  "gitlab.cern.ch",
  "gitlab-test.cern.ch"
];

class RepoField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      formData: "",
      repo: null,
      repoUrl: null,
      selected: undefined,
      error: null,
      errors: null,
      loading: false,
      repoArray: null,
      filetypeEnabled: false
    };
  }

  _cleanRepo = () => {
    this.setState({
      formData: "",
      repo: null,
      error: null,
      errors: null,
      data: null
    });
  };

  _onChange = event => {
    let value = event.target.value;

    if (value == "") {
      this._cleanRepo();
      return;
    }
    try {
      let repo = value.match(regex);

      let [href, scheme, resource, owner, name, type, ref, filepath] = repo;
      if (acceptedResources.indexOf(resource) > -1 && (owner && name))
        this.setState({
          formData: value,
          repo: { href, scheme, resource, owner, name, type, ref, filepath },
          error: null,
          filetypeEnabled: filepath ? true : false
        });
      else
        this.setState({
          formData: value,
          repo: null,
          error: "Please provide a CERN Gitlab or Github URL"
        });
    } catch (err) {
      this.setState({
        formData: value,
        repo: null,
        error: "Please provide a Github or CERN Gitlab URL. URL is not correct"
      });
    }
  };

  uploadRepo = (type, webhook = null, event_type = null) => {
    let { resource, owner, name, ref, filepath = null } = this.state.repo;

    let url = `https://${resource}/${owner}/${name}`;

    if (ref) url = `${url}/tree/${ref}`;

    if (type == "file") {
      if (!ref) {
        this.setState({
          errors: {
            message: "Branch/Ref is needed to upload a file"
          },
          loading: false,
          data: null
        });
        return;
      }

      if (filepath)
        url = `${url}${filepath[0] == "/" ? filepath : "/" + filepath}`;
      else {
        this.setState({
          errors: {
            message:
              "You are trying to upload a file without filepath. Please add one above or upload the whole repository"
          },
          loading: false,
          data: null
        });
        return;
      }
    }

    this.setState({ loading: true, errors: null, data: null }, () => {
      this.props
        .uploadViaRepoUrl(this.props.id, url, webhook, event_type, {
          resource,
          owner,
          name,
          ref,
          filepath
        })
        .then(data =>
          this.setState({
            data: data.data,
            loading: false,
            errors: null,
            repo: null,
            formData: undefined
          })
        )
        .catch(error => {
          let { data } = error.error.response;

          this.setState({ errors: data, loading: false, data: null });
        });
    });
  };

  _updateRepo = (key, value) => {
    this.setState({ repo: { ...this.state.repo, ...{ [key]: value } } });
  };

  render() {
    let parts = [
      <Box key="repoUploadInput" pad="small" direction="row">
        <Box
          flex={true}
          pad={{ horizontal: "small" }}
          direction="row"
          align="center"
          justify="between"
        >
          <Box flex={true}>
            <TextInput
              key="repoUploadInputInput"
              name="repoUploadInputInput"
              flex={true}
              value={this.state.formData}
              placeHolder={this.props.uiSchema["ui:placeholder"]}
              onDOMChange={this._onChange}
              onKeyDown={e => {
                if (event.keyCode === 13) e.preventDefault();
              }}
            />
          </Box>
          <Box
            margin={{ left: "small" }}
            onClick={this._cleanRepo}
            flex={false}
          >
            <CloseIcon size="xsmall" />
          </Box>
        </Box>
      </Box>
    ];

    if (this.state.error) {
      parts.push(
        <Box
          pad={{ between: "small", horizontal: "small" }}
          margin="small"
          key="error"
          separator="all"
          align="center"
          direction="row"
        >
          <Status size="small" value="critical" />
          <Box>{this.state.error}</Box>
        </Box>
      );
    } else if (this.state.repo) {
      parts.push(
        <RepoActions
          repo={this.state.repo}
          uploadRepo={this.uploadRepo}
          updateRepo={this._updateRepo}
        />
      );
    }

    let _message = {};
    if (this.state.loading)
      _message = {
        status: "disabled",
        message: "Creating task to upload repository/file..."
      };
    else if (this.state.errors) {
      _message = {
        status: "critical",
        message: `${this.state.errors.message ||
          "Something happened when creating the upload task"}`
      };
    } else if (this.state.data) {
      _message = {
        status: "ok",
        message:
          "Upload repository/file task was successfully created. It will show up on the file list on the right when the background task is finished."
      };
    }

    if (_message.status)
      parts.splice(
        1,
        0,
        <Box
          pad={{ horizontal: "small" }}
          margin="small"
          separator="all"
          key="message"
        >
          <Box
            margin={{ vertical: "small" }}
            direction="row"
            wrap={false}
            pad={{ between: "small" }}
          >
            <StatusIcon size="small" value={_message.status} />
            <Label size="small">{_message.message}</Label>
          </Box>
          {_message.status == "critical" &&
            _message.message.indexOf("you don't have access") > -1 && (
              <Box
                margin={{ bottom: "small" }}
                colorIndex="light-2"
                direction="row"
                wrap="false"
                pad={{
                  between: "small",
                  horizontal: "small",
                  vertical: "small"
                }}
                align="center"
              >
                <TipIcon size="small" />
                <span>
                  It is possible that we don't not have permission to fetch the
                  repository/file. Please connect your Github/CERN Gitlab
                  account with your CAP account to give us permission to fetch
                  it. This can be done from your profile settings page{" "}
                  <a href="/settings#integrations" target="_blank">
                    here
                  </a>{" "}
                </span>
              </Box>
            )}
          {_message.status == "ok" && (
            <Box
              margin={{ bottom: "small" }}
              colorIndex="light-2"
              direction="row"
              wrap="false"
              pad={{
                between: "small",
                horizontal: "small",
                vertical: "small"
              }}
              align="center"
            >
              <TipIcon size="small" />
              <span>
                <strong>BETA</strong> You might need to refresh manually the
                list from the <RefreshIcon size="xsmall" /> button on the right
              </span>
            </Box>
          )}
        </Box>
      );

    return <Box flex={false}>{parts}</Box>;
  }
}

RepoField.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  uploadViaRepoUrl: PropTypes.func,
  id: PropTypes.string
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadViaRepoUrl: (id, url, type, download, webhook, info) =>
      dispatch(uploadViaRepoUrl(id, url, type, download, webhook, info))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoField);

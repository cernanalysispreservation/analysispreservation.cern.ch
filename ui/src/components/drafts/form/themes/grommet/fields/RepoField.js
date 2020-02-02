import React from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";

import TextInput from "grommet/components/TextInput";
const GitUrlParse = require("git-url-parse");

import { uploadViaRepoUrl } from "../../../../../../actions/files";

import { Box, Label, Anchor } from "grommet";
import Status from "grommet/components/icons/Status";
import { FaGithub, FaGitlab } from "react-icons/fa";
import { StatusIcon } from "grommet/components/icons";

class RepoField extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      formData: undefined,
      repo: null,
      selected: undefined,
      error: null,
      errors: null,
      loading: false
    };
  }

  _saveSelection = ({ option }) => {
    this.setState({ selected: option.label }, () =>
      this.props.onChange(option.value)
    );
  };

  _onChange = event => {
    let value = event.target.value;

    if (value == "") this.setState({ repo: null, error: null });
    try {
      let repo = GitUrlParse(value);
      let { resource, owner, name, href } = repo;

      if (
        ["github.com", "gitlab.cern.ch", "gitlab-test.cern.ch"].indexOf(
          resource
        ) > -1 &&
        (owner && name)
      )
        this.setState({ repo, error: null });
      else
        this.setState({
          repo: {},
          error: "Please provide a CERN Gitlab or Github URL"
        });
    } catch (err) {
      this.setState({
        repo: {},
        error: "Please provide a CERN Gitlab or Github URL"
      });
    }
  };

  uploadRepo = (type, download, webhook) => {
    this.setState({ loading: true, errors: null, data: null }, () => {
      this.props
        .uploadViaRepoUrl(
          this.props.id,
          this.state.repo.href,
          type,
          download,
          webhook
        )
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

  render() {
    let parts = [
      <TextInput
        key="text"
        name="item-1"
        value={this.state.formData}
        placeHolder={this.props.uiSchema["ui:placeholder"]}
        onDOMChange={this._onChange}
      />
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
      let { resource, owner, name, filepath, href } = this.state.repo || {};

      parts.push(
        <Box
          flex={true}
          key="info"
          direction="row"
          pad={{ horizontal: "medium", vertical: "small" }}
          colorIndex="light-2"
          justify="between"
          align="center"
        >
          <Box
            flex={false}
            pad={{ between: "medium" }}
            direction="row"
            justify="center"
            align="center"
          >
            {resource == "github.com" ? (
              <Box
                direction="column"
                pad={{ between: "small" }}
                justify="center"
                align="center"
              >
                <FaGithub size="24" />
                <Label size="small">Github</Label>
              </Box>
            ) : (
              <Box
                direction="column"
                pad={{ between: "small" }}
                justify="center"
                align="center"
              >
                <FaGitlab size="24" />
                <Label size="small">CERN Gitlab</Label>
              </Box>
            )}
            <Box>
              <Box size={{ width: "small" }} style={{ wordBreak: "break-all" }}>
                <Anchor path={href} label={`${owner}/${name}`} />
              </Box>
              <Box>
                {filepath ? (
                  <Box size="small" flex={true}>
                    <span>
                      You are ready to upload file <strong>{filepath}</strong>{" "}
                      from the above repo
                    </span>
                  </Box>
                ) : (
                  <Box size="small" flex={true}>
                    Upload a snapshot or connect it with your workspace to
                    preserve future changes automatically
                  </Box>
                )}
              </Box>
            </Box>
          </Box>

          <Box>
            {filepath ? (
              <Box>
                <Box
                  onClick={() => this.uploadRepo("file", true, false)}
                  colorIndex="brand"
                  style={{ padding: "5px" }}
                >
                  Upload file snapshot
                </Box>
              </Box>
            ) : (
              <Box flex={true} align="end" pad={{ between: "small" }}>
                <Box
                  onClick={() => this.uploadRepo("repo", true, false)}
                  colorIndex="neutral-1"
                  style={{ padding: "5px", wordWrap: "nowrap" }}
                  flex={true}
                >
                  Upload snapshot
                </Box>
                <Box
                  onClick={() => this.uploadRepo("repo", false, true)}
                  colorIndex="neutral-1-t"
                  style={{ padding: "5px", wordWrap: "nowrap" }}
                  flex={true}
                >
                  Connect repo
                </Box>
                <Box
                  onClick={() => this.uploadRepo("repo", true, true)}
                  colorIndex="brand"
                  style={{ padding: "5px", wordWrap: "nowrap" }}
                  flex={true}
                >
                  Upload snapshot & Connect
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      );
    }

    let _message = {};
    if (this.state.loading)
      _message = {
        status: "disabled",
        message: "Creating task to upload repo.."
      };
    else if (this.state.errors) {
      _message = {
        status: "critical",
        message: `${this.state.errors.message}`
      };
    } else if (this.state.data) {
      _message = {
        status: "ok",
        message: "Upload repository task was succesfully created"
      };
    }

    if (_message.status)
      parts.push(
        <Box
          pad={{ between: "small", horizontal: "small" }}
          margin="small"
          separator="all"
          direction="row"
          key="message"
        >
          <StatusIcon size="small" value={_message.status} />
          <Label size="small">{_message.message}</Label>
        </Box>
      );

    parts.push(
      <Box
        key="help"
        direction="row"
        pad="small"
        justify="center"
        align="center"
      >
        <Box justify="center" align="center" pad={{ horizontal: "small" }}>
          <span>
            <strong>Attach</strong> snapshot of a <strong>repository</strong> or
            a specific <strong>repository file</strong>.
          </span>
        </Box>
        <Box justify="center" align="center" pad={{ horizontal: "small" }}>
          <span>
            <strong>Connect</strong> a repo to this workspace -{" "}
            <strong>preserve changes automatically</strong>
          </span>
        </Box>
      </Box>
    );

    return parts;
  }
}

RepoField.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.array
};

function mapStateToProps(state) {
  return {
    id: state.draftItem.get("id")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    uploadViaRepoUrl: (id, url, type, download, webhook) =>
      dispatch(uploadViaRepoUrl(id, url, type, download, webhook))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RepoField);

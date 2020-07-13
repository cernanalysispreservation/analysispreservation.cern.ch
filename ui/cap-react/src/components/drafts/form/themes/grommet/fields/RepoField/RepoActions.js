import React from "react";
import PropTypes from "prop-types";

import { Box, Label, Heading, Paragraph } from "grommet";
import { FaGithub, FaGitlab } from "react-icons/fa";
import { DownloadIcon } from "grommet/components/icons";
import ConnectIcon from "grommet/components/icons/base/Connect";
import Notification from "../../../../../../partials/Notification";

import EditableField from "../../../../../../partials/EditableField";
import RepoAction from "./RepoAction";

class RepoActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      formData: undefined,
      repo: null,
      repoUrl: null,
      selected: undefined,
      error: null,
      errors: null,
      loading: false,
      repoArray: null,
      filetypeEnabled: props.repo && props.repo.filepath
    };
  }

  renderResourceIcon = resource => {
    const github = (
      <Box
        margin={{ right: "large" }}
        direction="row"
        pad={{ between: "small" }}
        justify="center"
        align="center"
      >
        <FaGithub size="18" />
        <Label size="small">Github</Label>
      </Box>
    );

    const gitlab = (
      <Box
        margin={{ right: "large" }}
        direction="row"
        pad={{ between: "small" }}
        justify="center"
        align="center"
      >
        <FaGitlab size="18" />
        <Label size="small">CERN Gitlab</Label>
      </Box>
    );
    const getIcon = {
      "github.com": github,
      "gitlab.cern.ch": gitlab,
      "gitlab-test.cern.ch": gitlab
    };

    return getIcon[resource];
  };

  renderActionItem(title, description, actions, help) {
    return (
      <Box
        flex={true}
        justify="between"
        align="center"
        direction="row"
        separator="all"
        pad="small"
        margin={{ bottom: "small" }}
        colorIndex="light-1"
      >
        <Box>
          <Heading tag="h4" margin="none">
            {title}
          </Heading>
          <Box>
            <Paragraph size="small" margin="none">
              {description}
            </Paragraph>
          </Box>
        </Box>
        <Box align="end">
          {actions}
          {help && (
            <Box flex={false} margin={{ top: "small" }} direction="row">
              {help}
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  render() {
    let { resource, owner, name, ref, filepath } = this.props.repo || {};
    return (
      <Box
        flex={true}
        key="info"
        direction="row"
        pad={{ horizontal: "small", vertical: "small" }}
        colorIndex="light-2"
        justify="between"
        align="center"
      >
        <Box
          flex
          pad={{ between: "medium" }}
          margin={{ right: "medium" }}
          direction="row"
          justify="center"
          align="center"
        >
          <Box flex={true}>
            <Box
              justify="start"
              pad={{
                horizontal: "small",
                vertical: "small",
                between: "medium"
              }}
            >
              <Box>
                <Heading strong tag="h5" margin="none">
                  You have selected the following repository:
                </Heading>

                <Box
                  flex={false}
                  align="start"
                  pad="small"
                  separator="all"
                  colorIndex="light-3"
                  margin={{ vertical: "small" }}
                >
                  <Box
                    direction="row"
                    wrap={false}
                    margin={{ bottom: "small" }}
                  >
                    {this.renderResourceIcon(resource)}
                    <Label size="small" announce={true} margin="none">
                      <a>
                        <strong>
                          {owner && owner != "" && name && name != ""
                            ? `${owner}/${name}`
                            : null}
                        </strong>
                      </a>
                    </Label>
                  </Box>
                  <Box pad={{ between: "small" }} direction="row">
                    <Box
                      flex={false}
                      colorIndex="grey-3"
                      align="center"
                      justify="start"
                      direction="row"
                      wrap={false}
                    >
                      <Box colorIndex="grey-3" pad={{ horizontal: "small" }}>
                        Branch/Ref:
                      </Box>
                      <Box
                        colorIndex="light-1"
                        pad={{ horizontal: "small" }}
                        separator="all"
                      >
                        <a>
                          <EditableField
                            size="small"
                            value={ref && ref != "" ? ref : null}
                            emptyValue="-- ( No file path selected)"
                            onUpdate={value =>
                              this.props.updateRepo("ref", value)
                            }
                          />
                        </a>
                      </Box>
                    </Box>
                    {this.state.filetypeEnabled && (
                      <Box
                        flex={false}
                        colorIndex="grey-3"
                        align="center"
                        justify="start"
                        direction="row"
                        wrap={false}
                      >
                        <Box colorIndex="grey-3" pad={{ horizontal: "small" }}>
                          Selected filepath
                        </Box>
                        <Box
                          colorIndex="light-1"
                          pad={{ horizontal: "small" }}
                          separator="all"
                        >
                          <a>
                            <EditableField
                              size="small"
                              value={
                                filepath && filepath != "" ? filepath : null
                              }
                              emptyValue="-- ( will select default branch)"
                              onUpdate={value =>
                                this.props.updateRepo("filepath", value)
                              }
                            />
                          </a>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Paragraph size="small" margin="none">
                  If <strong>owner</strong>, <strong>branch</strong> and{" "}
                  <strong>ref</strong> are correct, click on an action to
                  connect it to your workspace, else edit the information from
                  the URL input or do it manually from the above box
                </Paragraph>
              </Box>
            </Box>

            <Box pad={{ horizontal: "small" }}>
              <Heading strong tag="h5" margin={{ bottom: "small" }}>
                Select action:
              </Heading>
              {this.state.filetypeEnabled
                ? this.renderActionItem(
                    "Upload single file",
                    <span>
                      Upload and preserve the current snapshot of a{" "}
                      <strong>file</strong>
                    </span>,
                    <RepoAction
                      icon={<DownloadIcon size="xsmall" />}
                      onClick={() => this.props.uploadRepo("file")}
                      text="Upload"
                    />
                  )
                : [
                    this.renderActionItem(
                      "Upload snapshot of repository",
                      <span>
                        Upload and preserve the current snapshot of a repository
                        on a <strong>branch</strong>,{" "}
                        <strong>release/tag</strong> or <strong>ref</strong>
                      </span>,
                      <RepoAction
                        icon={<DownloadIcon size="xsmall" />}
                        onClick={() => this.props.uploadRepo("repo", false)}
                        text="Upload"
                      />
                    ),
                    this.renderActionItem(
                      "Automatically Upload on release",
                      <Box>
                        <span>
                          Create a webhook and give us permission to
                          automatically upload a snapshot of a repository, when
                          a <strong>new version is released</strong> or a{" "}
                          <strong>tag</strong> is created
                        </span>
                        <Box margin={{ vertical: "small" }}>
                          <Notification
                            padding="0 5px"
                            text="Only owners or accounts with write access to the
                          repository are allowed to do this"
                          />
                        </Box>
                        {/* <Box colorIndex="light-2" style={{ padding: "3px" }}>
                          ** Only owners or accounts with write access to the
                          repository are allowed to do this **
                        </Box> */}
                      </Box>,
                      <RepoAction
                        icon={<ConnectIcon size="xsmall" />}
                        onClick={() =>
                          this.props.uploadRepo("repo", true, "release")
                        }
                        text="Upload on release"
                      />
                    ),
                    this.renderActionItem(
                      "Automatically Upload on push event",
                      <Box>
                        <span>
                          Create a webhook and give us permission to
                          automatically upload a snapshot of a repository, when
                          a <strong>push event</strong> takes place
                        </span>
                        <Box margin={{ vertical: "small" }}>
                          <Notification
                            padding="0 5px"
                            text="Only owners or accounts with write access to the
                          repository are allowed to do this"
                          />
                        </Box>
                        {/* <Box colorIndex="light-2" style={{ padding: "3px" }}>
                          ** Only owners or accounts with write access to the
                          repository are allowed to do this **
                        </Box> */}
                      </Box>,
                      <RepoAction
                        icon={<ConnectIcon size="xsmall" />}
                        onClick={() =>
                          this.props.uploadRepo("repo", true, "push")
                        }
                        text="Upload on push"
                      />
                    )
                  ]}
              {this.state.filetypeEnabled ? (
                <Box
                  onClick={() => this.setState({ filetypeEnabled: false })}
                  pad={{ vertical: "small" }}
                >
                  <a>
                    Click here to upload the <strong>whole repository</strong>.
                  </a>
                </Box>
              ) : (
                <Box
                  onClick={() => this.setState({ filetypeEnabled: true })}
                  pad={{ vertical: "small" }}
                >
                  <a>
                    Click here if you want to upload a{" "}
                    <strong>single file</strong> from the repository.
                  </a>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
}

RepoActions.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
  updateRepo: PropTypes.func,
  uploadRepo: PropTypes.func,
  repo: PropTypes.object
};

export default RepoActions;

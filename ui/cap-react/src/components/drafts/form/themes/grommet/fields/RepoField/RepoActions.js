import React from "react";
import PropTypes from "prop-types";

import { Box, Label, Anchor, Heading, Paragraph } from "grommet";
import { FaGithub, FaGitlab } from "react-icons/fa";
import { DownloadIcon } from "grommet/components/icons";
import ConnectIcon from "grommet/components/icons/base/Connect";

import EditableField from "../../../../../../partials/EditableField";

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

  renderFileActions = () => {
    return (
      <Box>
        <Anchor icon={<DownloadIcon size="xsmall" />} onClick={() => this.props.uploadRepo("file")} flex primary>
          <Label size="small" uppercase>
            Upload file
        </Label>
        </Anchor>
      </Box>
    );
  }

  renderRepoDownloadActions = () => {
    return (
      <Box flex={true} direction="row" align="end" pad={{ between: "small" }}>
        <Anchor icon={<DownloadIcon size="xsmall" />} onClick={() => this.props.uploadRepo("repo", false)} style={{ wordWrap: "nowrap" }} flex={true} primary>
          <Label size="small" uppercase>
            Upload
        </Label>
        </Anchor>
      </Box>
    );
  }

  renderRepoConnectActions = (type) => {
    return (
      <Box flex={true} direction="row" align="end" pad={{ between: "small" }}>
        <Anchor icon={<ConnectIcon size="xsmall" />} onClick={() => this.props.uploadRepo("repo", true, type)} style={{ wordWrap: "nowrap" }} flex={true} primary>
          <Label size="small" uppercase>
            Upload on {type}
          </Label>
        </Anchor>
      </Box>
    );
  }

  renderResourceIcon = (resource) => {
    return resource == "github.com" ? (
      <Box margin={{ right: "large" }} direction="row" pad={{ between: "small" }} justify="center" align="center">
        <FaGithub size="18" />
        <Label size="small">Github</Label>
      </Box>
    ) : (
        <Box margin={{ right: "large" }} direction="row" pad={{ between: "small" }} justify="center" align="center">
          <FaGitlab size="18" />
          <Label size="small">CERN Gitlab</Label>
        </Box>
      );
  }

  renderActionItem(title, description, actions, help) {
    return (
      <Box flex={true} justify="between" align="center" direction="row" separator="all" pad="small" margin={{ bottom: "small" }} colorIndex="light-1">
        <Box flex={false}>
          <Heading tag="h4" margin="none">{title}</Heading>
          <Box size={{ width: "medium" }}>
            <Paragraph size="small" margin="none">{description}</Paragraph>
          </Box>
        </Box>
        <Box flex={false} align="end">
          {actions}
          {help && <Box flex={false} margin={{ top: "small" }} direction="row">{help}</Box>}
        </Box>
      </Box>
    );
  }

  render() {
    let { resource, owner, name, ref, filepath } = this.props.repo || {};
    console.log("ACTIONS: ", filepath)
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
              pad={{ horizontal: "small", vertical: "small", between: "medium" }}
            >
              <Box>
                <Heading strong tag="h5" margin="none">You have selected the following repository:</Heading>

                <Box flex={false} align="start" pad="small" separator="all" colorIndex="light-3" margin={{ vertical: "small" }}>
                  <Box direction="row" wrap={false} margin={{ bottom: "small" }}>
                    {this.renderResourceIcon(resource)}
                    <Label size="small" announce={true} margin="none"><a><strong>{(owner && owner != "" && name && name != "") ? `${owner}/${name}` : null}</strong></a></Label>
                  </Box>
                  <Box pad={{ between: "small" }} direction="row">
                    <Box flex={false} colorIndex="grey-3" align="center" justify="start" direction="row" wrap={false} >
                      <Box colorIndex="grey-3" pad={{ horizontal: "small" }}>Branch/Ref:</Box>
                      <Box colorIndex="light-1" pad={{ horizontal: "small" }} separator="all"><a>
                        <EditableField
                          size="small"
                          value={(ref && ref != "") ? ref : null}
                          emptyValue="-- ( will select default branch)"
                          onUpdate={(value) => this.props.updateRepo("ref", value)}/></a>
                      </Box>
                    </Box>
                    {this.state.filetypeEnabled &&
                      <Box flex={false} colorIndex="grey-3" align="center" justify="start" direction="row" wrap={false} >
                        <Box colorIndex="grey-3" pad={{ horizontal: "small" }}>Selected filepath</Box>
                        <Box colorIndex="light-1" pad={{ horizontal: "small" }} separator="all"><a>
                          <EditableField
                            size="small"
                            value={(filepath && filepath != "") ? filepath : null}
                            emptyValue="-- ( will select default branch)"
                            onUpdate={(value) => this.props.updateRepo("filepath", value)}/></a>
                            
                        </Box>
                      </Box>
                    }
                  </Box>
                </Box>
                <Paragraph size="small" margin="none">If <strong>owner</strong>, <strong>branch</strong> and <strong>ref</strong> are correct, click on an action to connect it to your workspace, else edit the information from the URL input or do it manually from the above box</Paragraph>
              </Box>
            </Box>



            <Box pad={{ horizontal: "small" }}>
              <Heading strong tag="h5" margin={{ bottom: "small" }}>Select action:</Heading>
              {this.state.filetypeEnabled ? this.renderActionItem(
                "Upload single file",
                <span>Upload and preserve current snapshot of the whole repository on a <strong>branch</strong>, <strong>release/tag</strong> or <strong>ref</strong></span>,
                this.renderFileActions()
              ) :
                [
                  this.renderActionItem(
                    "Upload snapshot of repository",
                    <span>Upload and preserve current snapshot of the whole repository on a <strong>branch</strong>, <strong>release/tag</strong> or <strong>ref</strong></span>,
                    this.renderRepoDownloadActions()
                  ),
                  this.renderActionItem(
                    "Automatically Upload on release",
                    <span>Add a webhook and automatically upload repository, when a <strong>new version is released</strong> or <strong>tag</strong> is pushed</span>,
                    this.renderRepoConnectActions("release")
                  ),
                  this.renderActionItem(
                    "Automatically Upload on push event",
                    <span>Add a webhook and automatically upload repository when a <strong>push event</strong> takes place</span>,
                    this.renderRepoConnectActions("push")
                  )
                ]
              }
              {(this.state.filetypeEnabled) ?
                <Box onClick={() => this.setState({ filetypeEnabled: false })} pad={{ vertical: "small" }}><a>Click here to upload the <strong>whole repository</strong>.</a></Box> :
                <Box onClick={() => this.setState({ filetypeEnabled: true })} pad={{ vertical: "small" }}><a>Click here if you want to upload a <strong>single file</strong> from the repository.</a></Box>
              }
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
  formData: PropTypes.object
};

export default RepoActions;

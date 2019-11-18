import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import Menu from "grommet/components/Menu";
import Button from "grommet/components/Button";
import Heading from "grommet/components/Heading";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import Image from "grommet/components/Image";
import LoginForm from "grommet/components/LoginForm";
import Label from "grommet/components/Label";
import Paragraph from "grommet/components/Paragraph";

import Spinning from "grommet/components/icons/Spinning";

import { loginLocalUser } from "../../actions/auth";
import LogIcon from "grommet/components/icons/base/Login";

import { GithubIcon } from "../drafts/form/themes/grommet/fields/components/GithubIcon";
import { GitlabIcon } from "../drafts/form/themes/grommet/fields/components/GitlabIcon";
import { ZenodoIcon } from "../drafts/form/themes/grommet/fields/components/ZenodoIcon";
import { ORCIDLogo } from "../drafts/form/themes/grommet/fields/components/ORCIDLogo";
import { RORIcon } from "../drafts/form/themes/grommet/fields/components/ROR";
import { ReanaIcon } from "../drafts/form/themes/grommet/fields/components/ReanaIcon";
import { CAPLogo } from "../drafts/form/themes/grommet/fields/components/CAP";
import platform from "../../../images/image.png";
import front from "../../../images/template.png";
import publish from "../../../images/publish.png";
import reuse from "../../../images/reuse.png";
import Database from "grommet/components/icons/base/Database";
import Refresh from "grommet/components/icons/base/Refresh";
import Group from "grommet/components/icons/base/Group";
import Question from "grommet/components/icons/base/CircleQuestion";

import "../../styles/styles.scss";

class WelcomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogin: false
    };
  }

  onFormSubmit = formData => {
    let {
      location: { state: { next: next = "/" } = {} }
    } = this.props.history;
    formData["next"] = next;

    this.props.loginLocalUser(formData);
  };

  render() {
    return (
      <Box>
        <Box full>
          <Header
            colorIndex="neutral-1"
            pad={{ vertical: "none", horizontal: "small" }}
            size="small"
            fixed
          >
            <Box flex="grow" direction="row" justify="between" align="center">
              <Box direction="row">
                <CAPLogo />
                <Title> CERN Analysis Preservation</Title>
              </Box>
              <Box direction="row" align="center">
                <Button plain label="Log in" href="/api/oauth/login/cern" />
                {process.env.NODE_ENV === "development" ? (
                  <Menu
                    dropAlign={{ top: "bottom" }}
                    icon={<LogIcon />}
                    size="small"
                    closeOnClick={false}
                  >
                    <LoginForm
                      usernameType="email"
                      defaultValues={{ username: "info@inveniosoftware.org" }}
                      onSubmit={this.onFormSubmit}
                    />
                    {this.props.authError ? (
                      <Box
                        colorIndex="critical"
                        margin={{ top: "small" }}
                        pad="small"
                      >
                        {this.props.authError}
                      </Box>
                    ) : null}
                  </Menu>
                ) : null}
              </Box>
            </Box>
          </Header>
          <Box flex justify="between" pad="small">
            <Box flex justify="between" direction="row">
              <Box flex justify="center" align="start" pad="small">
                <Box pad={{ horizontal: "medium" }}>
                  <Heading
                    strong
                    style={{
                      color: "#006996",
                      letterSpacing: "5px",
                      fontSize: "7em"
                    }}
                  >
                    CAP
                  </Heading>
                  <Heading strong style={{ letterSpacing: "3px" }}>
                    A scientific platform to{" "}
                  </Heading>
                  <Heading tag="h2" style={{ letterSpacing: "3px" }}>
                    preserve data
                  </Heading>
                  <Heading tag="h2" style={{ letterSpacing: "3px" }}>
                    disrupt knowledge
                  </Heading>
                  <Heading tag="h2" style={{ letterSpacing: "3px" }}>
                    connect scientists
                  </Heading>
                </Box>
              </Box>
              <Box flex justify="center" align="end" pad="large">
                <Image src={front} fit="contain" />
              </Box>
            </Box>
            <Box direction="row" align="center" justify="between">
              <GithubIcon />
              <GitlabIcon />
              <ZenodoIcon size="large" />
              <ORCIDLogo />
              <RORIcon />
              <ReanaIcon />
            </Box>
          </Box>
        </Box>
        <Box full direction="row">
          <Box colorIndex="neutral-1" flex>
            <Image src={front} fit="contain" />
          </Box>
          <Box flex justify="center">
            <Box
              direction="row"
              justify="center"
              align="center"
              margin={{ vertical: "large" }}
            >
              <Box direction="row" align="center">
                <Box pad={{ horizontal: "medium" }}>
                  <Database size="large" />
                </Box>
                <Box flex direction="column" pad={{ horizontal: "small" }}>
                  <Heading tag="h2">Preserve your analysis</Heading>
                  <Paragraph margin="none">
                    Researchers can save their materials (code, data, docs), and
                    enrich them with metadata from integrated services (ORCID,
                    ROR).
                  </Paragraph>
                </Box>
              </Box>
            </Box>
            <Box
              direction="row"
              justify="center"
              align="center"
              margin={{ vertical: "large" }}
            >
              <Box direction="row" align="center" justify="center">
                <Box pad={{ horizontal: "medium" }}>
                  <Refresh size="large" />
                </Box>
                <Box flex direction="column" pad={{ horizontal: "small" }}>
                  <Heading tag="h2">Reuse</Heading>
                  <Paragraph margin="none">
                    By integrating workflows and git repositories, researchers
                    can rerun their experiments and save the results remotely,
                    in self-contained environments.
                  </Paragraph>
                </Box>
              </Box>
            </Box>
            <Box
              direction="row"
              justify="center"
              align="center"
              margin={{ vertical: "large" }}
            >
              <Box direction="row" align="center" justify="center">
                <Box pad={{ horizontal: "medium" }}>
                  <Group size="large" />
                </Box>
                <Box flex direction="column" pad={{ horizontal: "small" }}>
                  <Heading tag="h2">Collaborate</Heading>
                  <Paragraph margin="none">
                    Through CAP, researchers can give collaborators access to
                    their analyses, resulting in increased efficiency, better
                    communication and lessened duplication of work.
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box full justify="center" align="center" direction="row">
          <Box flex justify="center" align="center" colorIndex="neutral-1">
            <Heading style={{ fontSize: "4em" }} strong>
              Discover the platform
            </Heading>
          </Box>
          <Box flex align="center" justify="center">
            <Paragraph size="large">
              CERN Analysis Preservation (CAP) is a service for physicists to
              preserve and document the various materials produced in the
              process of their analyses, e.g. datasets, code, documentation, so
              that they are reusable and understandable in the future. By using
              this tool, researchers ensure these outputs are preserved and also
              findable and accessible by their (internal) collaborators.
            </Paragraph>
            <Paragraph size="large">
              CAP provides an integrated platform that allows researchers to
              preserve and document the various materials produced in the
              process of their research and experimentation (datasets, code,
              documentation) so that they are reusable and understandable in the
              future. By using this tool, researchers ensure these outputs are
              preserved, findable and accessible by their collaborators.
            </Paragraph>
          </Box>
        </Box>
        <div className="a">
          <Box
            full
            direction="row"
            justify="between"
            align="center"
            pad="medium"
          >
            <Box
              style={{
                boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)",
                background: "#FFFF",
                borderRadius: "5px"
              }}
              size={{ height: "large", width: "medium" }}
              pad="small"
              align="center"
            >
              <Label style={{ color: "#006996", fontWeight: 600 }}>01.</Label>
              <Database size="large" />
              <Box margin={{ top: "medium" }} align="center">
                <Heading strong>What can I submit</Heading>
                <Paragraph>
                  There are 10 gigabytes of storage available to submit your
                  n-tuples and output macros (for each of your individual
                  analyses).
                </Paragraph>
              </Box>
            </Box>
            <Box
              style={{
                boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)",
                background: "#FFFF",
                borderRadius: "5px"
              }}
              size={{ height: "large", width: "medium" }}
              pad="small"
              align="center"
            >
              <Label style={{ color: "#006996", fontWeight: 600 }}>02.</Label>
              <Question size="large" />
              <Box margin={{ top: "medium" }} align="center">
                <Heading strong>How can I submit</Heading>
                <Paragraph>
                  The submission forms via the user interface
                </Paragraph>
                <Paragraph>The command-line client (cap-client)</Paragraph>
                <Paragraph>The REST API (API docs)</Paragraph>
              </Box>
            </Box>
            <Box
              style={{
                boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)",
                background: "#FFFF",
                borderRadius: "5px"
              }}
              size={{ height: "large", width: "medium" }}
              pad="small"
              align="center"
            >
              <Label style={{ color: "#006996", fontWeight: 600 }}>03.</Label>
              <Group size="large" />
              <Box margin={{ top: "medium" }} align="center">
                <Heading strong>Who has access</Heading>
                <Paragraph>
                  only collaboration members have access to a collaboration’s
                  area
                </Paragraph>
                <Paragraph margin="none">
                  only a certain collaboration’s members have access to this
                  collaboration’s analyses
                </Paragraph>
                <Paragraph>
                  only members granted specific rights can see or edit a draft
                  version of an analysis
                </Paragraph>
                <Paragraph margin="none">
                  only the creator can see or edit an analysis with default
                  permission settings
                </Paragraph>
              </Box>
            </Box>
          </Box>
        </div>
      </Box>
    );
  }
}

WelcomePage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  loginLocalUser: PropTypes.func.isRequired,
  authLoading: PropTypes.bool.isRequired,
  authError: PropTypes.object,
  history: PropTypes.object
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get("isLoggedIn"),
    authLoading: state.auth.get("loading"),
    authError: state.auth.get("error")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loginLocalUser: data => dispatch(loginLocalUser(data))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WelcomePage)
);

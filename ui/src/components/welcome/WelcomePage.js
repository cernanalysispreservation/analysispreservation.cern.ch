import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import Box from "grommet/components/Box";
import Menu from "grommet/components/Menu";
import Button from "grommet/components/Button";
import Heading from "grommet/components/Heading";
import Header from "grommet/components/Header";
import Title from "grommet/components/Title";
import LoginForm from "grommet/components/LoginForm";
import Anchor from "grommet/components/Anchor";
import Paragraph from "grommet/components/Paragraph";

import { loginLocalUser } from "../../actions/auth";
import LogIcon from "grommet/components/icons/base/Login";

import { GithubIcon } from "../drafts/form/themes/grommet/fields/components/GithubIcon";
import { GitlabIcon } from "../drafts/form/themes/grommet/fields/components/GitlabIcon";
import { ZenodoIcon } from "../drafts/form/themes/grommet/fields/components/ZenodoIcon";
import { ORCIDLogo } from "../drafts/form/themes/grommet/fields/components/ORCIDLogo";
import { RORIcon } from "../drafts/form/themes/grommet/fields/components/ROR";
import { ReanaIcon } from "../drafts/form/themes/grommet/fields/components/ReanaIcon";
import { CAPLogo } from "../drafts/form/themes/grommet/fields/components/CAP";
import { ApiIcon } from "../drafts/form/themes/grommet/fields/components/Api";
import { CultureIcon } from "../drafts/form/themes/grommet/fields/components/Cultures";
import { TerminalIcon } from "../drafts/form/themes/grommet/fields/components/Terminal";
import { LhcbIcon } from "../drafts/form/themes/grommet/fields/components/Lhcb";
import { AliceIcon } from "../drafts/form/themes/grommet/fields/components/Alice";
import { AtlasIcon } from "../drafts/form/themes/grommet/fields/components/Atlas";
import { CmsIcon } from "../drafts/form/themes/grommet/fields/components/Cms";
import Database from "grommet/components/icons/base/Database";
import Refresh from "grommet/components/icons/base/Refresh";
import Group from "grommet/components/icons/base/Group";

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
        <Header
          colorIndex="neutral-1"
          pad={{ vertical: "none", horizontal: "small" }}
          size="small"
          fixed
          style={{ boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)" }}
        >
          <Box
            flex="grow"
            direction="row"
            justify="between"
            align="center"
            responsive={false}
          >
            <Box direction="row" responsive={false}>
              <CAPLogo />
              <Title> CAP</Title>
            </Box>
            <Box direction="row" align="center" responsive={false}>
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
        <Box full pad={{ vertical: "large", horizontal: "xlarge" }}>
          <Box flex align="center" justify="center">
            <Heading strong>CERN Analysis Preservation</Heading>
            <Box margin={{ top: "medium" }} size="xlarge">
              <Heading tag="h2" align="center">
                Our mission is to preserve physics analyses to facilitate their
                future reuse
              </Heading>
            </Box>
          </Box>
          <Box flex justify="center" align="center">
            <Box
              direction="row"
              align="center"
              justify="between"
              size={{ width: "xxlarge" }}
              responsive={false}
            >
              <Box align="center">
                <Heading tag="h2">Capture</Heading>
                <Database size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Collect elements needed to understand and rerun the analysis
                  </Paragraph>
                </Box>
              </Box>
              <Box align="center">
                <Heading tag="h2">Collaborate</Heading>
                <Group size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Share analysis and components with users and your
                    collaboration
                  </Paragraph>
                </Box>
              </Box>
              <Box align="center">
                <Heading tag="h2">Reuse</Heading>
                <Refresh size="medium" />
                <Box size="small">
                  <Paragraph align="center">
                    Run containerized workflows and easily reuse analysis
                    elementys
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box full justify="center" colorIndex="grey-4-a" pad="medium">
          <Box justify="center" align="center" pad="large">
            <Heading>Discover the platform</Heading>
          </Box>
          <Box flex align="center" justify="center">
            <Box size={{ width: "xxlarge" }} align="center">
              <Paragraph size="large">
                CERN Analysis Preservation (CAP) is a service for physicists to
                preserve and document the various materials produced in the
                process of their analyses, e.g. datasets, code, documentation,
                so that they are reusable and understandable in the future. By
                using this tool, researchers ensure these outputs are preserved
                and also findable and accessible by their (internal)
                collaborators.
              </Paragraph>
              <Paragraph size="large">
                CAP provides an integrated platform that allows researchers to
                preserve and document the various materials produced in the
                process of their research and experimentation (datasets, code,
                documentation) so that they are reusable and understandable in
                the future. By using this tool, researchers ensure these outputs
                are preserved, findable and accessible by their collaborators.
              </Paragraph>
            </Box>
          </Box>
        </Box>
        <Box
          full
          direction="row"
          justify="center"
          align="center"
          colorIndex="grey-4-a"
        >
          <Box
            size={{ width: "xxlarge" }}
            direction="row"
            justify="center"
            align="center"
          >
            <Box
              colorIndex="light-1"
              style={{
                boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)"
              }}
              size={{
                height: { max: "large", min: "medium" },
                width: { max: "medium", min: "small" }
              }}
              pad={{ vertical: "small" }}
              align="center"
              margin={{ horizontal: "small" }}
            >
              <Box margin={{ top: "small" }} align="center" pad="small">
                <Heading tag="h2" strong>
                  Who
                </Heading>
                <Box pad="medium">
                  <Paragraph align="center">
                    <strong>Cern members</strong>, with collaborations e-groups
                  </Paragraph>
                  <Paragraph align="center">
                    Access your <strong>collaborations dashboard</strong>
                  </Paragraph>
                  <Paragraph align="center">
                    Browse <strong>published analysis</strong> from same
                    collaboration
                  </Paragraph>
                  <Paragraph align="center">
                    Work on draft <strong>analysis created or shared</strong>{" "}
                    with you
                  </Paragraph>
                </Box>
              </Box>
            </Box>
            <Box
              colorIndex="light-1"
              style={{
                boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)"
              }}
              size={{
                height: { max: "large", min: "medium" },
                width: { max: "medium", min: "small" }
              }}
              pad={{ vertical: "small" }}
              align="center"
              margin={{ horizontal: "small", vertical: "medium" }}
            >
              <Box margin={{ top: "small" }} align="center" pad="small">
                <Heading tag="h2" strong>
                  What
                </Heading>
                <Box pad="medium">
                  <Paragraph align="center">
                    <strong>Metadata</strong> - Analysis description, wikis,
                    plots, tables
                  </Paragraph>
                  <Paragraph align="center">
                    <strong>Files</strong> - Plots, tables, formulas,
                    likelihoods
                  </Paragraph>
                  <Paragraph align="center">
                    <strong>Code</strong> - user scripts, code repositories
                  </Paragraph>
                  <Paragraph align="center">
                    <strong>Workflows</strong> - containerized images,
                    computational workflows
                  </Paragraph>
                </Box>
              </Box>
            </Box>
            <Box
              colorIndex="light-1"
              style={{
                boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)"
              }}
              pad={{ vertical: "small" }}
              size={{
                height: { max: "large", min: "medium" },
                width: { max: "medium", min: "small" }
              }}
              align="center"
              margin={{ horizontal: "small", vertical: "small" }}
            >
              <Box margin={{ top: "small" }} align="center">
                <Heading tag="h2" strong>
                  How
                </Heading>
                <Box pad="medium">
                  <Paragraph align="center">
                    There are different ways to submit analusis content,
                    depending on your....
                  </Paragraph>
                  <Paragraph align="center">
                    (1) Via the <strong>user interface:</strong> <br />
                    Through the interactive submission forms
                  </Paragraph>
                  <Paragraph align="center">
                    (2) Via the <strong>`cap-client`</strong>
                    <br />
                    by integrating it into your scripts
                  </Paragraph>
                  <Paragraph align="center">
                    (3) Via the <strong>RESTful API:</strong>
                    <br />
                    make HTTP request
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          full
          margin={{ vertical: "large" }}
          align="center"
          justify="center"
        >
          <Box align="center" margin="medium">
            <Heading>Integrations</Heading>
          </Box>
          <Box size={{ width: "xxlarge" }}>
            <Box
              responsive={false}
              direction="row"
              flex
              justify="between"
              align="center"
              pad={{ horizontal: "small" }}
            >
              <Box pad="small">
                <Heading tag="h2">Source Code</Heading>
                <Paragraph>
                  blah blahblah blahblah blahblah blahblah blahblah blahblah
                  blahblah blahblah blahblah blahblah blahblah blah blah
                  blahblah blahblah blahblah blahblah blahblah blahblah blahblah
                </Paragraph>
              </Box>
              <Box direction="row" pad="small">
                <GithubIcon size="large" />
                <GitlabIcon size="large" />
              </Box>
            </Box>
            <Box
              margin={{ vertical: "medium" }}
              flex
              direction="row"
              align="center"
              justify="between"
              pad={{ horizontal: "small" }}
              responsive={false}
            >
              <Box align="center" pad="small">
                <Box direction="row">
                  <ZenodoIcon size="large" />
                  <RORIcon />
                </Box>
                <ORCIDLogo />
              </Box>
              <Box align="end" pad="small">
                <Heading tag="h2">PIDs/FAIR data</Heading>
                <Paragraph align="end">
                  blah blahblah blahblah blahblah blahblah blahblah blahblah
                  blahblah blahblah blahblah blahblah blahblah blah blah
                  blahblah blahblah blahblah blahblah blahblah blahblah blahblah
                </Paragraph>
              </Box>
            </Box>
            <Box
              flex
              direction="row"
              align="center"
              justify="between"
              responsive={false}
              pad={{ horizontal: "small" }}
            >
              <Box pad="small">
                <Heading tag="h2">Workflows</Heading>
                <Paragraph>
                  blah blahblah blahblah blahblah blahblah blahblah blahblah
                  blahblah blahblah blahblah blahblah blahblah blah blah
                  blahblah blahblah blahblah blahblah blahblah blahblah blahblah
                </Paragraph>
              </Box>
              <Box direction="row" pad="small">
                <ReanaIcon size="large" />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box colorIndex="grey-4-a" pad="medium" align="center" justify="center">
          <Box align="center" margin="large">
            <Heading>Documentation</Heading>
          </Box>
          <Box
            margin={{ top: "large" }}
            direction="row"
            flex
            justify="between"
            pad={{ vertical: "medium" }}
            size={{ width: "xxlarge" }}
            responsive={false}
          >
            <Box>
              <Box align="center" size="small">
                <Box margin={{ bottom: "medium" }}>
                  <CultureIcon size="large" />
                </Box>
                <Heading tag="h2">User Guide</Heading>
                <Paragraph align="center">
                  Find out how you can use CAP platform to capture, preserve and
                  reuse your analysis, through user guides and stories
                </Paragraph>
                <Anchor
                  label="General Documentation"
                  href="https://cernanalysispreservation.readthedocs.io/en/latest/project.html"
                  target="_blank"
                />
              </Box>
            </Box>
            <Box>
              <Box
                align="center"
                size="small"
                margin={{ horizontal: "medium" }}
              >
                <Box margin={{ bottom: "medium" }}>
                  <TerminalIcon size="large" />
                </Box>
                <Heading tag="h2">CLI Client</Heading>
                <Paragraph align="center">
                  Interact with your analysis workspace through your scripts,
                  CI/CD and integrate preservation to you daily work
                </Paragraph>
                <Anchor
                  label="CAP-client Guide"
                  href="https://cap-client.readthedocs.io/en/latest/?badge=latest#"
                  target="_blank"
                />
              </Box>
            </Box>
            <Box>
              <Box align="center" size="small">
                <Box margin={{ bottom: "medium" }}>
                  <ApiIcon size="large" />
                </Box>
                <Heading tag="h2">RESTful API</Heading>
                <Paragraph align="center">
                  Use CAP RESTfull API to intercat with the platform through
                  HTTP request, adapted to your library needs
                </Paragraph>
                <Anchor
                  label="Swagger/OpenAPI Guide"
                  href="https://cernanalysispreservation.readthedocs.io/en/latest/api.html"
                  target="_blank"
                />
              </Box>
            </Box>
          </Box>
        </Box>
        <Box margin={{ vertical: "large" }}>
          <Box align="center">
            <Heading tag="h2">Supported by</Heading>
          </Box>
          <Box align="center">
            <Box
              direction="row"
              align="center"
              justify="center"
              size={{ width: "xxlarge" }}
              margin={{ top: "medium" }}
              responsive={false}
            >
              <Box margin="small">
                <AtlasIcon size="large" />
              </Box>
              <Box margin="small">
                <CmsIcon size="large" />
              </Box>
              <Box margin="small">
                <AliceIcon size="large" />
              </Box>
              <Box margin="small">
                <LhcbIcon size="large" />
              </Box>
            </Box>
          </Box>
        </Box>
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

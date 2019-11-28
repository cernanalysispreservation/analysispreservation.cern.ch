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
import Carousel from "grommet/components/Carousel";

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
import front from "../../../images/template.png";
import { LhcbIcon } from "../../../images/Lhcb";
import { AliceIcon } from "../../../images/Alice";
import { AtlasIcon } from "../../../images/Atlas";
import { CmsIcon } from "../../../images/Cms";
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
            style={{ boxShadow: "0px 3px 8px 1px rgba(0,0,0,0.2)" }}
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
          <Box flex justify="center" align="center">
            <Heading
              style={{
                fontSize: "4em",
                color: "#006996",
                letterSpacing: "2px"
              }}
              strong
            >
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
        <Box full>
          <Carousel>
            <Box align="center" justify="center">
              <div className="b">
                <Box
                  style={{ borderRadius: "5px", color: "#FFFF" }}
                  justify="between"
                  pad={{ vertical: "medium" }}
                  size={{ width: "xxlarge", height: "xlarge" }}
                >
                  <Box direction="row">
                    <Box flex pad={{ horizontal: "medium" }} justify="start">
                      <Heading
                        tag="h1"
                        strong
                        style={{ letterSpacing: "3px", fontSize: "7em" }}
                      >
                        Create
                      </Heading>
                      <Box>
                        <Label size="large">
                          create your analysis by providing the title and the
                          catergory
                        </Label>
                      </Box>
                    </Box>
                  </Box>
                  <Box flex pad="large" align="center" justify="center">
                    <Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Forms
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          Though CAP, users can access form templates for CERN
                          experiments (CMS, ATLAS, LHCB, ALICE) but also use a
                          dynamic form builder to customize their own forms.
                        </Paragraph>
                      </Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Drafts
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          Every analysis firstly is saved as a draft. The
                          authors can edit it as many times they want before
                          plublishing. As draft the author is the only one with
                          permission to access.
                        </Paragraph>
                      </Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Published
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          Published analysis are shared among the team members
                          but also between specific scientists inside the
                          organisation.
                        </Paragraph>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </div>
            </Box>
            <Box align="center" justify="center">
              <div className="b">
                <Box
                  style={{ borderRadius: "5px", color: "#FFFF" }}
                  justify="between"
                  pad={{ vertical: "medium" }}
                  size={{ width: "xxlarge", height: "xlarge" }}
                >
                  <Box direction="row">
                    <Box flex pad={{ horizontal: "medium" }} justify="start">
                      <Heading
                        tag="h1"
                        strong
                        style={{ letterSpacing: "3px", fontSize: "7em" }}
                      >
                        Reuse
                      </Heading>
                      <Box>
                        <Label size="large">
                          edit your analysis and provide new data anytime{" "}
                        </Label>
                      </Box>
                    </Box>
                  </Box>
                  <Box flex pad="large" align="center" justify="center">
                    <Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Integrations
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          CAP provides collaborations with services such as
                          ORCID, ZENODO, REANA, ROR
                        </Paragraph>
                      </Box>

                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Files
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          CAP provides the opportunity to upload Github/Gitlab
                          files or repositories and constantly update them{" "}
                          <strong>if</strong> and <strong>when</strong> the
                          users want to
                        </Paragraph>
                      </Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Workflows
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          When the users select to publish their drafts, they
                          generate a snapshot of the current draft, to share
                          with their team
                        </Paragraph>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </div>
            </Box>
            <Box align="center" justify="center">
              <div className="b">
                <Box
                  style={{ borderRadius: "5px", color: "#FFFF" }}
                  justify="between"
                  pad={{ vertical: "medium" }}
                  size={{ width: "xxlarge", height: "xlarge" }}
                >
                  <Box direction="row">
                    <Box flex pad={{ horizontal: "medium" }} justify="start">
                      <Heading
                        tag="h1"
                        strong
                        style={{ letterSpacing: "3px", fontSize: "7em" }}
                      >
                        Collaborate
                      </Heading>
                      <Box>
                        <Label size="large">
                          share and co-work with your team and colleagues
                        </Label>
                      </Box>
                    </Box>
                  </Box>
                  <Box flex pad="large" align="center" justify="center">
                    <Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Publish
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          Analysis can be publised either using the web user
                          interface, or by the command-line client or by the
                          REST API
                        </Paragraph>
                      </Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Content
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          There are 10 gigabytes of storage available to submit
                          your n-tuples and output macros (for each of your
                          individual analyses).
                        </Paragraph>
                      </Box>
                      <Box pad="small">
                        <Heading tag="h2" strong>
                          Access
                        </Heading>
                        <Paragraph margin="none" style={{ color: "#FFFF" }}>
                          Access will always be restricted to members of the
                          collaboration associated with an analysis. Permissions
                          within a collaboration can be adjusted by the creator
                          of the analysis, defaulting to creator-only access
                        </Paragraph>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </div>
            </Box>
          </Carousel>
        </Box>
        <div className="a">
          <Box
            full
            direction="row"
            justify="between"
            align="center"
            pad="xlarge"
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
              margin={{ horizontal: "small" }}
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
        <Box margin={{ vertical: "large" }}>
          <Box align="center">
            <Heading tag="h2">Integrations & Services</Heading>
          </Box>
          <Box align="center" justify="between">
            <Box direction="row" align="center" justify="between" size="large">
              <GithubIcon />
              <GitlabIcon />
              <ORCIDLogo />
            </Box>
            <Box direction="row" align="center" justify="between" size="large">
              <ZenodoIcon size="large" />
              <RORIcon />
              <ReanaIcon />
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
              justify="around"
              size="medium"
              margin={{ top: "medium" }}
            >
              <AliceIcon />
              <LhcbIcon />
            </Box>
            <Box
              direction="row"
              align="center"
              justify="around"
              size="medium"
              margin={{ top: "medium" }}
            >
              <AtlasIcon />
              <CmsIcon />
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

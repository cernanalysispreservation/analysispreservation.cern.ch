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
                  <Heading strong>A scientific platform for </Heading>
                  <Heading tag="h2">preservation</Heading>
                  <Heading tag="h2">reusability</Heading>
                  <Heading tag="h2">collaboration</Heading>
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
        <Box align="center" justify="center" pad="large">
          <Heading
            style={{ fontSize: "4em", color: "#006996", letterSpacing: "4px" }}
            strong
          >
            Discover the platform
          </Heading>
        </Box>
        <Box align="center" justify="center">
          <Paragraph size="large">
            CERN Analysis Preservation (CAP) is a service for physicists to
            preserve and document the various materials produced in the process
            of their analyses, e.g. datasets, code, documentation, so that they
            are reusable and understandable in the future. By using this tool,
            researchers ensure these outputs are preserved and also findable and
            accessible by their (internal) collaborators.
          </Paragraph>
          <Paragraph size="large">
            CAP provides an integrated platform that allows researchers to
            preserve and document the various materials produced in the process
            of their research and experimentation (datasets, code,
            documentation) so that they are reusable and understandable in the
            future. By using this tool, researchers ensure these outputs are
            preserved, findable and accessible by their collaborators.
          </Paragraph>
        </Box>
        <Box
          full
          pad={{ vertical: "large", horizontal: "xlarge" }}
          justify="center"
        >
          <div className="a">
            <Box
              style={{ borderRadius: "5px", color: "#FFFF" }}
              justify="between"
              pad={{ vertical: "medium" }}
            >
              <Box direction="row" size={{ height: "medium" }}>
                <Box flex pad={{ horizontal: "medium" }} justify="start">
                  <Heading
                    tag="h1"
                    strong
                    style={{ letterSpacing: "3px", fontSize: "7em" }}
                  >
                    Create
                  </Heading>
                  <Box size={{ width: "medium" }}>
                    <Label size="large">
                      create your analysis by providing the title and the
                      catergory
                    </Label>
                  </Box>
                  {/* <Label size="large"> provide your title</Label>
                  <Label size="large"> select your analysis category</Label>
                  <Label size="large"> start preserving </Label> */}
                </Box>
                <Box flex pad="medium">
                  <Image src={reuse} fit="contain" />
                  {/* <video width="100%" height="100%" controls muted playsInline>
                    <source
                      src="https://www.youtube.com/watch?v=hPWj01Q1Jx0"
                      type="video/mp4"
                    />
                  </video> */}
                </Box>
              </Box>
              <Box
                flex
                direction="row"
                pad="large"
                align="start"
                justify="between"
              >
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Forms
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    Though CAP, users can access form templates for CERN
                    experiments (CMS, ATLAS, LHCB, ALICE) but also use a dynamic
                    form builder to customize their own forms.
                  </Paragraph>
                </Box>
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Drafts
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    Every analysis firstly is saved as a draft. The authors can
                    edit it as many times they want before plublishing. As draft
                    the author is the only one with permission to access.
                  </Paragraph>
                </Box>
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Published
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    Published analysis are shared among the team members but
                    also between specific scientists inside the organisation.
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </div>
        </Box>
        <Box
          full
          pad={{ vertical: "large", horizontal: "xlarge" }}
          justify="center"
        >
          <div className="a">
            <Box
              style={{ borderRadius: "5px", color: "#FFFF" }}
              justify="between"
              pad={{ vertical: "medium" }}
            >
              <Box direction="row" size={{ height: "medium" }}>
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
                  {/* <Label size="large">
                    search and select the analysis you want to edit
                  </Label>
                  <Label size="large">update any data or files</Label>
                  <Label size="large">save the changes</Label> */}
                </Box>
                <Box flex pad="medium">
                  <Image src={reuse} fit="contain" />
                </Box>
              </Box>
              <Box direction="row" pad="large" align="start" justify="between">
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Integrations
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    CAP provides collaborations with services such as ORCID,
                    ZENODO, REANA, ROR
                  </Paragraph>
                </Box>

                <Box pad="small">
                  <Heading tag="h2" strong>
                    Files
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    CAP provides the opportunity to upload Github/Gitlab files
                    or repositories and constantly update them{" "}
                    <strong>if</strong> and <strong>when</strong> the users want
                    to
                  </Paragraph>
                </Box>
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Workflows
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    When the users select to publish their drafts, they generate
                    a snapshot of the current draft, to share with their team
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </div>
        </Box>
        <Box
          full
          pad={{ vertical: "large", horizontal: "xlarge" }}
          justify="center"
        >
          <div className="a">
            <Box
              style={{ borderRadius: "5px", color: "#FFFF" }}
              justify="between"
              pad={{ vertical: "medium" }}
            >
              <Box direction="row" size={{ height: "medium" }}>
                <Box flex pad={{ horizontal: "medium" }} justify="start">
                  <Heading
                    tag="h1"
                    strong
                    style={{ letterSpacing: "3px", fontSize: "7em" }}
                  >
                    Collaborate
                  </Heading>
                  <Box size={{ width: "medium" }}>
                    <Label size="large">
                      share and co-work with your team and colleagues
                    </Label>
                  </Box>
                  {/* <Label size="large">publish your personal work</Label>
                  <Label size="large">collaborate with team members</Label>
                  <Label size="large">disrupt your knowledge</Label> */}
                </Box>
                <Box flex pad="large">
                  <Image src={publish} fit="contain" />
                </Box>
              </Box>
              <Box
                flex
                direction="row"
                pad="large"
                align="start"
                justify="between"
              >
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Publish
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    Analysis can be publised either using the web user
                    interface, or by the command-line client or by the REST API
                  </Paragraph>
                </Box>
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Content
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    There are 10 gigabytes of storage available to submit your
                    n-tuples and output macros (for each of your individual
                    analyses).
                  </Paragraph>
                </Box>
                <Box pad="small">
                  <Heading tag="h2" strong>
                    Access
                  </Heading>
                  <Paragraph margin="none" style={{ color: "#FFFF" }}>
                    Access will always be restricted to members of the
                    collaboration associated with an analysis. Permissions
                    within a collaboration can be adjusted by the creator of the
                    analysis, defaulting to creator-only access
                  </Paragraph>
                </Box>
              </Box>
            </Box>
          </div>
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

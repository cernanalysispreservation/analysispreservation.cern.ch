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
      <Box colorIndex="neutral-1-a">
        <Box full colorIndex="neutral-1-a">
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
              <Box flex justify="center" align="center" pad="small">
                <Box>
                  <Heading strong>A service for scientific </Heading>
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
        <Box
          full
          pad={{ vertical: "large", horizontal: "xlarge" }}
          justify="center"
        >
          <Box
            colorIndex="neutral-1"
            style={{ borderRadius: "5px" }}
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
                <Label size="large"> provide your title</Label>
                <Label size="large"> select your analysis category</Label>
                <Label size="large"> start preserving </Label>
              </Box>
              <Box flex pad="medium">
                {/* <Image src={create} fit="contain"/> */}
                <video width="100%" height="100%" controls muted playsInline>
                  <source
                    src="https://www.youtube.com/watch?v=hPWj01Q1Jx0"
                    type="video/mp4"
                  />
                </video>
              </Box>
            </Box>
            <Box
              flex
              direction="row"
              pad="large"
              align="center"
              justify="between"
            >
              <Box pad="small">
                <Heading tag="h3">Forms</Heading>
                <Paragraph margin="none">
                  CAP provides form templates for CERN experiments (CMS, ATLAS,
                  LHCB, ALICE)
                </Paragraph>
                <Paragraph margin="none">
                  and also a dynamic builder for new forms
                </Paragraph>
              </Box>
              <Box pad="small">
                <Heading tag="h3">Integrations</Heading>
                <Paragraph margin="none">
                  CAP provides collaborations with services such as
                </Paragraph>
                <Paragraph margin="none">ORCID, ZENODO, REANA, ROR</Paragraph>
              </Box>
              <Box pad="small">
                <Heading tag="h3">Files</Heading>
                <Paragraph margin="none">
                  CAP provides the opportunity to upload Github/Gitlab files or
                  repositories
                </Paragraph>
                <Paragraph margin="none">
                  and constantly update them <strong>if</strong> and{" "}
                  <strong>when</strong> the users want to
                </Paragraph>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          full
          pad={{ vertical: "large", horizontal: "xlarge" }}
          justify="center"
        >
          <Box
            colorIndex="neutral-1"
            style={{ borderRadius: "5px" }}
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
                <Label size="large">
                  search and select the analysis you want to edit
                </Label>
                <Label size="large">update any data or files</Label>
                <Label size="large">save the changes</Label>
              </Box>
              <Box flex colorIndex="neutral-1" pad="large">
                <Image src={reuse} fit="contain" />
              </Box>
            </Box>
            <Box
              direction="row"
              pad={{ horizontal: "medium" }}
              justify="between"
            >
              <Box pad="small">
                <Heading tag="h2" strong>
                  Drafts
                </Heading>
                <Paragraph margin="none">
                  Every analysis is first saved as a draft, and users can edit
                  it as many times they want
                </Paragraph>
              </Box>
              <Box pad="small">
                <Heading tag="h2" strong>
                  Published
                </Heading>
                <Paragraph margin="none">
                  When the users select to publish their drafts, they generate
                </Paragraph>
                <Paragraph margin="none">
                  a snapshot of the current draft, to share with their team
                </Paragraph>
              </Box>
              <Box pad="small">
                <Heading tag="h2" strong>
                  Workflows
                </Heading>
                <Paragraph margin="none">
                  When the users select to publish their drafts, they generate
                </Paragraph>
                <Paragraph margin="none">
                  a snapshot of the current draft, to share with their team
                </Paragraph>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box
          full
          pad={{ vertical: "large", horizontal: "xlarge" }}
          justify="center"
        >
          <Box
            colorIndex="neutral-1"
            style={{ borderRadius: "5px" }}
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
                <Label size="large">publish your personal work</Label>
                <Label size="large">collaborate with team members</Label>
                <Label size="large">disrupt your knowledge</Label>
              </Box>
              <Box flex colorIndex="neutral-1" pad="large">
                <Image src={publish} fit="contain" />
              </Box>
            </Box>
            <Box
              flex
              direction="row"
              pad="large"
              align="center"
              justify="between"
            >
              <Box pad="small">
                <Heading tag="h3">Publish</Heading>
                <Label>
                  users can publish their personal work and share it with their
                  colleagues
                </Label>
              </Box>
              <Box pad="small">
                <Heading tag="h3" strong>
                  Share
                </Heading>
                <Label>publish the analysis to your team or collegues</Label>
              </Box>
              <Box pad="small">
                <Heading tag="h3" strong>
                  Publish
                </Heading>
                <Label>
                  the analysis now is in collaboration with your team
                </Label>
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

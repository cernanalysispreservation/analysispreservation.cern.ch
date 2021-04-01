import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import Anchor from "../partials/Anchor";
import Button from "../partials/Button";
import { Heading, Box, Label } from "grommet";

import UnlinkIcon from "grommet/components/icons/base/Unlink";

import { AiOutlineApi } from "react-icons/ai";

import OauthPopup from "./components/OAuthPopup";
import { updateIntegrations, removeIntegrations } from "../../actions/auth";
import { GithubIcon } from "../drafts/form/themes/grommet/fields/components/GithubIcon";
import { GitlabIcon } from "../drafts/form/themes/grommet/fields/components/GitlabIcon";
import ZenodoIcon from "../drafts/form/themes/grommet/fields/ServiceIdGetter/components/Zenodo/ZenodoIcon";
import ORCidIcon from "../drafts/form/themes/grommet/fields/ServiceIdGetter/components/ORCID/ORCidIcon";
import IntegrationService from "./IntegrationService/IntegrationService";

const INTEGRATIONS = [
  {
    title: "Github",
    name: "github",
    description: "",
    icon: <GithubIcon size="large" />
  },
  {
    title: "Gitlab CERN",
    name: "gitlab",
    description: "",
    icon: <GitlabIcon size="large" />
  },
  {
    title: "Zenodo",
    name: "zenodo",
    description: "",
    icon: <ZenodoIcon size="large" />
  },
  {
    title: "ORCiD",
    name: "orcid",
    description: "",
    icon: <ORCidIcon size="large" />
  }
];

class Integrations extends React.Component {
  renderOAuthConnectPopup(service) {
    let _url;
    if (process.env.NODE_ENV === "development")
      _url = `http://localhost:5000/auth/connect/${service}?ui=1`;
    else _url = `/api/auth/connect/${service}?ui=1`;

    return (
      <OauthPopup url={_url} loginCallBack={this.loginCallBack}>
        <Button text="Connect" icon={<AiOutlineApi />} primaryOutline />
      </OauthPopup>
    );
  }

  renderOAuthDisconnect(service) {
    return (
      <div>
        <Anchor
          icon={<UnlinkIcon size="xsmall" />}
          onClick={() => this.logoutCallback(service)}
          label={
            <Label size="small" uppercase>
              Disconnect
            </Label>
          }
        />
      </div>
    );
  }

  loginCallBack = () => {
    this.props.updateIntegrations();
  };

  logoutCallback = service => {
    this.props.removeIntegrations(service);
  };

  render() {
    return (
      <Box flex colorIndex="light-1">
        <Box pad="none">
          <Box flex={true} direction="row" pad="small">
            <Heading tag="h3" margin="none">
              Integrations with other services
            </Heading>
          </Box>
        </Box>
        <Box>
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr)",
              gridGap: "10px 10px",
              height: "auto"
            }}
            pad="small"
          >
            {INTEGRATIONS.map(service => (
              <Box
                flex
                key={service.name}
                colorIndex="light-1"
                style={{
                  width: "100%",
                  minHeight: "205px",
                  borderRadius: "3px",
                  border: "1px solid #f5f5f5"
                }}
                justify="between"
                pad="small"
              >
                <Box align="center">{service.icon}</Box>
                {this.props.integrations &&
                this.props.integrations[service.name] ? (
                  <IntegrationService
                    service={service.name}
                    data={this.props.integrations[service.name]}
                    onClick={() => this.logoutCallback(service.name)}
                  />
                ) : (
                  this.renderOAuthConnectPopup(service.name)
                )}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

Integrations.propTypes = {
  integrations: PropTypes.object,
  updateIntegrations: PropTypes.func,
  removeIntegrations: PropTypes.func
};

function mapStateToProps(state) {
  return {
    integrations: state.auth.get("integrations")
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIntegrations: () => dispatch(updateIntegrations()),
    removeIntegrations: service => dispatch(removeIntegrations(service))
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Integrations)
);

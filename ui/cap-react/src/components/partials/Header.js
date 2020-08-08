import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import queryString from "query-string";
import CircleQuestionIcon from "grommet/components/icons/base/CircleQuestion";
import Add from "grommet/components/icons/base/Add";
import HowToSearchPage from "../about/HowToSearch";

import { Header as GrommetHeader, Heading } from "grommet";
import {
  AiOutlineSetting,
  AiOutlineLogout,
  AiOutlinePlus
} from "react-icons/ai";

import Box from "grommet/components/Box";
import Title from "grommet/components/Title";
import Label from "grommet/components/Label";

import Menu from "./Menu";
import MenuItem from "./MenuItem";

import Anchor from "../partials/Anchor";

import SearchBar from "../search/SearchBar";

import { logout } from "../../actions/auth";
import DraftCreate from "../drafts/DraftCreate";
import MediaQuery from "react-responsive";

import CAPLogoLight from "../../img/cap-logo-light.svg";

import Modal from "../partials/Modal";

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      show: false,
      showCreate: false
    };
  }

  showLayer = () => {
    this.setState({ show: true });
  };

  toggleCreate = () => {
    this.setState({ showCreate: !this.state.showCreate });
  };

  hideLayer = () => {
    this.setState({ show: false });
  };

  _onSearchSubmit(event) {
    let query = event.target.value;
    let q = queryString.parse(this.props.history.location.search);
    q["q"] = query;

    const search_location = {
      pathname: `/search`,
      search: `${queryString.stringify(q, { encode: false })}`,
      from: this.props.match.path
    };

    this.props.history.push(search_location);
  }

  getQuery() {
    let q = queryString.parse(window.location.search, { encode: false });
    return q["q"] || "";
  }

  render() {
    return (
      <GrommetHeader
        fixed={false}
        colorIndex="neutral-1"
        size="small"
        style={{ position: "relative" }}
      >
        {this.state.showCreate ? (
          <Box>
            <DraftCreate toggle={this.toggleCreate} />
          </Box>
        ) : null}
        {this.state.show ? (
          <Box>
            <Modal
              onClose={this.hideLayer}
              background="#f5f5f5"
              title="How to Search"
            >
              <HowToSearchPage />
            </Modal>
          </Box>
        ) : null}
        <Box
          flex={true}
          pad={{ horizontal: "small" }}
          direction="row"
          align="center"
          responsive={false}
        >
          <Title style={{ fontWeight: "300" }} align="end">
            <Anchor href="#" path="/" style={{ textDecoration: "none" }}>
              <CAPLogoLight height="32px" />
            </Anchor>
            <Label
              size="small"
              style={{ marginTop: "-10px", marginLeft: "-5px" }}
            >
              <b>BETA</b>
            </Label>
          </Title>

          {this.props.isLoggedIn ? (
            <Box
              direction="row"
              justify="between"
              flex={true}
              responsive={false}
            >
              <Box flex={true} direction="row" responsive={false}>
                <Box
                  flex={true}
                  justify="center"
                  size={{ width: { max: "large" } }}
                  margin={{ horizontal: "small" }}
                  colorIndex="neutral-1-t"
                >
                  <SearchBar />
                </Box>
                <Anchor
                  icon={<CircleQuestionIcon />}
                  onClick={this.showLayer}
                />
              </Box>
              <Box direction="row" align="center" justify="center">
                {this.props.permissions && (
                  <MediaQuery minWidth={720}>
                    <Box
                      onClick={() => this.toggleCreate()}
                      pad={{ horizontal: "small" }}
                      icon={<Add />}
                      margin={{ right: "small" }}
                    >
                      <Heading margin="none" tag="h4">
                        Create
                      </Heading>
                    </Box>
                  </MediaQuery>
                )}
                <Menu top={48} right={3} hoverColor="rgba(67,135,170,1)">
                  {this.props.permissions && (
                    <MediaQuery maxWidth={719}>
                      <MenuItem
                        hovered
                        separator
                        title="Create"
                        onClick={() => this.toggleCreate()}
                        href="#"
                        icon={<AiOutlinePlus color="#000" />}
                      />
                    </MediaQuery>
                  )}
                  <MenuItem
                    hovered
                    separator
                    title="Settings"
                    icon={<AiOutlineSetting color="#000" />}
                    path="/settings"
                    href="#"
                  />
                  <MenuItem
                    hovered
                    separator
                    title="Logout"
                    onClick={this.props.logout}
                    href="#"
                    icon={<AiOutlineLogout color="#000" />}
                  />
                </Menu>
              </Box>
            </Box>
          ) : null}
        </Box>
      </GrommetHeader>
    );
  }
}

Header.propTypes = {
  isLoggedIn: PropTypes.bool,
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object,
  groups: PropTypes.object,
  permissions: PropTypes.bool
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.getIn(["isLoggedIn"]),
    groups: state.auth.getIn(["currentUser", "depositGroups"]),
    permissions: state.auth.getIn(["currentUser", "permissions"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);

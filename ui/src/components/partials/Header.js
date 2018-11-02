import React from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import queryString from "query-string";

import { Header as GrommetHeader } from "grommet";

import Box from "grommet/components/Box";
import Title from "grommet/components/Title";
import Menu from "grommet/components/Menu";
import Anchor from "grommet/components/Anchor";
import Label from "grommet/components/Label";

import SearchBar from "../search/SearchBar";

import UserIcon from "grommet/components/icons/base/User";
import { fetchSearch } from "../../actions/search";
import config from "../../config";
import { logout } from "../../actions/auth";

class Header extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

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
      <GrommetHeader fixed={false} size="small" colorIndex="neutral-1">
        <Box
          flex={true}
          pad={{ horizontal: "small" }}
          justify="end"
          direction="row"
          responsive={false}
        >
          <Title style={{ fontWeight: "300" }} align="end">
            <Anchor
              href="#"
              path="/"
              label={config.project.name || "Project Name"}
              style={{ textDecoration: "none" }}
            />
            <Label
              size="small"
              style={{ marginTop: "-10px", marginLeft: "-5px" }}
            >
              <b>BETA</b>
            </Label>
          </Title>
          <Box flex={true} justify="center" colorIndex="neutral-1-t">
            <SearchBar />
          </Box>
          <Menu
            align="center"
            margin={{ left: "small" }}
            direction="row"
            responsive={true}
            size="small"
          >
            <Menu
              colorIndex="neutral-1"
              responsive={true}
              label="Create"
              dropAlign={{ top: "bottom" }}
              size="small"
            >
              {this.props.groups ? (
                this.props.groups.map((group, index) => (
                  <Anchor
                    key={`${group.get("name")}-${index}`}
                    label={`${group.get("name")}`}
                    animateIcon={true}
                    path={`/drafts/create/${group.get("deposit_group")}`}
                  />
                ))
              ) : (
                <Box> No available schemas.</Box>
              )}
            </Menu>
            <Menu
              colorIndex="neutral-1"
              dropAlign={{ top: "bottom" }}
              icon={<UserIcon />}
              size="small"
            >
              <Anchor
                label="Logout"
                href="#"
                animateIcon={true}
                onClick={this.props.logout}
              />
              <Anchor
                label="Settings"
                href="#"
                animateIcon={true}
                path="/settings"
              />
            </Menu>
          </Menu>
        </Box>
      </GrommetHeader>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object,
  groups: PropTypes.object
};

function mapStateToProps(state) {
  return {
    groups: state.auth.getIn(["currentUser", "depositGroups"])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: query => dispatch(fetchSearch(query)),
    logout: () => dispatch(logout())
  };
}

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Header)
);

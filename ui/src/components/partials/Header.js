import React from 'react';
import PropTypes from 'prop-types';

import GrommetHeader from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box'
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

import queryString from 'query-string';
import UserIcon from 'grommet/components/icons/base/User';

import SearchBar from '../search/SearchBar';

import config from '../../config';
import { logout } from '../../actions/auth';

class Header extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <GrommetHeader fixed={false} colorIndex="neutral-1" size="small">
        <Box
          flex={true}
          pad={{horizontal: "small"}}
          justify="end"
          direction="row"
          responsive={false}>
          <Title >
            <Anchor href="#" path="/" label={config.project.name || "Project Name"} />
          </Title>
          <Box flex={true} justify="center" colorIndex="neutral-1-t">
            <SearchBar />
          </Box>
          <Menu pad={{horizontal: "small"}} direction="row" responsive={true}>
            <Anchor path="/drafts/create" label="Create" />
            <Anchor href="#" path="/search" label="Search" />
            <Menu responsive={true} icon={<UserIcon />} >
              <Anchor
                label="Logout"
                href="#"
                animateIcon={true}
                onClick={this.props.logout} />
              <Anchor
                label="Settings"
                href="#"
                animateIcon={true}
                path="/settings" />
            </Menu>
          </Menu>
        </Box>
      </GrommetHeader>
    );
  }
}

Header.propTypes = {
  logout: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}

export default withRouter(connect(
  ()=> ({}),
  mapDispatchToProps
)(Header));
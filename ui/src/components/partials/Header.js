import React from 'react';

import GrommetHeader from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import { withRouter } from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SearchBar from '../search/SearchBar';

import queryString from 'query-string';
import UserIcon from 'grommet/components/icons/base/User';

import {fetchSearch} from '../../actions/search';
import config from '../../config';
import { logout } from '../../actions/auth';

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
      search: `${queryString.stringify(q, {encode:false})}`,
      from: this.props.match.path
    };

    this.props.history.push(search_location);
  }

  getQuery() {
    let q = queryString.parse(window.location.search, {encode:false});
    return q["q"] || "";
  }

  render() {
    return (
      <GrommetHeader fixed={false}  size="small" colorIndex="neutral-1" >
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
            <Menu colorIndex="neutral-1" responsive={true} icon={<UserIcon />} >
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
              <Anchor
                label="About"
                href="#"
                animateIcon={true}
                path="/about" />
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
  match: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: query => dispatch(fetchSearch(query)),
    logout: () => dispatch(logout())
  };
}

export default withRouter(connect(
  ()=> ({}),
  mapDispatchToProps
)(Header));

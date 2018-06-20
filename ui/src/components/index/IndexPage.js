import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Switch, Route} from 'react-router-dom';

import Box from 'grommet/components/Box';

import SearchPage from '../search/SearchPage';
import PublishedItem from '../published/PublishedItem';
import Header from '../partials/Header';
import CreateIndex from '../create/CreateIndex';
import Dashboard from '../dashboard/Dashboard';
import SettingsIndex from '../settings/SettingsIndex';
import DraftsIndex from '../drafts/DraftsIndex';
import PublishedIndex from '../published/PublishedIndex';

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      this.props.history.push({
        pathname: '/login',
        from: this.props.match.path
      });
    }
  }

  componentWillUpdate(nextProps) {
    if (!nextProps.isLoggedIn) {
      this.props.history.push('/login');
    }
  }

  render() {
    return (
      <Box flex={true}>
        <Header />
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <Route path="/search" component={SearchPage} />
          <Route path="/published" component={PublishedIndex} /> 
          <Route path="/drafts" component={DraftsIndex} />
          <Route path="/create" component={CreateIndex}/>
          <Route path="/settings" component={SettingsIndex}/>
        </Switch>
      </Box>
    );
  }
}

function mapStateToProps(state) {
  return {
    isLoggedIn: state.auth.get('isLoggedIn')
  };
}

export default withRouter(connect(mapStateToProps)(IndexPage));

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getPublishedItem} from '../../actions/published';
import DefaultPublished from './components/Default';
//import CmsAnalysis from './components/CmsAnalysis';
import LhcbPublished from './components/LhcbAnalysis';

export class Published extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let {id} = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    let item = this.props.item ? this.props.item.metadata:null;
    if (item) {
      switch (item.$ana_type) {
        case 'cms-analysis':
          return (
            <DefaultPublished item={item} />
          );
        case 'lhcb':
          return (
            <LhcbPublished item={item} />
          );
        default:
          return (
            <DefaultPublished item={item} />
          );
      }
    } else {
      return null;
    }
  }
}

Published.propTypes = {
  error: PropTypes.object.required,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object.required,
  match: PropTypes.object.required,
};

function mapStateToProps(state) {
  return {
    item: state.published.getIn(['current_item', 'data'])
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getPublishedItem: (id) => dispatch(getPublishedItem(id))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Published);

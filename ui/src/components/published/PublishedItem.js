import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {
  Box,
  Heading,
  Section
} from 'grommet';

import {getPublishedItem} from '../../actions/published';

export class IndexPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let {id} = this.props.match.params;
    this.props.getPublishedItem(id);
  }

  render() {
    return (
      <Box flex={true}>
        <Box flex={true} colorIndex="neutral-1-a"  align="center">
          <Section>
            <Box size="large">
              <Heading tag="h2"> Published, {this.props.match.params.id}</Heading>
              <hr/>
              {
                this.props.error ?
                <Box>
                  <Heading tag="h5">Errors</Heading>
                  <div>{JSON.stringify(this.props.error)}</div>
                </Box>: null
              }
              {
                this.props.item ?
                <Box>
                  <Heading tag="h5">Data</Heading>
                  <div>{JSON.stringify(this.props.item)}</div>
                </Box>: null
              }
            </Box>
          </Section>
        </Box>
      </Box>
    );
  }
}

IndexPage.propTypes = {
  error: PropTypes.object.required,
  getPublishedItem: PropTypes.func,
  item: PropTypes.object.required,
  match: PropTypes.object.required,
};

function mapStateToProps(state) {
  return {
    item: state.published.getIn(['current_item', 'data']),
    error: state.published.getIn(['current_item', 'error']),
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
)(IndexPage);

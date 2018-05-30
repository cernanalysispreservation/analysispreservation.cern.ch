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
    let item = this.props.item ? this.props.item.metadata:null;
    let created = this.props.item ? this.props.item.created:null;
    return (
        <Box colorIndex="neutral-1-a" flex={true}  align="center">
          <Section >
           {item?
            <Box size="large">
              <Heading tag="h2">{item.general_title ? item.general_title : item.basic_info.title}</Heading>
              <hr/>
              {
                this.props.error ?
                <Box>
                  <Heading tag="h5">Errors</Heading>
                  <div>{JSON.stringify(this.props.error)}</div>
                </Box>: null
              }
              {
                item ?
                <Box>
                  <Heading tag="h5">Description</Heading>
                  <Heading tag="h5">Started</Heading>
                  <div>{created}</div>
                  <Heading tag="h5">Members</Heading>
                  <Heading tag="h5">Files</Heading>
                  <Heading tag="h5">JSON</Heading>
                  <pre>{JSON.stringify(item, null, 2)}</pre>
                </Box>: null
              }
            </Box>:null}
          </Section>
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

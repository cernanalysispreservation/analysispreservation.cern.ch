import React from 'react';
// import {connect} from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'grommet/components/Button';
import Box from 'grommet/components/Box';

import Spinning from 'grommet/components/icons/Spinning';


import NextIcon from 'grommet/components/icons/base/Next';
import PreviousIcon from 'grommet/components/icons/base/Previous';
import Sort from 'grommet-addons/components/Sort';

export default class SearchUtils extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {}

  _onPageChange(page) {
    this.props.onPageChange(page);
  }

  _onPageSizeChange(size) {
    this.props.onPageSizeChange(size);
  }

  _onNextPage(numPages) {
    if (this.props.currentPage < numPages)
      this._onPageChange(this.props.currentPage+1);
  }

  _onPrevPage() {
    if (this.props.currentPage > 1)
      this._onPageChange(this.props.currentPage-1);
  }

  render() {
    let num_pages = Math.ceil(this.props.total/this.props.size);
    return (
      <Box
        colorIndex="neutral-1-a"
        direction="row"
        pad={{horizontal: "small"}}
        justify="between"
        alignContent="center">
        <Box justify="center">
          <span>
            <strong>{this.props.total}</strong> results
          </span>
        </Box>

        <Box align="center" justify="between" direction="row" >
          <Button onClick={this._onPrevPage.bind(this)} icon={<PreviousIcon/>} />
          <span>
            Page <strong>{this.props.currentPage}</strong> of <strong>{num_pages}</strong>
          </span>
          <Button
            onClick={this._onNextPage.bind(this, num_pages)}
            icon={<NextIcon/>}/>
        </Box>
      </Box>
    );
  }
}

SearchUtils.propTypes = {
  loading: PropTypes.bool.isRequired,
  total: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func
};

// function mapStateToProps(state) {
//   return {
//     // fuelSavings: state.fuelSavings
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     // actions: bindActionCreators(actions, dispatch)
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(SearchUtils);
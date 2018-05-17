import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import queryString from 'query-string';

import Heading from 'grommet/components/Heading';
import Sidebar from 'grommet/components/Sidebar';
import Box from 'grommet/components/Box';
import Menu from 'grommet/components/Menu';
import CheckBox from 'grommet/components/CheckBox';

import FiltersPreview from './components/FiltersPreview';

class SearchFacets extends React.Component {
  constructor(props) {
    super(props);
  }

  _onChange(category, event) {
    const name = event.target ? event.target.name : null;
    let currentParams = queryString.parse(this.props.location.search);
    this._toggleAggs(category, name, currentParams);
  }

  _toggleAggs(category, name, selectedAggregations) {
    let _selectedAggregations = Object.assign({},selectedAggregations);

    if (!_selectedAggregations[category]) {
        _selectedAggregations[category] = [];
    }

    if (typeof _selectedAggregations[category] =='string')
        _selectedAggregations[category] = [_selectedAggregations[category]];

    let index = _selectedAggregations[category].indexOf(name);

    if ( index == -1 ) _selectedAggregations[category].push(name);
    else _selectedAggregations[category].splice(index, 1);

    this.updateHistory(_selectedAggregations);
  }

  updateHistory(selectedAggs) {
    let currentParams = queryString.parse(this.props.location.search);
    const location = {
      search: `${queryString.stringify(Object.assign(currentParams,selectedAggs))}`
    };

    this.props.history.replace(location);
  }

  render() {
    if (this.props.aggs){
      let _aggs = this.props.aggs;

      let categories = Object.keys(_aggs);
      return (
        <Sidebar full={false} colorIndex="neutral-1-t">
          <Box flex={true} justify="start">
            <FiltersPreview aggs={this.props.selectedAggs} />
            <Menu flex={true} primary={true}>
              {
                categories.map((category) => {
                  return (
                    <Box pad="small" key={category}>
                      <Heading
                        pad="small"
                        tag="h5"
                        strong={false}
                        uppercase={true}
                        truncate={true}
                        href="#"
                        className="active"
                        label={category}
                        id={category}
                        value={category}
                        >
                        {category}
                      </Heading>
                      <Box size="medium" styles={{maxHeight: "100px"}} pad="none">
                        {
                          _aggs[category].buckets
                            .map((cat_fields) => (
                              <Box size="medium" key={String(cat_fields.key)} direction="row" justify="between" align="center" wrap={false}>
                                <Box direction="row" justify="between" align="center" wrap={false}>
                                  <CheckBox
                                    label={cat_fields.key}
                                    key={cat_fields.key}
                                    name={String(cat_fields.key)}
                                    pad={{horizontal: "small"}}
                                    checked={
                                      this.props.selectedAggs[category] && this.props.selectedAggs[category].indexOf(cat_fields.key) > -1 ? true : false
                                    }
                                    onChange={this._onChange.bind(this, category)}/>
                                </Box>
                                <Box alignSelf="end">{cat_fields.doc_count}</Box>
                              </Box>
                            )
                          )
                        }
                      </Box>
                    </Box>
                  );
              })
            }
            </Menu>
          </Box>
        </Sidebar>
      );
    }

    return (<div>None</div>);
  }
}

SearchFacets.propTypes = {
  aggs: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  selectedAggs: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    selectedAggs: state.search.getIn(['selectedAggs'])
  };
}

export default withRouter(connect(mapStateToProps)(SearchFacets));

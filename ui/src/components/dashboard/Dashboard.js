import React from 'react';

import {connect} from 'react-redux';

import {
  Box,
  Section,
  Heading,
  Header,
  Tiles,
  Label,
  Tile,
  List,
  ListItem,
  Paragraph,
  Value
} from 'grommet';

import {withRouter} from 'react-router-dom';
import {fetchSearch, fetchMine} from '../../actions/search';
import AddIcon from 'grommet/components/icons/base/Add';
import Home from 'grommet/components/icons/base/Home';
import SearchIcon from 'grommet/components/icons/base/Search';

const CustomTile = withRouter(({ history, props=props, group=group, name=name, count=count}) => (
      <Tile key={group}  colorIndex="light-2">
        <Box size="medium" direction="column" wrap={true} flex={true} >
          <Header>
            <Box
              colorIndex="grey-2"
              flex={true}
              direction="row"
              pad="small"
              justify="between"
              align="center">
              <Label margin="none">{name}</Label>
              <Box justify="center" align="center" onClick={() => history.push(`/drafts/create/${group.get('deposit_group')}`)} >
                <AddIcon />
              </Box>
            </Box>
          </Header>
          <Box flex={true} direction="row" justify="between" align="center" pad="medium">
            <Value label="Drafts" value={count} onClick={() => history.push(`/search`)} />
            <Value label="Published" value={count} onClick={() => history.push(`/search`)}/>
            <Value label="Yours" value={count} onClick={() => history.push(`/search`)}/>
          </Box>
        </Box>
      </Tile>
    ))

export class Dashboard extends React.Component {

  componentDidMount() {
    this.props.fetchSearch();
    this.props.fetchMine(this.props.currentUser.get('token'));
  }

  getFacetTypes() {
    let _types = {};
    this.props.results ? this.props.results.getIn(['aggregations', 'facet_type', 'buckets']).map( item => { _types[item.get('key')] = item.get('doc_count') }) : null;

    return _types;
  }

  getDraftCount(type, version = 'v0.0.1') {
    const _type = `${type}-${version}`;
    const facets = this.getFacetTypes();
    return facets[_type] || 0;
  }

  render() {
    return (
      <Box flex={true} direction="row">
        <Box flex={false} colorIndex="brand" pad="small">
          <Box pad={{vertical: "small"}}>
            <Home size="medium"/>
          </Box>
          <Box pad={{vertical: "small"}} onClick={() => this.props.history.push(`/search`)}>
            <SearchIcon size="medium"/>
          </Box>
          <Box pad={{vertical: "small"}} onClick={() => this.props.history.push(`/drafts/create`)}>
            <AddIcon size="medium"/>
          </Box>
        </Box>
      <Box flex={true}>
      <Box flex={false}>
        <Section >
          <Box margin={{top:"medium", horizontal: "medium"}} >
            <Heading align="start" tag="h3">Overview</Heading>
          </Box>
          <Tiles flush={false} fill={false} size="large">
            {
              this.props.currentUser.get('depositGroups') &&
              this.props.currentUser.get('depositGroups').map ?
              this.props.currentUser.get('depositGroups').map(group => (
                <CustomTile key={group} props={this.props} count={this.getDraftCount(group.get('deposit_group'))} group={group} name={group.get("name")}/>
              )) :
              <Box> No available schemas.</Box>
            }
          </Tiles>
        </Section>
        <Section >
          <Box margin={{top:"medium", horizontal: "medium"}} >
            <Heading align="start" tag="h3">My Drafts</Heading>
          </Box>
          <Box pad="medium" colorIndex="light-2" size={{height: "medium"}}>
          <List selectable={true} >
            {
              this.props.mine.getIn(['hits', 'hits']) ?
              this.props.mine.getIn(['hits', 'hits']).map(item =>
                <ListItem pad={{horizontal: "small"}}>
                  <Box direction="row" pad="none">
                    <Label pad="none">{item.general_title || item.general_title || "Untitled" }</Label>
                    <span>{item.metadata && item.metadata.$ana_type }</span>
                  </Box>
                </ListItem>
              ) : null
            }
          </List>
          </Box>
        </Section>
      </Box>
      </Box>
      </Box>
    );
  }
}

Dashboard.propTypes = {};

function mapStateToProps(state) {
  return {
    currentUser: state.auth.getIn(['currentUser']),
    selectedAggs: state.search.getIn(['selectedAggs']),
    results: state.search.getIn(['results']),
    mine: state.search.getIn(['mine']),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearch: () => dispatch(fetchSearch()),
    fetchMine: (id) => dispatch(fetchMine(id)),
  };
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Dashboard));

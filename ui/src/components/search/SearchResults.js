import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { withRouter } from 'react-router';

import Box from 'grommet/components/Box';

import Title from 'grommet/components/Title';

import List from 'grommet/components/List';
import ListItem from 'grommet/components/ListItem';



import {
    Button
} from 'grommet';

class SearchResults extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        if (this.props.results){
            return (
                <Box flex={true} colorIndex="light-2">
                    <List >
                        {
                            this.props.results.map(item => {
                                let draft_id = item.metadata._deposit.id;
                                let published_id = item.metadata.control_number;
                                let abstract = ''
                                let title = ''

                                if (item.metadata.basic_info){
                                    abstract = item.metadata.basic_info.abstract;
                                    title = item.metadata.basic_info.analysis_number;
                                }

                                return (
                                    <ListItem key={item.created} pad="medium">
                                        <Box flex={true}
                                            wrap={false}
                                            direction="row" 
                                            size={{height: "xsmall"}}
                                            onClick={() => this.props.history.push(`/drafts/${draft_id}`)}>
                                            <Box basis="1/4" align="start">
                                                <Title>
                                                    {title || item.metadata.general_title}
                                                </Title>
                                            </Box>
                                            <Box basis="3/4">
                                                {abstract}
                                            </Box>
                                        </Box>
                                    </ListItem>
                                );
                            })
                        }
                    </List>
                </Box>
            );
        }
        else {
            return <div>No Results</div>;
        }
    }
}

SearchResults.propTypes = {
    results: PropTypes.object.isRequired,
};

// function mapStateToProps(state) {
//   return {};
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     // actions: bindActionCreators(actions, dispatch)
//   };
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(SearchResults);

export default withRouter(SearchResults);

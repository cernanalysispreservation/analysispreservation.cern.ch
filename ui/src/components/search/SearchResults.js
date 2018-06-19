import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';

import {
    Box,
    Headline,
    Label,
    List,
    ListItem
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
                                let metadata = fromJS(item.metadata);
                                let objects = new Set();
                                metadata.getIn(["main_measurements"],[]).map(item => {
                                    return item.getIn(["signal_event_selection","physics_objects"], []).map(item =>{
                                        if(item.get('object'))
                                            objects.add(item.get('object'));
                                    })
                                })

                                let draft_id = item.metadata._deposit.id;

                                return (
                                    <ListItem key={item.created} pad="medium">
                                        <Box flex={true}
                                            wrap={true}
                                            direction="row"
                                            size={{height: "xsmall"}}
                                            onClick={() => this.props.history.push(`/drafts/${draft_id}`)}>
                                            <Box basis="1/4" align="start">
                                                <Headline size="small">
                                                    {
                                                        metadata.general_title ||
                                                            metadata.getIn(["basic_info","analysis_title"]) ||
                                                            metadata.getIn(["basic_info","analysis_number"]) ||
                                                            metadata.getIn(["basic_info","cadi_id"]) ||
                                                            metadata.getIn(["basic_info", "ana_notes", 0]) ||
                                                            "Analysis"
                                                    }
                                                </Headline>
                                                <Box direction="row" align="bottom">
                                                {
                                                    Array.from(objects).map(object => {
                                                        return(
                                                            <Label size="small" align="center" margin="medium" uppercase="true">
                                                                {object} &nbsp;
                                                            </Label>
                                                        )
                                                    })
                                                }
                                                </Box>
                                            </Box>
                                            <Box basis="3/4">
                                                <Label margin="none">
                                                    {
                                                        metadata.getIn(["cadi_info","name"]) ||
                                                            metadata.getIn(["basic_info","measurement"])
                                                    }
                                                </Label>
                                                { metadata.getIn(["basic_info","abstract"])}
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
    results: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
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

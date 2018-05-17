import React from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Button,
  Header,
  Title,
  Paragraph,
  List,
  ListItem
} from 'grommet';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.results){
      return (
        <Box flex={true} colorIndex="light-2">
          <List >
            {
              this.props.results.map(item => {
                let draft_id = item.metadata._deposit.id;
                let published_id = item.metadata.control_number;

                return (
                  <ListItem key={item.created} pad="none" >
                    <Box flex={true} wrap={false} direction="row">
                      <Box flex={true} pad="small">
                        <Header justify="between">
                          <Title>{item.metadata.general_title}</Title>
                          <span>
                            {item.created}
                            {item.metadata.control_number}
                          </span>
                        </Header>
                        <Paragraph size="medium">
                          {item.metadata.general_title}
                        </Paragraph>
                      </Box>
                      <Box flex={false} pad="small" colorIndex="light-1">
                        { draft_id ? <Button label="Edit" path={`/drafts/${draft_id}`} /> : null }
                        <hr/>
                        { published_id ? <Button label="Preview"/> : null }
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
  results: PropTypes.array.isRequired
};

export default SearchResults;
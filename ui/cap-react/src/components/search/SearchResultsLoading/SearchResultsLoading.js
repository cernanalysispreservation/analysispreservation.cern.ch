import React from "react";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";

import Loading from "../../partials/LoadingSkeleton";

const SearchResultsLoading = () => {
  return (
    <Box colorIndex="light-2">
      <List className="search_result_box">
        {[...Array(5)].map((item, index) => (
          <ListItem key={index} separator="none" pad="none">
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              style={{ width: "100%", borderRadius: "2px" }}
              pad="small"
            >
              <Box direction="row" align="center" justify="between">
                <Loading height={20} margin="0 0 5px 0 " width={30} />
                <Loading height={20} margin="0 0 5px 0 " width={10} />
              </Box>
              <Box>
                <Loading height={20} margin="0 0 5px 0 " width={20} />
                <Loading height={20} margin="0 0 5px 0 " width={10} />
              </Box>

              <Loading height={30} margin="0 0 5px 0 " width={100} />

              <Box
                direction="row"
                style={{ marginTop: "5px" }}
                justify="between"
              >
                <Loading height={20} margin="0 0 5px 0 " width={10} />
                <Loading height={20} margin="0 0 5px 0 " width={10} />
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SearchResultsLoading;

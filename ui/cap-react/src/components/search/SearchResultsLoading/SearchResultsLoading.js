import React from "react";

import Box from "grommet/components/Box";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import Truncate from "react-truncate";

const SearchResultsLoading = () => {
  return (
    <Box flex={true} colorIndex="light-2" className="search_result_box">
      <List>
        {[...Array(5)].map((item, index) => (
          <ListItem key={index} separator="none" pad="none">
            <Box
              colorIndex="light-1"
              margin={{ vertical: "small" }}
              style={{ width: "100%", borderRadius: "2px" }}
              pad="small"
            >
              <Box direction="row" align="center" justify="between">
                <Box className="search_loading_title" />
                <Box className="search_loading_tag" />
              </Box>
              <Box>
                <Box className="search_loading_date" />
                <Box
                  flex={false}
                  direction="row"
                  wrap
                  margin={{ top: "small" }}
                  className="search_loading_tag"
                />
              </Box>

              <Box
                margin={{ top: "small" }}
                className="search_loading_description"
                style={{ width: "100%", color: "#f2f2f2" }}
              >
                <Truncate lines={2} ellipsis={<span>...</span>} />
              </Box>

              <Box
                direction="row"
                style={{ marginTop: "5px" }}
                justify="between"
              >
                <Box
                  direction="row"
                  align="center"
                  justify="center"
                  className="search_loading_date"
                />
                <Box className="search_loading_date" />
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default SearchResultsLoading;

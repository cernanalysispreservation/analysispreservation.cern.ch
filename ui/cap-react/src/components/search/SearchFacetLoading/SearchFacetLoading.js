import React from "react";

import Sidebar from "grommet/components/Sidebar";
import Box from "grommet/components/Box";

const SearchFacetLoading = () => {
  return (
    <Sidebar full={false} colorIndex="light-2" id="sidebar">
      <Box flex={true} justify="start">
        <Box flex={true} primary={true} margin={{ vertical: "medium" }}>
          {[...Array(4)].map((category, index) => {
            return (
              <Box key={index}>
                <Box key={index} margin={{ bottom: "small" }}>
                  <Box className="search_facet_heading" />
                  <Box
                    size="medium"
                    styles={{ maxHeight: "100px" }}
                    direction="column"
                    margin={{ top: "small" }}
                  >
                    <Box>
                      {[...Array(5)].map((field, index) => (
                        <Box key={index} className="search_facet_listitem" />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Sidebar>
  );
};

export default SearchFacetLoading;

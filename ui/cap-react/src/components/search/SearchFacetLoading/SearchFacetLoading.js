import React from "react";

import Box from "grommet/components/Box";

const SearchFacetLoading = () => {
  return (
    <Box flex={false} primary={true} margin={{ vertical: "medium" }}>
      <Box flex={true} primary={true} margin={{ vertical: "medium" }}>
        {[...Array(4)].map((category, index) => {
          return (
            <Box key={index} separator="bottom" margin={{ vertical: "medium" }}>
              <Box key={index} margin={{ bottom: "small" }}>
                <Box className="search_facet_heading" />
                <Box
                  size="medium"
                  styles={{ maxHeight: "100px" }}
                  direction="column"
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
  );
};

export default SearchFacetLoading;

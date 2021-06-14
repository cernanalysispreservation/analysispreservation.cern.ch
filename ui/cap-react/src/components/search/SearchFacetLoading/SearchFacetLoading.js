import React from "react";

import Box from "grommet/components/Box";
import Loading from "../../partials/LoadingSkeleton";

const SearchFacetLoading = () => {
  return (
    <Box flex={false} primary={true} margin={{ vertical: "medium" }}>
      <Box flex={true} primary={true} margin={{ vertical: "medium" }}>
        {[...Array(4)].map((category, index) => {
          return (
            <Box key={index} separator="bottom" margin={{ vertical: "medium" }}>
              <Box key={index} margin={{ bottom: "small" }}>
                <Loading margin="0 0 5px 0" height={20} width={50} />
                <Box
                  size="medium"
                  styles={{ maxHeight: "100px" }}
                  direction="column"
                >
                  <Box>
                    {[...Array(5)].map((field, index) => (
                      <Loading
                        key={index}
                        margin="0 0 5px 0"
                        height={20}
                        width={100}
                      />
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

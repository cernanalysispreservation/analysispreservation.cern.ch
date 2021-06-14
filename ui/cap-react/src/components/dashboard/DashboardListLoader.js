import React from "react";
import { Box, List, ListItem } from "grommet";
import Loading from "../partials/LoadingSkeleton";

const DashboardListLoader = () => {
  return (
    <Box>
      <List>
        {[...Array(5)].map((item, index) => (
          <ListItem
            key={index}
            style={{
              height: "71px",
              width: "100%"
            }}
          >
            <Box
              justify="between"
              responsive={false}
              direction="row"
              style={{
                overflow: "visible"
              }}
              flex
            >
              <Box
                margin={{ right: "medium" }}
                style={{ overflow: "visible" }}
                flex
              >
                <Box direction="row">
                  <Loading height={15} margin="0 0 5px 0" width={20} />
                </Box>
                <Box flex={true} style={{ overflow: "visible" }}>
                  <Loading height={15} width={40} margin="0 0 5px 0" />
                </Box>
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default DashboardListLoader;

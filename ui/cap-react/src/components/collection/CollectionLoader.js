import React from "react";
import { Box } from "grommet";
import Loader from "../partials/LoadingSkeleton";
import DocumentTitle from "../partials/Title";

const CollectionLoader = () => {
  return (
    <DocumentTitle title={"Collection"}>
      <Box align="center">
        <Box
          pad="small"
          style={{
            maxWidth: "1200px",
            width: "95%"
          }}
        >
          <Box colorIndex="light-2">
            <Box
              pad="large"
              style={{
                borderRadius: "5px",
                minHeight: "200px"
              }}
            >
              <Box
                responsive={false}
                direction="row"
                align="center"
                justify="between"
              >
                <Loader height={30} width={20} />
                <Loader height={20} width={10} />
              </Box>
              <Box
                direction="row"
                align="center"
                margin={{ vertical: "small" }}
                responsive={false}
              >
                <Loader height={20} width={10} />
              </Box>
              <Box>
                <Loader height={10} width={90} margin="5px 0" />
                <Loader height={10} width={92} margin="5px 0" />
                <Loader height={10} width={94} margin="5px 0" />
                <Loader height={10} width={96} margin="5px 0" />
                <Loader height={10} width={98} margin="5px 0" />
                <Loader height={10} width={100} margin="5px 0" />
              </Box>
            </Box>
          </Box>
          <Box
            margin={{ top: "medium" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)"
            }}
          >
            <Box className="collection-grid-large-column" pad="small">
              <Box>
                <Loader height={20} width={10} />
                <Box margin={{ top: "small" }}>
                  <Loader height={20} width={80} margin="5px 0" />
                  <Loader height={20} width={82} margin="5px 0" />
                  <Loader height={20} width={84} margin="5px 0" />
                  <Loader height={20} width={86} margin="5px 0" />
                  <Loader height={20} width={88} margin="5px 0" />
                  <Loader height={20} width={90} margin="5px 0" />
                </Box>
              </Box>
              <Box margin={{ top: "medium" }}>
                <Loader height={20} width={10} />
                <Box margin={{ top: "small" }}>
                  <Loader height={20} width={80} margin="5px 0" />
                  <Loader height={20} width={82} margin="5px 0" />
                  <Loader height={20} width={84} margin="5px 0" />
                  <Loader height={20} width={86} margin="5px 0" />
                  <Loader height={20} width={88} margin="5px 0" />
                  <Loader height={20} width={90} margin="5px 0" />
                </Box>
              </Box>
              <Box margin={{ top: "medium" }}>
                <Loader height={20} width={10} />
                <Box margin={{ top: "small" }}>
                  <Loader height={20} width={80} margin="5px 0" />
                  <Loader height={20} width={82} margin="5px 0" />
                  <Loader height={20} width={84} margin="5px 0" />
                  <Loader height={20} width={86} margin="5px 0" />
                  <Loader height={20} width={88} margin="5px 0" />
                  <Loader height={20} width={90} margin="5px 0" />
                </Box>
              </Box>
            </Box>
            <Box
              pad="small"
              className="collection-grid-small-column"
              direction="row"
              responsive={false}
            >
              <Box
                style={{
                  width: "1px",
                  background: "rgba(0,0,0,.2)"
                }}
                className="horizontal-line"
              />
              <Box margin={{ left: "medium" }} flex>
                <Loader height={20} width={30} margin="5px 0" />
                <Box>
                  <Box colorIndex="light-2" pad="small" flex>
                    <Loader height={15} width={20} margin="5px 0" />
                    <Box direction="row" wrap align="center">
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                    </Box>
                  </Box>
                </Box>
                <Box margin={{ vertical: "medium" }}>
                  <Box colorIndex="light-2" pad="small" flex>
                    <Loader height={15} width={20} margin="5px 0" />
                    <Box direction="row" wrap align="center">
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                    </Box>
                  </Box>
                </Box>
                <Box>
                  <Box colorIndex="light-2" pad="small" flex>
                    <Loader height={15} width={20} margin="5px 0" />
                    <Box direction="row" wrap align="center">
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                      <Loader height={15} width={10} margin="10px" />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </DocumentTitle>
  );
};

export default CollectionLoader;

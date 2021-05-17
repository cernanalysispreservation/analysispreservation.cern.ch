import React from "react";
import { Box } from "grommet";
import "./draftLoader.css";
import Loading from "../partials/LoadingSkeleton";

const DraftPreviewLoader = () => {
  return (
    <Box
      flex={false}
      alignSelf="center"
      pad="medium"
      margin={{ vertical: "small", bottom: "large" }}
      size={{ width: "xxlarge" }}
    >
      <Box flex={true} direction="column">
        <Box>
          <Box
            direction="row"
            responsive={false}
            justify="between"
            pad={{ horizontal: "small" }}
            style={{ borderRadius: "3px", height: "40px" }}
            separator="all"
            align="center"
          >
            <Loading height={20} width={10} />
            <Loading height={20} width={10} />
            <Loading height={20} width={10} />
            <Loading height={20} width={10} />
            <Loading height={20} width={10} />
          </Box>
        </Box>
        <Box pad={{ vertical: "medium" }}>
          <Loading height={20} width={20} />
          <Box
            className="section_box_large"
            separator="all"
            style={{ borderRadius: "3px", overflow: "hidden" }}
            pad="large"
            margin={{ vertical: "small" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Loading height={20} width={30} margin="0 0 5px 0" />
              <Loading height={20} width={50} margin="0 0 5px 0" />
              <Loading height={20} width={70} margin="0 0 5px 0" />
              <Loading height={20} width={90} margin="0 0 5px 0" />
            </Box>
            <Box pad={{ horizontal: "small" }} margin={{ vertical: "small" }}>
              <Loading height={20} width={30} margin="0 0 5px 0" />
              <Loading height={20} width={50} margin="0 0 5px 0" />
              <Loading height={20} width={70} margin="0 0 5px 0" />
              <Loading height={20} width={90} margin="0 0 5px 0" />
            </Box>
            <Box pad={{ horizontal: "small" }} margin={{ vertical: "small" }}>
              <Loading height={20} width={30} margin="0 0 5px 0" />
              <Loading height={20} width={50} margin="0 0 5px 0" />
              <Loading height={20} width={70} margin="0 0 5px 0" />
              <Loading height={20} width={90} margin="0 0 5px 0" />
            </Box>
          </Box>
        </Box>
        <Box margin={{ vertical: "small" }}>
          <Loading height={20} width={20} margin="0 0 10px 0 " />
          <Box
            className="section_box_small"
            separator="all"
            style={{ borderRadius: "3px", overflow: "hidden" }}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Loading height={20} width={30} margin="0 0 5px 0" />
              <Loading height={20} width={40} margin="0 0 5px 0" />
              <Loading height={20} width={50} margin="0 0 5px 0" />
            </Box>
          </Box>
        </Box>
        <Box margin={{ vertical: "small" }}>
          <Loading height={20} width={20} margin="0 0 10px 0 " />
          <Box
            className="section_box_small"
            separator="all"
            style={{ borderRadius: "3px", overflow: "hidden" }}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Loading height={20} width={30} margin="0 0 5px 0" />
              <Loading height={20} width={40} margin="0 0 5px 0" />
              <Loading height={20} width={50} margin="0 0 5px 0" />
            </Box>
          </Box>
        </Box>
        <Box margin={{ vertical: "small" }}>
          <Loading height={20} width={20} margin="0 0 10px 0 " />
          <Box
            className="section_box_small"
            separator="all"
            style={{ borderRadius: "3px", overflow: "hidden" }}
            pad={{ horizontal: "large", vertical: "medium" }}
          >
            <Box pad={{ horizontal: "small" }}>
              <Loading height={20} width={30} margin="0 0 5px 0" />
              <Loading height={20} width={40} margin="0 0 5px 0" />
              <Loading height={20} width={50} margin="0 0 5px 0" />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

DraftPreviewLoader.propTypes = {};

export default DraftPreviewLoader;

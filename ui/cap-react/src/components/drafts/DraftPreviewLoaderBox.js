import React from "react";
import Loading from "../partials/LoadingSkeleton";
import { Box } from "grommet";
import "./draftLoader.css";

const DraftPreviewLoaderBox = () => {
  return (
    <Box pad="medium">
      <Loading height={20} width={100} margin="0 0 5px 0" />
      <Loading height={20} width={100} margin="0 0 5px 0" />
      <Loading height={20} width={100} margin="0 0 5px 0" />
      <Loading height={20} width={100} margin="0 0 5px 0" />
      <Loading height={20} width={100} margin="0 0 5px 0" />
      <Loading height={20} width={100} margin="0 0 5px 0" />
      <Loading height={20} width={100} margin="0 0 5px 0" />
    </Box>
  );
};

export default DraftPreviewLoaderBox;

import React from "react";
import { Box, Sidebar } from "grommet";
import SectionHeader from "./SectionHeader";
import "../draftLoader.css";
import HorizontalWithText from "../../partials/HorizontalWithText";
import Loading from "../../partials/LoadingSkeleton";

const DepositSidebarLoading = () => {
  return (
    <Sidebar
      full={false}
      colorIndex="light-2"
      className="lg-row"
      style={{ height: "100%" }}
    >
      <Box
        flex={false}
        pad="none"
        size={{ width: { min: "medium" } }}
        separator="bottom"
        margin={{ bottom: "medium" }}
      >
        <Box flex={false} pad="small" style={{ fontWeight: "100" }}>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            wrap={false}
          >
            ID
            <Loading width={30} height={15} />
          </Box>

          <Box
            direction="row"
            wrap={false}
            justify="between"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            <span>Collection</span>
            <Loading width={30} height={15} />
          </Box>

          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
            data-cy="deposit-status-tag"
          >
            <span>Status</span>
            <Loading width={30} height={15} />
          </Box>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            Creator
            <Loading width={30} height={15} />
          </Box>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            Created
            <Loading width={30} height={15} />
          </Box>
          <Box
            justify="between"
            direction="row"
            margin={{ bottom: "small" }}
            responsive={false}
            align="center"
          >
            Last Updated
            <Loading width={30} height={15} />
          </Box>
        </Box>
      </Box>
      <Box flex={true} pad="none" colorIndex="light-2">
        <SectionHeader label="Files | Data | Repos" uppercase={true} />
        <HorizontalWithText
          text="All Files"
          background={"#f5f5f5"}
          color={"#000"}
        />
        <Box align="center" style={{ marginTop: "5px" }}>
          <Loading width={80} height={20} margin="0 0 5px 0 " />
          <Loading width={80} height={20} margin="0 0 5px 0 " />
        </Box>
        <HorizontalWithText
          text="All Repositories"
          background={"#f5f5f5"}
          color={"#000"}
        />
        <Box align="center" style={{ marginTop: "5px" }}>
          <Loading width={80} height={20} margin="0 0 5px 0 " />
          <Loading width={80} height={20} margin="0 0 5px 0 " />
        </Box>
      </Box>
    </Sidebar>
  );
};

DepositSidebarLoading.propTypes = {};

export default DepositSidebarLoading;

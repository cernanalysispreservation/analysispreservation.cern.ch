import React from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import TimeAgo from "react-timeago";
import { FaGithub, FaGitlab } from "react-icons/fa";

import ImageIcon from "grommet/components/icons/base/Image";
import ServerIcon from "grommet/components/icons/base/Servers";
import PdfIcon from "grommet/components/icons/base/DocumentPdf";
import ZipIcon from "grommet/components/icons/base/DocumentZip";
import LockIcon from "grommet/components/icons/base/FormLock";
import TextIcon from "grommet/components/icons/base/DocumentText";
import CsvIcon from "grommet/components/icons/base/DocumentCsv";
import HtmlIcon from "grommet/components/icons/base/StandardsHtml5";

import Code from "grommet/components/icons/base/Code";
import CSSIcon from "grommet/components/icons/base/StandardsCss3";
import PlatformReactjs from "grommet/components/icons/base/PlatformReactjs";
import Cli from "grommet/components/icons/base/Cli";

const InfoArrayBox = ({ items, type }) => {
  const renderResourceIcon = resource => {
    const collection = {
      "github.com": (
        <Box margin={{ right: "small" }}>
          <FaGithub size="18" />
        </Box>
      ),
      "gitlab.com": (
        <Box margin={{ right: "small" }}>
          <FaGitlab size="18" />
        </Box>
      ),
      "application/gzip": <ZipIcon type="status" size="xsmall" />,
      "application/zip": <ZipIcon type="status" size="xsmall" />,
      "application/pdf": <PdfIcon type="status" size="xsmall" />,
      "application/pkcs8": <LockIcon type="status" size="xsmall" />,
      "application/octet-stream": <ServerIcon type="status" size="xsmall" />,
      "application/javascript": <PlatformReactjs type="status" size="xsmall" />,
      "application/x-sh": <Cli type="status" size="xsmall" />,
      "text/plain": <TextIcon type="status" size="xsmall" />,
      "text/csv": <CsvIcon type="status" size="xsmall" />,
      "text/json": <HtmlIcon type="status" size="xsmall" />,
      "text/html": <HtmlIcon type="status" size="xsmall" />,
      "text/css": <CSSIcon type="status" size="xsmall" />,
      "text/x-python": <Code type="status" size="xsmall" />,
      "image/png": <ImageIcon type="status" size="xsmall" />,
      "image/jpg": <ImageIcon type="status" size="xsmall" />,
      "image/jpeg": <ImageIcon type="status" size="xsmall" />
    };

    return collection[resource];
  };

  const renderBoxByType = item => {
    const typeCollection = {
      repositories: (
        <Box direction="row" justify="between" responsive={false}>
          <Box direction="row" responsive={false}>
            <Box align="center" justify="center">
              {renderResourceIcon(item.host)}
            </Box>
            {item.owner}/{item.name} {item.branch && [item.branch]}
          </Box>
          <Box>{item.event_type}</Box>
        </Box>
      ),
      files: (
        <Box direction="row" justify="between" responsive={false}>
          <Box direction="row" responsive={false}>
            <Box margin={{ right: "small" }} align="center" justify="center">
              {item[1] && renderResourceIcon(item[1].mimetype)}
            </Box>
            <Box>{item[0]}</Box>
          </Box>
          <Box>
            {item[1] && <TimeAgo date={item[1].created} minPeriod="60" />}
          </Box>
        </Box>
      )
    };

    return typeCollection[type];
  };
  return (
    <Box>
      {items.map((item, index) => (
        <Box
          key={index}
          colorIndex={index % 2 === 0 ? "light-2" : "light-1"}
          pad="small"
          justify="between"
        >
          {renderBoxByType(item)}
        </Box>
      ))}
    </Box>
  );
};

InfoArrayBox.propTypes = {
  items: PropTypes.object,
  type: PropTypes.string
};

export default InfoArrayBox;

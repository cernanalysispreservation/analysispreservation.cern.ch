import React from "react";
import PropTypes from "prop-types";
import NoteIcon from "grommet/components/icons/base/Note";
import ImageIcon from "grommet/components/icons/base/Image";
import ServerIcon from "grommet/components/icons/base/Servers";
import PdfIcon from "grommet/components/icons/base/DocumentPdf";
import ZipIcon from "grommet/components/icons/base/DocumentZip";
import LockIcon from "grommet/components/icons/base/FormLock";
import MusicIcon from "grommet/components/icons/base/Music";
import BookIcon from "grommet/components/icons/base/Bookmark";
import D3Icon from "grommet/components/icons/base/3d";
import TextIcon from "grommet/components/icons/base/DocumentText";
import CsvIcon from "grommet/components/icons/base/DocumentCsv";
import HtmlIcon from "grommet/components/icons/base/StandardsHtml5";
import VideoIcon from "grommet/components/icons/base/Video";

const GetIcon = mimetype => {
  if (!mimetype) {
    return <NoteIcon type="status" size="xlarge" />;
  }

  let type, subtype;
  type = mimetype.split("/")[0];
  subtype = mimetype.split("/")[1];

  const typeToIcon = {
    application: {
      "octet-stream": <ServerIcon type="status" size="xlarge" />,
      pdf: <PdfIcon type="status" size="xlarge" />,
      pkcs8: <LockIcon type="status" size="xlarge" />,
      zip: <ZipIcon type="status" size="xlarge" />
    },
    audio: {
      default: <MusicIcon type="small" size="xlarge" />
    },
    font: {
      default: <BookIcon type="status" size="xlarge" />
    },
    image: {
      default: <ImageIcon type="status" size="xlarge" />
    },
    model: {
      default: <D3Icon type="status" size="xlarge" />
    },
    text: {
      plain: <TextIcon type="status" size="xlarge" />,
      csv: <CsvIcon type="status" size="xlarge" />,
      html: <HtmlIcon type="status" size="xlarge" />
    },
    video: {
      default: <VideoIcon type="status" size="xlarge" />
    }
  };

  if (typeToIcon[type][subtype]) {
    return typeToIcon[type][subtype];
  } else if (typeToIcon[type]["default"]) {
    return typeToIcon[type]["default"];
  } else {
    return <NoteIcon type="status" size="xlarge" />;
  }
};

GetIcon.propTypes = {
  mimetype: PropTypes.string
};

export default GetIcon;

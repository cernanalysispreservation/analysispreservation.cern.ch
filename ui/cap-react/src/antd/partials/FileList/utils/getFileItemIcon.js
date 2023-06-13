import {
  AudioOutlined,
  BgColorsOutlined,
  CarryOutOutlined,
  CloudServerOutlined,
  CodeOutlined,
  CodepenOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FileZipOutlined,
  FontSizeOutlined,
  VideoCameraOutlined,
  Html5Outlined,
  FolderOutlined,
} from "@ant-design/icons";

export const _getIcon = mimetype => {
  if (!mimetype) {
    return <FolderOutlined />;
  }

  let type, subtype;
  type = mimetype.split("/")[0];
  subtype = mimetype.split("/")[1];

  const typeToIcon = {
    application: {
      "octet-stream": <CloudServerOutlined />,
      pdf: <FilePdfOutlined />,
      // pkcs8: <LockIcon type="status" size="xsmall" />,
      zip: <FileZipOutlined />,
      gzip: <FileZipOutlined />,
      "x-sh": <CodeOutlined />,
      javascript: <CodepenOutlined />,
    },
    audio: {
      default: <AudioOutlined />,
    },
    font: {
      default: <FontSizeOutlined />,
    },
    image: {
      default: <FileImageOutlined />,
    },
    model: {
      // default: <D3Icon type="status" size="xsmall" />
    },
    text: {
      plain: <FileTextOutlined />,
      // csv: <CsvIcon type="status" size="xsmall" />,
      // json: <HtmlIcon type="status" size="xsmall" />,
      html: <Html5Outlined />,
      css: <BgColorsOutlined />,
      "x-python": <CodeOutlined />,
    },
    video: {
      default: <VideoCameraOutlined />,
    },
  };

  if (typeToIcon[type][subtype]) {
    return typeToIcon[type][subtype];
  } else if (typeToIcon[type]["default"]) {
    return typeToIcon[type]["default"];
  } else {
    return <CarryOutOutlined />;
  }
};

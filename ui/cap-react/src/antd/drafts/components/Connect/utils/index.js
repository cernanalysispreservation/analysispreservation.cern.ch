import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";

export const getIcon = host => {
  switch (host) {
    case "github.com":
      return <GithubOutlined />;
    case "gitlab.cern.ch":
      return <GitlabOutlined />;
    default:
      return null;
  }
};

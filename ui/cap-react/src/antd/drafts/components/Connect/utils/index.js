import React from "react";
import { GithubOutlined, GitlabOutlined } from "@ant-design/icons";

export const getIcon = host =>
  host.includes("github") ? <GithubOutlined /> : <GitlabOutlined />;

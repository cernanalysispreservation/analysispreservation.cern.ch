import React from "react";
import PropTypes from "prop-types";
import { Button, Divider, PageHeader, Row, Space, Tag, Typography } from "antd";
import { Route } from "react-router-dom";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import DepositFilesList from "../../../../components/drafts/components/DepositFilesList";
import { canEdit } from "../../utils/permissions";
import { DRAFT_ITEM } from "../../../../components/routes";
import Timeago from "react-timeago";

const SideBar = ({
  id,
  schema = { fullname: "", version: "" },
  status,
  created_by,
  recid,
  created,
  updated,
  canAdmin,
  canUpdate,
  files,
  links,
  toggleFilemanagerLayer,
  getBucketById
}) => {
  const contents = [
    {
      title: <Typography.Text>ID</Typography.Text>,
      content: (
        <Typography.Text ellipsis copyable>
          {id}
        </Typography.Text>
      )
    },
    {
      title: <Typography.Text>Collection</Typography.Text>,
      content: schema && (
        <Tag>
          {schema.fullname} v{schema.version}
        </Tag>
      )
    },
    {
      title: <Typography.Text>Status</Typography.Text>,
      content: (
        <Tag color={status === "published" ? "magenta" : "blue"}>{status}</Tag>
      )
    },
    {
      title: <Typography.Text>Creator</Typography.Text>,
      content: (
        <Typography.Text>{created_by && created_by.email}</Typography.Text>
      )
    },
    {
      title: <Typography.Text>Published URL</Typography.Text>,
      content: recid ? (
        <Tag color="magenta">{recid}</Tag>
      ) : (
        <Typography.Text>Not published yet</Typography.Text>
      )
    },
    {
      title: <Typography.Text>Created</Typography.Text>,
      content: (
        <Typography.Text strong>
          {created && <Timeago date={created} minPeriod="60" />}
        </Typography.Text>
      )
    },
    {
      title: <Typography.Text>Last Updated</Typography.Text>,
      content: (
        <Typography.Text strong>
          {updated && <Timeago date={updated} minPeriod="60" />}
        </Typography.Text>
      )
    }
  ];
  return (
    <Row style={{ backgroundColor: "#fff", height: "100%" }}>
      <Space direction="vertical" style={{ width: "100%", padding: "10px" }}>
        {contents.map((content, idx) => (
          <Row justify="space-between" key={idx}>
            {content.title}
            {content.content}
          </Row>
        ))}
        <Divider />
        <PageHeader
          title="Files | Data | Repos"
          extra={[
            status != "published" &&
              canEdit(canAdmin, canUpdate) && (
                <Route
                  path={DRAFT_ITEM}
                  render={() => (
                    <Button
                      key="refresh"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        let { bucket } = links;
                        let bucket_id = bucket.split("/").pop();
                        getBucketById(bucket_id);
                      }}
                    />
                  )}
                />
              ),
            status != "published" &&
              canEdit(canAdmin, canUpdate) && (
                <Route
                  path={DRAFT_ITEM}
                  render={() => (
                    <Button
                      key="add"
                      icon={<PlusOutlined />}
                      onClick={toggleFilemanagerLayer}
                    />
                  )}
                />
              )
          ]}
        />
        <DepositFilesList files={files} />
      </Space>
    </Row>
  );
};

SideBar.propTypes = {
  id: PropTypes.string,
  schema: PropTypes.object,
  status: PropTypes.string,
  created_by: PropTypes.object,
  recid: PropTypes.string,
  created: PropTypes.string,
  updated: PropTypes.string,
  canAdmin: PropTypes.bool,
  canUpdate: PropTypes.bool,
  files: PropTypes.object,
  links: PropTypes.object,
  getBucketById: PropTypes.func,
  toggleFilemanagerLayer: PropTypes.func
};

export default SideBar;

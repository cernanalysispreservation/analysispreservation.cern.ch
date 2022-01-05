import React, { useState } from "react";
import { transformSchema } from "../../partials/Utils/schema";
import PropTypes from "prop-types";
import {
  PageHeader,
  Space,
  Tag,
  Button,
  Row,
  Col,
  Radio,
  Grid,
  Layout
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import JSONSchemaPreviewer from "../../partials/JSONSchemaPreviewer";

import { shouldDisplayTabButton } from "../utils";
import SideBar from "./SideBar";
import Reviews from "../../partials/Reviews";

const Preview = ({
  history,
  files,
  status,
  schemaType,
  draft_id,
  canUpdate,
  id,
  metadata = { general_title: "" },
  schemas = { schema: {}, uiSchema: {} }
}) => {
  const [display, setDisplay] = useState("tabView");
  const [displayFiles, setDisplayFiles] = useState(false);
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  const displayProps =
    display == "tabView" ? { xxl: 19 } : { lg: 15, sm: 18, xs: 22 };
  return (
    <Layout style={{ height: "100%", padding: "0" }}>
      <PageHeader
        style={{ background: "#fff", marginBottom: "10px", padding: "10px" }}
        title={
          <Space direction="vertical">
            {metadata.general_title}
            <Space style={{ width: "100%" }} wrap>
              <Tag color="purple">Published</Tag>
              <Tag>{id}</Tag>
              {schemaType && (
                <Tag>
                  {schemaType.fullname} v{schemaType.version}
                </Tag>
              )}
            </Space>
          </Space>
        }
        extra={
          <Space style={{ width: "100%" }} wrap>
            <Button
              disabled={!canUpdate}
              key="edit"
              icon={<EditOutlined />}
              onClick={() =>
                history.push({
                  pathname: `/drafts/${draft_id}`,
                  from: location.pathname,
                  pageFrom: "Published Preview"
                })
              }
            >
              Edit
            </Button>
            <Reviews key="addReview" isReviewingPublished action="add" />
            <Reviews key="showReviews" isReviewingPublished action="show" />
            {!screens.xxl && (
              <Button key="files" onClick={() => setDisplayFiles(true)}>
                Show Files
              </Button>
            )}
          </Space>
        }
      >
        {shouldDisplayTabButton(schemas) && (
          <Radio.Group
            defaultValue={display}
            size="small"
            buttonStyle="solid"
            onChange={e => setDisplay(e.target.value)}
          >
            <Space>
              <Radio.Button value="tabView">Tabs</Radio.Button>
              <Radio.Button value="list">List</Radio.Button>
            </Space>
          </Radio.Group>
        )}
      </PageHeader>
      <Row
        style={{ paddingRight: "10px", height: "100%", overflowX: "hidden" }}
      >
        <Col xxl={19} style={{ height: "100%" }}>
          <Row
            style={{ height: "100%", overflowX: "hidden" }}
            justify={display != "tabView" && "center"}
          >
            <Col {...displayProps}>
              <JSONSchemaPreviewer
                display={display}
                formData={metadata}
                schema={transformSchema(schemas.schema)}
                schemaType={schemaType}
                uiSchema={schemas.uiSchema}
                onChange={() => {}}
                isPublished
              >
                <span />
              </JSONSchemaPreviewer>
            </Col>
          </Row>
        </Col>
        <SideBar
          visibleFileDrawer={displayFiles}
          files={files}
          onClose={() => setDisplayFiles(false)}
          status={status}
        />
      </Row>
    </Layout>
  );
};

Preview.propTypes = {
  history: PropTypes.object,
  schemaType: PropTypes.object,
  schemas: PropTypes.object,
  metadata: PropTypes.object,
  draft_id: PropTypes.string,
  id: PropTypes.string,
  canUpdate: PropTypes.bool,
  files: PropTypes.object,
  status: PropTypes.string
};

export default Preview;

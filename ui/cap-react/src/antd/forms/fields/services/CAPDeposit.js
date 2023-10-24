import PropTypes from "prop-types";
import { Avatar, Card, Col, Divider, Modal, Row, Space, Tag, Typography } from "antd";
import { stringToHslColor } from "../../../utils";
import { EyeFilled, EyeInvisibleFilled, LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import CodeEditor from "../../../utils/CodeEditor";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import CAPLogo from "./svg/capLogo";
import { Link } from "react-router-dom";

const CAPDeposit = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Modal open={showModal} onCancel={() => setShowModal(false)}>
        <CodeEditor
          lang={json}
          value={JSON.stringify(data, null, 2)}
          lint={jsonParseLinter}
          isReadOnly={true}
          height="calc(100vh - 325px)"
        />
      </Modal>
      <Card size="small" bordered={false} actions={[]}>
          <Card.Meta
            size="small"
            avatar={<Tag>{data.schema.fullname}</Tag>}
            title={data?.metadata?.general_title || "No title"}
            description={
            <Space split={<Divider type="vertical" />}>
              <Typography.Link target="_blank" href={data?.links?.self}>
              <LinkOutlined  />
              </Typography.Link>
              <EyeFilled onClick={() => setShowModal(true)} />
            </Space>

            }
          />
      </Card>
    </>
  );
};

CAPDeposit.propTypes = {
  data: PropTypes.object,
};

export default CAPDeposit;

import PropTypes from "prop-types";
import { Card, Divider, Modal, Space, Tag, Typography } from "antd";
import { EyeFilled, LinkOutlined } from "@ant-design/icons";
import { useState } from "react";
import { CodeEditor } from "react-formule";

const CAPDeposit = ({ data }) => {
  const [showModal, setShowModal] = useState(false);

  console.log(JSON.stringify(data, null, 2));

  return (
    <>
      <Modal open={showModal} onCancel={() => setShowModal(false)}>
        <CodeEditor
          lang="json"
          initialValue={JSON.stringify(data, null, 2)}
          lint="json"
          isEditable={false} // TODO: Change to !isEditable?
          height="calc(100vh - 325px)"
        />
      </Modal>
      <Card size="small" bordered={false} actions={[]}>
        <Space
          style={{ flex: 1, display: "flex", justifyContent: "space-between" }}
        >
          <Space style={{ flex: 1 }}>
            <Card.Meta
              size="small"
              avatar={
                data?.schema?.fullname && <Tag>{data?.schema?.fullname}</Tag>
              }
              title={data?.metadata?.general_title || "No title"}
              description={"No description"}
            />
          </Space>

          <Space split={<Divider type="vertical" />}>
            <Typography.Link target="_blank" href={data?.links?.self}>
              <LinkOutlined />
            </Typography.Link>
            <EyeFilled onClick={() => setShowModal(true)} />
          </Space>
        </Space>
      </Card>
    </>
  );
};

CAPDeposit.propTypes = {
  data: PropTypes.object,
};

export default CAPDeposit;

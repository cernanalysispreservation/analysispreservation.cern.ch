import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Table, Button, Modal, Empty, Input, Form } from "antd";
import EllipsisMiddle from "../../partials/EllipsisMiddle";

const Applications = ({
  tokens,
  createToken,
  revokeToken,
  getUsersAPIKeys,
}) => {
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getUsersAPIKeys();
  }, []);

  return (
    <React.Fragment>
      <Modal
        open={displayTokenModal}
        onCancel={() => setDisplayTokenModal(false)}
        title="New OAuth Application"
        okText="Create Token"
        onOk={() => form.submit()}
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ tokenAccessName: "" }}
          onFinish={values => {
            createToken({
              name: values.tokenAccessName,
              scopes: ["deposit:write"],
            });
            form.resetFields();
            setDisplayTokenModal(false);
          }}
        >
          <Form.Item
            label="Provide Access Token"
            name="tokenAccessName"
            rules={[{ required: true }]}
            data-cy="settingsTokenInput"
          >
            <Input placeholder="Token Access name" />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        title="Your OAuth Tokens"
        extra={
          tokens.size > 0 && (
            <Button
              type="primary"
              data-cy="settingsAddToken"
              onClick={() => setDisplayTokenModal(true)}
            >
              Create Token
            </Button>
          )
        }
      >
        {tokens.size > 0 ? (
          <Table
            data-cy="settingsTableTokens"
            pagination={false}
            dataSource={tokens
              .map((token, idx) => ({
                key: idx,
                id: token.t_id,
                name: token.name,
                access_token: token.access_token,
              }))
              .toJS()
              .sort((a, b) => a.id - b.id)}
            columns={[
              { title: "Name", dataIndex: "name", key: "name", width: "30%" },
              {
                title: "ApiKey",
                width: "50%",
                dataIndex: "access_token",
                key: "access_token",
                ellipsis: true,
                render: (txt, r) => {
                  return (
                    <EllipsisMiddle
                      suffixCount={5}
                      copyable={{ text: r.access_token }}
                    >
                      {txt}
                    </EllipsisMiddle>
                  );
                },
              },
              {
                title: "Action",
                width: "20%",
                key: "action",
                render: token => (
                  <Button
                    data-cy={token.name}
                    type="link"
                    onClick={() => revokeToken(token.id, token.key)}
                  >
                    Revoke
                  </Button>
                ),
              },
            ]}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Add a new token to grant access to CAP client and API"
          >
            <Button
              type="primary"
              data-cy="settingsAddToken"
              onClick={() => setDisplayTokenModal(true)}
            >
              Create Token
            </Button>
          </Empty>
        )}
      </Card>
    </React.Fragment>
  );
};

Applications.propTypes = {
  createToken: PropTypes.func,
  revokeToken: PropTypes.func,
  getUsersAPIKeys: PropTypes.func,
  tokens: PropTypes.object,
};

export default Applications;

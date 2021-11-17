import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Table,
  Button,
  Modal,
  Empty,
  Input,
  Form,
  Typography
} from "antd";

const Applications = ({
  tokens,
  createToken,
  revokeToken,
  getUsersAPIKeys
}) => {
  const filteredTokens = () => tokens.filter(token => token !== undefined);
  const [displayTokenModal, setDisplayTokenModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(
    () => {
      getUsersAPIKeys();
    },
    [filteredTokens()]
  );

  return (
    <React.Fragment>
      <Modal
        visible={displayTokenModal}
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
              scopes: ["deposit:write"]
            });
            form.resetFields();
            setDisplayTokenModal(false);
          }}
        >
          <Form.Item
            label="Provide Access Token"
            name="tokenAccessName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Token Access name" />
          </Form.Item>
        </Form>
      </Modal>
      <Card
        title="Your OAuth Tokens"
        extra={
          filteredTokens().size > 0 && (
            <Button type="primary" onClick={() => setDisplayTokenModal(true)}>
              Create Token
            </Button>
          )
        }
      >
        {filteredTokens().size > 0 ? (
          <Table
            data-cy="settings-table-token-id"
            pagination={false}
            dataSource={filteredTokens()
              .map((token, idx) => ({
                key: idx,
                id: token.t_id,
                name: token.name,
                access_token: token.access_token
              }))
              .toJS()}
            columns={[
              { title: "ID", dataIndex: "id", key: "id" },
              { title: "Name", dataIndex: "name", key: "name" },
              {
                title: "ApiKey",
                dataIndex: "access_token",
                key: "access_token",
                render: txt => <Typography.Text copyable>{txt}</Typography.Text>
              },
              {
                title: "Action",
                key: "action",
                render: token => (
                  <Button
                    data-cy={token.name}
                    type="link"
                    onClick={() => revokeToken(token.id, token.key)}
                  >
                    Revoke
                  </Button>
                )
              }
            ]}
          />
        ) : (
          <Empty description="Add a new token to grant access to CAP client and API">
            <Button type="primary" onClick={() => setDisplayTokenModal(true)}>
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
  tokens: PropTypes.object
};

export default Applications;

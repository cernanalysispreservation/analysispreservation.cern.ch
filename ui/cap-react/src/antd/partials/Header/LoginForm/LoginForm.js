import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Menu, Typography } from "antd";

const LoginForm = ({ loginLocalUser, history, authError }) => {
  const [form] = Form.useForm();

  return (
    <Menu>
      <Form
        style={{ background: "#fff", padding: "20px 10px" }}
        form={form}
        layout="vertical"
        initialValues={{ username: "info@inveniosoftware.org" }}
        onFinish={val =>
          loginLocalUser({
            ...val,
            next: history.location.state ? history.location.state.next : "/"
          })
        }
        size="large"
      >
        <Form.Item label="Username" required name="username">
          <Input placeholder="Give your username" />
        </Form.Item>
        <Form.Item label="Password" required name="password">
          <Input placeholder="Give your password" />
        </Form.Item>
        {authError && (
          <Typography.Text type="danger">{authError}</Typography.Text>
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Menu>
  );
};

LoginForm.propTypes = {
  loginLocalUser: PropTypes.func,
  history: PropTypes.object,
  authError: PropTypes.string
};

export default LoginForm;

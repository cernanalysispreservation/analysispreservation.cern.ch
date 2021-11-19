import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Button } from "antd";

const LoginForm = ({ loginLocalUser }) => {
  const [form] = Form.useForm();
  return (
    <Form
      style={{ background: "#fff", padding: "10px 20px" }}
      form={form}
      layout="vertical"
      initialValues={{ username: "info@inveniosoftware.org" }}
      onFinish={val => loginLocalUser({ ...val, next: "/" })}
    >
      <Form.Item label="Username" required name="username">
        <Input placeholder="Give your username" />
      </Form.Item>
      <Form.Item label="Password" required name="password">
        <Input placeholder="Give your password" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

LoginForm.propTypes = {
  loginLocalUser: PropTypes.func
};

export default LoginForm;

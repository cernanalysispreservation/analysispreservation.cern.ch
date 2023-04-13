import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Typography } from "antd";

const LoginForm = ({ loginLocalUser, history, authError }) => {
  const [form] = Form.useForm();

  return (
    <Form
      style={{ background: "#fff", padding: "20px 10px" }}
      form={form}
      layout="vertical"
      initialValues={{ username: "info@inveniosoftware.org" }}
      onFinish={val =>
        loginLocalUser({
          ...val,
          next: history.location.state ? history.location.state.next : "/",
        })
      }
      size="large"
    >
      <Form.Item label="Username" required name="username" data-cy="emailInput">
        <Input placeholder="Give your username" type="email" />
      </Form.Item>
      <Form.Item
        label="Password"
        required
        name="password"
        data-cy="passwordInput"
      >
        <Input placeholder="Give your password" type="password" />
      </Form.Item>
      {authError && (
        <Typography.Text data-cy="localLoginErrorMessage" type="danger">
          {authError}
        </Typography.Text>
      )}
      <Form.Item data-cy="submitButton">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

LoginForm.propTypes = {
  loginLocalUser: PropTypes.func,
  history: PropTypes.object,
  authError: PropTypes.string,
};

export default LoginForm;

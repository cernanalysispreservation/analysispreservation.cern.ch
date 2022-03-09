import React from "react";
import PropTypes from "prop-types";
import { Button, Form, Input } from "antd";

const CreateForm = ({ createContentType }) => {
  return (
    <Form name="basic" layout="vertical" onFinish={createContentType}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input schema name!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please input schema description!" }
        ]}
      >
        <Input.TextArea />
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

CreateForm.propTypes = {
  createContentType: PropTypes.func
};

export default CreateForm;

import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Space, Form, Input, Radio } from "antd";

const CreateForm = ({ contentTypes, updateModal, onCancel, createDraft }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    updateModal(form);
  }, []);

  return (
    <Space direction="vertical" size="large">
      <Form
        name="basic"
        layout="vertical"
        form={form}
        onFinish={values => {
          createDraft(
            { general_title: values.generalTitle },
            { name: values.type }
          );
          onCancel();
        }}
      >
        <Form.Item
          label="General Title"
          name="generalTitle"
          rules={[
            { required: true, message: "Title is mandatory for your analysis" }
          ]}
        >
          <Input placeholder="give your analysis title..." />
        </Form.Item>

        <Form.Item
          name="type"
          label="Type"
          rules={[
            { required: true, message: "Type is mandatory for your analysis" }
          ]}
        >
          <Radio.Group size="large" buttonStyle="solid">
            {contentTypes &&
              contentTypes.toJS().map(type => (
                <Radio.Button
                  style={{ margin: "5px" }}
                  value={type["deposit_group"]}
                  key={type["deposit_group"]}
                >
                  {type["name"]}
                </Radio.Button>
              ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Space>
  );
};

CreateForm.propTypes = {
  updateModal: PropTypes.func,
  createDraft: PropTypes.func,
  onCancel: PropTypes.func,
  contentTypes: PropTypes.object
};

export default CreateForm;
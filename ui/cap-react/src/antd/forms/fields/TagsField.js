import React, { useEffect, useRef, useState } from "react";

import { Form, Input, Tag, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "lodash";

const TagsField = ({ schema, onChange, readonly, formData }) => {
  const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  useEffect(
    () => {
      if (inputVisible) {
        inputRef.current.focus();
      }
    },
    [inputVisible]
  );

  useEffect(() => {
    setTags(getInitialTags());
  }, []);

  const getInitialTags = () => {
    if (!formData || isEmpty(formData)) {
      return [];
    } else if (schema.type === "array") {
      return formData;
    } else {
      return formData.split(schema.delimiter || ", ");
    }
  };

  const applyChanges = newTags => {
    setTags(newTags);
    if (schema.type === "array") {
      onChange(newTags);
    } else {
      onChange(newTags.join(schema.delimiter || ", "));
    }
  };

  const handleClose = removedTag => {
    const newTags = tags.filter(tag => tag !== removedTag);
    applyChanges(newTags);
  };

  const handleInputConfirm = onValid => {
    const reg = schema.tagPattern ? new RegExp(schema.tagPattern) : /.*/;
    if (inputValue && !tags.includes(inputValue) && reg.test(inputValue)) {
      const newTags = [...tags, inputValue];
      applyChanges(newTags);
      onValid();
    }
  };

  const resetInput = () => {
    setInputValue("");
    setInputVisible(false);
  };

  const handleEnter = e => {
    handleInputConfirm(resetInput);
    e.preventDefault();
  };

  const handleBlur = () => {
    handleInputConfirm(() => {});
    resetInput();
  };

  return (
    <Space size={[0, 8]} wrap>
      {tags.map(tag => (
        <Tag
          key={tag}
          closable={!readonly}
          onClose={() => handleClose(tag)}
          style={{ backgroundColor: "white" }}
        >
          {tag}
        </Tag>
      ))}
      {inputVisible && (
        <Form name="tags">
          <Form.Item
            name="newTag"
            style={{ marginBottom: 0 }}
            rules={[
              {
                pattern: schema.tagPattern
                  ? new RegExp(schema.tagPattern)
                  : /.*/,
                message: schema.tagPatternErrorMessage
                  ? schema.tagPatternErrorMessage
                  : `Does not match the pattern ${schema.tagPattern}`,
              },
            ]}
          >
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={{ width: 78 }}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onPressEnter={handleEnter}
            />
          </Form.Item>
        </Form>
      )}
      {!inputVisible &&
        !readonly && (
          <Tag
            onClick={() => setInputVisible(true)}
            style={{
              borderStyle: "dashed",
              cursor: "pointer",
              backgroundColor: "#F6F7F8",
            }}
          >
            <PlusOutlined /> New Tag
          </Tag>
        )}
    </Space>
  );
};

export default TagsField;

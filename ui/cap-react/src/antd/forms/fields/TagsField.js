import React, { useEffect, useRef, useState } from "react";

import { Form, Input, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import _ from "lodash";

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
    if (!formData || _.isEmpty(formData)) {
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

  const handleEnter = () => {
    handleInputConfirm(resetInput);
  };

  const handleBlur = () => {
    handleInputConfirm(() => {});
    resetInput();
  };

  return (
    <div>
      {tags.map(tag => (
        <Tag key={tag} closable={!readonly} onClose={() => handleClose(tag)}>
          {tag}
        </Tag>
      ))}
      {inputVisible && (
        <Form name="tags">
          <Form.Item
            name="newTag"
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
            style={{ borderStyle: "dashed", cursor: "pointer" }}
          >
            <PlusOutlined /> New Tag
          </Tag>
        )}
    </div>
  );
};

export default TagsField;

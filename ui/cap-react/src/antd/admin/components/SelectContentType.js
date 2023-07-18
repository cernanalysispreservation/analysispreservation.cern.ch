import PropTypes from "prop-types";
import { Button, Col, Row, Space } from "antd";
import CheckableTag from "antd/es/tag/CheckableTag";
import { useState } from "react";
import { PRIMARY_COLOR } from "../../utils";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
const SelectContentType = ({ contentTypes, selectEdit, selectView }) => {
  const [selectedTag, setSelectedTag] = useState();

  return (
    <>
      <Space size={[0, 8]} wrap>
        {contentTypes &&
          contentTypes.map(item => (
            <CheckableTag
              style={{ border: `1px solid ${PRIMARY_COLOR}` }}
              onChange={checked =>
                checked
                  ? setSelectedTag(item.get("deposit_group"))
                  : setSelectedTag(undefined)
              }
              checked={selectedTag === item.get("deposit_group")}
              key={item.get("deposit_group")}
              data-cy={"admin-predefined-content"}
            >
              {item.get("name")}
            </CheckableTag>
          ))}
      </Space>
      <Row justify="center" gutter={10} style={{ marginTop: "25px" }}>
        <Col>
          <Button
            disabled={!selectedTag}
            onClick={() => selectView(selectedTag)}
            icon={<EyeOutlined />}
            data-cy="viewSchemaButton"
          >
            View
          </Button>
        </Col>
        <Col>
          <Button
            disabled={!selectedTag}
            onClick={() => selectEdit(selectedTag)}
            type="primary"
            icon={<EditOutlined />}
            data-cy="editSchemaButton"
          >
            Edit
          </Button>
        </Col>
      </Row>
    </>
  );
};

SelectContentType.propTypes = {
  contentTypes: PropTypes.object,
  select: PropTypes.func,
};

export default SelectContentType;

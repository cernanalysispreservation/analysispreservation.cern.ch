import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import { selectProperty } from "../../../actions/schemaWizard";

import {
  AimOutlined,
  AppstoreOutlined,
  BookOutlined,
  BorderTopOutlined,
  CalendarOutlined,
  CheckSquareOutlined,
  CloudDownloadOutlined,
  ContainerOutlined,
  DownOutlined,
  FileOutlined,
  FontSizeOutlined,
  LinkOutlined,
  NumberOutlined,
  QuestionOutlined,
  SwapOutlined,
  TagOutlined,
  UnorderedListOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { Col, Row, Tag, Typography } from "antd";
import { isItTheArrayField } from "../utils";

const SchemaTreeItem = ({
  selectProperty,
  path,
  uiSchema,
  schema,
  display,
  updateDisplay,
}) => {
  // selects the item for the property editor
  const _onClick = () => {
    selectProperty(path);
  };

  const shouldBoxAcceptChildren = uiSchema => {
    return uiSchema["ui:field"] !== undefined;
  };

  const getIconByType = (uiSchema = {}, schema = {}) => {
    let type = "unknown";
    // in case we can not define the type of the element from the uiSchema,
    // extract the type from the schema
    if (
      !uiSchema ||
      (!uiSchema["ui:widget"] &&
        !uiSchema["ui:field"] &&
        !uiSchema["ui:object"])
    ) {
      type = schema.type === "string" ? "text" : schema.type;
    } else {
      if (uiSchema["ui:widget"]) {
        type = schema.format === "uri" ? schema.format : uiSchema["ui:widget"];
      }
      if (uiSchema["ui:field"]) {
        type = uiSchema["ui:field"];
      }
      if (uiSchema["ui:object"]) {
        type = uiSchema["ui:object"];
      }
    }

    return mapType2Icon[type];
  };

  return (
    <Tag
      style={{
        width: "100%",
        marginTop: "1px",
        marginBottom: "1px",
        padding: "5px 10px",
        opacity:
          uiSchema &&
          uiSchema["ui:options"] &&
          uiSchema["ui:options"].hidden &&
          0.5,
      }}
    >
      <Row gutter={8} onClick={_onClick} align="middle" wrap={false}>
        <Col flex="none">{getIconByType(uiSchema, schema)}</Col>
        <Col flex="auto">
          <Row
            style={{ width: "100%", marginTop: schema.title ? "-9px" : "0" }}
            justify="space-between"
            wrap={false}
            gutter={8}
          >
            <Col>
              <Typography.Text ellipsis>
                {path.schema[path.schema.length - 1]}
              </Typography.Text>
            </Col>
          </Row>
          {schema.title && (
            <Row
              style={{ width: "100%", marginTop: "-9px", marginBottom: "-9px" }}
            >
              <Col>
                <Typography.Text
                  type="secondary"
                  style={{ fontSize: "10px" }}
                  ellipsis
                >
                  {schema.title || "Untitled field"}
                </Typography.Text>
              </Col>
            </Row>
          )}
        </Col>
        <Col>
          {schema ? (
            <div>
              {schema.type == "object" && !shouldBoxAcceptChildren(uiSchema) ? (
                display ? (
                  <UpOutlined onClick={updateDisplay} />
                ) : (
                  <DownOutlined onClick={updateDisplay} />
                )
              ) : null}
              {isItTheArrayField(schema, uiSchema) ? (
                display ? (
                  <UpOutlined onClick={updateDisplay} />
                ) : (
                  <DownOutlined onClick={updateDisplay} />
                )
              ) : null}
            </div>
          ) : null}
        </Col>
      </Row>
    </Tag>
  );
};

SchemaTreeItem.propTypes = {
  schema: PropTypes.object,
  id: PropTypes.string,
  path: PropTypes.array,
  selectProperty: PropTypes.func,
  addProperty: PropTypes.func,
  addItem: PropTypes.func,
  type: PropTypes.string,
  colorIndex: PropTypes.string,
  display: PropTypes.bool,
  updateDisplay: PropTypes.func,
  uiSchema: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    selectProperty: path => dispatch(selectProperty(path)),
  };
}
export default connect(
  state => state,
  mapDispatchToProps
)(SchemaTreeItem);

let mapType2Icon = {
  object: <div>&#123;&#32;&#125;</div>,
  array: <UnorderedListOutlined />,
  select: <AppstoreOutlined />,
  text: <FontSizeOutlined />,
  date: <CalendarOutlined />,
  number: <NumberOutlined />,
  integer: <NumberOutlined />,
  checkbox: <CheckSquareOutlined />,
  radio: <AimOutlined />,
  switch: <SwapOutlined />,
  textarea: <ContainerOutlined />,
  CapFiles: <FileOutlined />,
  tags: <TagOutlined />,
  idFetcher: <CloudDownloadOutlined />,
  accordionObjectField: <BorderTopOutlined />,
  richeditor: <BookOutlined />,
  uri: <LinkOutlined />,
  unknown: <QuestionOutlined />,
};

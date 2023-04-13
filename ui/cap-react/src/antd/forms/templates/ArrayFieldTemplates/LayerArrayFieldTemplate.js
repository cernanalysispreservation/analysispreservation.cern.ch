import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Col, List, Modal, Row, Typography } from "antd";

import * as Sqrl from "squirrelly";

import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ErrorFieldIndicator from "../../error/ErrorFieldIndicator";

const LayerArrayFieldTemplate = ({ items = [] }) => {
  const [itemToDisplay, setItemToDisplay] = useState(null);
  const [visible, setVisible] = useState(false);

  const stringifyItem = (options, item) => {
    let stringifyTmpl = options ? options.stringifyTmpl : null;
    if (stringifyTmpl) {
      try {
        let str = Sqrl.render(stringifyTmpl, item);
        return str;
      } catch (_err) {
        return null;
      }
    }

    const stringify = options ? options.stringify : [],
      reducer = (acc, val) => (item[val] ? `${acc} ${item[val]}` : acc);

    return stringify ? stringify.reduce(reducer, "") : null;
  };
  useEffect(
    () => {
      if (items && itemToDisplay)
        setItemToDisplay({
          index: itemToDisplay.index,
          children: items[itemToDisplay.index].children,
        });
    },
    [items]
  );

  const getActionsButtons = item => {
    if (!item.hasToolbar) return [];

    return [
      <Row gutter={4}>
        {(item.hasMoveUp || item.hasMoveDown) && (
          <Col>
            <Row>
              <Button
                key="up"
                icon={
                  <Row justify="center">
                    <ArrowUpOutlined />
                  </Row>
                }
                onClick={item.onReorderClick(item.index, item.index - 1)}
                disabled={item.disabled || item.readonly || !item.hasMoveUp}
                type="link"
                size="small"
                style={{ height: "16px" }}
              />
            </Row>
            <Row>
              <Button
                key="down"
                icon={
                  <Row justify="center">
                    <ArrowDownOutlined />
                  </Row>
                }
                onClick={item.onReorderClick(item.index, item.index + 1)}
                disabled={item.disabled || item.readonly || !item.hasMoveDown}
                type="link"
                size="small"
                style={{ height: "16px" }}
              />
            </Row>
          </Col>
        )}
        {item.hasRemove && (
          <Col>
            <Button
              onClick={item.onDropIndexClick(item.index)}
              key="delete"
              danger
              icon={<DeleteOutlined />}
              disabled={item.disabled || item.readonly}
              type="link"
              size="small"
              style={{ height: "32px" }}
            />
          </Col>
        )}
      </Row>,
    ];
  };

  if (items.length < 1) return null;

  return (
    <React.Fragment>
      <Modal
        className="__Form__"
        destroyOnClose
        open={visible}
        onCancel={() => {
          setVisible(false);
          setItemToDisplay(null);
        }}
        onOk={() => {
          setVisible(false);
          setItemToDisplay(null);
        }}
        width={720}
      >
        {itemToDisplay && itemToDisplay.children}
      </Modal>

      <List
        className="layerArrayFieldList"
        style={{ overflow: "auto" }}
        dataSource={items}
        renderItem={item => (
          <ErrorFieldIndicator id={item.children.props.idSchema.$id}>
            <List.Item
              className="layerListItem"
              actions={getActionsButtons(item)}
              style={{
                border: "1px solid #f0f0f0",
                padding: "10px",
                marginBottom: "5px",
                backgroundColor: "white",
              }}
            >
              <List.Item.Meta
                title={
                  <Typography.Text ellipsis={{ rows: 1 }}>
                    {stringifyItem(
                      item.children.props.uiSchema["ui:options"],
                      item.children.props.formData
                    ) || `Item #${item.index + 1}`}
                  </Typography.Text>
                }
                onClick={() => {
                  setVisible(true);
                  setItemToDisplay({
                    index: item.index,
                    children: item.children,
                  });
                }}
              />
            </List.Item>
          </ErrorFieldIndicator>
        )}
      />
    </React.Fragment>
  );
};

LayerArrayFieldTemplate.propTypes = {
  items: PropTypes.array,
};

export default LayerArrayFieldTemplate;

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, List, Modal } from "antd";

import ArrowUpOutlined from "@ant-design/icons/ArrowUpOutlined";
import ArrowDownOutlined from "@ant-design/icons/ArrowDownOutlined";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";
import ErrorFieldIndicator from "../../error/ErrorFieldIndicator";

const LayerArrayFieldTemplate = ({ items = [] }) => {
  const [itemToDisplay, setItemToDisplay] = useState(null);
  const [visible, setVisible] = useState(false);

  const stringifyItem = (options, item) => {
    const stringify = options ? options.stringify : [],
      reducer = (acc, val) => (item[val] ? `${acc} ${item[val]}` : acc);

    return stringify ? stringify.reduce(reducer, "") : null;
  };
  useEffect(
    () => {
      if (items && itemToDisplay)
        setItemToDisplay({
          index: itemToDisplay.index,
          children: items[itemToDisplay.index].children
        });
    },
    [items]
  );

  const getActionsButtons = item => {
    if (!item.hasToolbar) return [];
    let toolbar = [];
    if (item.hasMoveUp || item.hasMoveDown)
      toolbar.push(
        <Button
          key="up"
          icon={<ArrowUpOutlined />}
          onClick={item.onReorderClick(item.index, item.index - 1)}
          disabled={item.disabled || item.readonly || !item.hasMoveUp}
        />
      );
    if (item.hasMoveUp || item.hasMoveDown)
      toolbar.push(
        <Button
          key="down"
          icon={<ArrowDownOutlined />}
          onClick={item.onReorderClick(item.index, item.index + 1)}
          disabled={item.disabled || item.readonly || !item.hasMoveDown}
        />
      );

    if (item.hasRemove)
      toolbar.push(
        <Button
          onClick={item.onDropIndexClick(item.index)}
          key="delete"
          danger
          icon={<DeleteOutlined />}
          disabled={item.disabled || item.readonly}
          type="primary"
        />
      );

    return toolbar;
  };
  if (items.length < 1) return null;

  return (
    <React.Fragment>
      <Modal
        className="__Form__"
        destroyOnClose
        visible={visible}
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
        className="LayerArrayFieldList"
        dataSource={items}
        renderItem={item => (
          <ErrorFieldIndicator id={item.children.props.idSchema.$id}>
            <List.Item actions={getActionsButtons(item)}>
              <List.Item.Meta
                title={
                  stringifyItem(
                    item.children.props.uiSchema["ui:options"],
                    item.children.props.formData
                  ) || `Item #${item.index + 1}`
                }
                onClick={() => {
                  setVisible(true);
                  setItemToDisplay({
                    index: item.index,
                    children: item.children
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
  items: PropTypes.array
};

export default LayerArrayFieldTemplate;

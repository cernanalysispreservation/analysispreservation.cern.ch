import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import PropertyKeyEditorForm from "./PropKeyEditorForm";

import { Radio, Space, Tabs, Typography } from "antd";
import _debounce from "lodash/debounce";
import { SIZE_OPTIONS } from "../utils";

const JUSTIFY_OPTIONS = ["start", "center", "end"];

const Customize = ({
  schema,
  uiSchema,
  onSchemaChange,
  onUiSchemaChange,
  path,
  _path,
}) => {
  const [justify, setJustify] = useState(() => "start");
  const [size, setSize] = useState("xlarge");

  useEffect(
    () => {
      if (uiSchema.toJS().hasOwnProperty("ui:options")) {
        setSize(uiSchema.toJS()["ui:options"].size);
        setJustify(uiSchema.toJS()["ui:options"].justify);
      }
    },
    [uiSchema]
  );

  const _onSchemaChange = data => {
    onSchemaChange(path.get("path").toJS(), data.formData);
  };
  const _onUiSchemaChange = data => {
    onUiSchemaChange(path.get("uiPath").toJS(), data.formData);
  };
  const sizeChange = newSize => {
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { size, ...restUIOptions } = uiOptions;

    size = newSize;
    let _uiOptions = { size, ...restUIOptions };

    onUiSchemaChange(path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions,
    });
  };

  const alignChange = newAlign => {
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { justify, ...restUIOptions } = uiOptions;

    justify = newAlign;
    let _uiOptions = { justify, ...restUIOptions };

    onUiSchemaChange(path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions,
    });
  };

  return (
    <Tabs className="scrollableTabs" centered>
      <Tabs.TabPane tab="Schema Settings" key="1">
        <PropertyKeyEditorForm
          schema={schema && schema.toJS()}
          uiSchema={uiSchema && uiSchema.toJS()}
          formData={schema && schema.toJS()}
          onChange={_debounce(_onSchemaChange, 500)}
          optionsSchemaObject="optionsSchema"
          optionsUiSchemaObject="optionsSchemaUiSchema"
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="UI Schema Settings" key="2">
        {_path.size != 0 ? (
          <PropertyKeyEditorForm
            schema={schema && schema.toJS()}
            uiSchema={uiSchema && uiSchema.toJS()}
            formData={uiSchema && uiSchema.toJS()}
            onChange={_debounce(_onUiSchemaChange, 500)}
            optionsSchemaObject="optionsUiSchema"
            optionsUiSchemaObject="optionsUiSchemaUiSchema"
          />
        ) : (
          <Space
            direction="vertical"
            style={{ padding: "0 12px", width: "100%" }}
          >
            <Typography.Text>Size Options</Typography.Text>
            <Radio.Group
              size="small"
              onChange={e => sizeChange(e.target.value)}
              value={size}
              style={{ paddingBottom: "15px" }}
            >
              {Object.keys(SIZE_OPTIONS).map(size => (
                <Radio.Button value={size}>{size}</Radio.Button>
              ))}
            </Radio.Group>
            <Typography.Text>Align Options</Typography.Text>
            <Radio.Group
              size="small"
              onChange={e => alignChange(e.target.value)}
              value={justify}
            >
              {JUSTIFY_OPTIONS.map(justify => (
                <Radio.Button value={justify}>{justify}</Radio.Button>
              ))}
            </Radio.Group>
          </Space>
        )}
      </Tabs.TabPane>
    </Tabs>
  );
};

Customize.propTypes = {
  schema: PropTypes.object,
  uiSchema: PropTypes.object,
  onSchemaChange: PropTypes.func,
  onUiSchemaChange: PropTypes.func,
  path: PropTypes.object,
  _path: PropTypes.object,
};

export default Customize;

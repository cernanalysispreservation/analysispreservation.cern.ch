import React from "react";
import PropTypes from "prop-types";
import PropertyKeyEditorForm from "./PropKeyEditorForm";

import { Radio, Space, Tabs, Typography } from "antd";
import _debounce from "lodash/debounce";

const SIZE_OPTIONS = ["small", "large", "xlarge", "xxlarge", "full"];
const ALIGN_OPTIONS = ["center", "start", "end"];

const Customize = props => {
  const _onSchemaChange = data => {
    props.onSchemaChange(props.path.get("path").toJS(), data.formData);
  };
  const _onUiSchemaChange = data => {
    props.onUiSchemaChange(props.path.get("uiPath").toJS(), data.formData);
  };
  const sizeChange = newSize => {
    if (SIZE_OPTIONS.indexOf(newSize) < 0) return;

    let { uiSchema } = props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { size, ...restUIOptions } = uiOptions;

    size = newSize;
    let _uiOptions = { size, ...restUIOptions };

    props.onUiSchemaChange(props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions,
    });
  };

  const alignChange = newAlign => {
    if (["center", "start", "end"].indexOf(newAlign) < 0) return;

    let { uiSchema } = props;
    uiSchema = uiSchema ? uiSchema.toJS() : {};

    let { "ui:options": uiOptions = {}, ...rest } = uiSchema;
    let { justify, ...restUIOptions } = uiOptions;

    justify = newAlign;
    let _uiOptions = { justify, ...restUIOptions };

    props.onUiSchemaChange(props.path.get("uiPath").toJS(), {
      ...rest,
      "ui:options": _uiOptions,
    });
  };

  return (
    <Tabs centered style={{ height: "100%", overflow: "scroll" }}>
      <Tabs.TabPane tab="Schema Settings" key="1">
        <PropertyKeyEditorForm
          schema={props.schema && props.schema.toJS()}
          uiSchema={props.uiSchema && props.uiSchema.toJS()}
          formData={props.schema && props.schema.toJS()}
          onChange={_debounce(_onSchemaChange, 500)}
          optionsSchemaObject="optionsSchema"
          optionsUiSchemaObject="optionsSchemaUiSchema"
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="UI Schema Settings" key="2">
        {props._path.size != 0 ? (
          <PropertyKeyEditorForm
            schema={props.schema && props.schema.toJS()}
            uiSchema={props.uiSchema && props.uiSchema.toJS()}
            formData={props.uiSchema && props.uiSchema.toJS()}
            onChange={_debounce(_onUiSchemaChange, 500)}
            optionsSchemaObject="optionsUiSchema"
            optionsUiSchemaObject="optionsUiSchemaUiSchema"
          />
        ) : (
          <Space direction="vertical" style={{ padding: "0 12px" }}>
            <Typography.Text>Size Options</Typography.Text>
            <Radio.Group
              size="small"
              onChange={e => sizeChange(e.target.value)}
              style={{ paddingBottom: "15px" }}
            >
              {SIZE_OPTIONS.map(size => (
                <Radio.Button value={size}>{size}</Radio.Button>
              ))}
            </Radio.Group>
            <Typography.Text>Align Options</Typography.Text>
            <Radio.Group
              size="small"
              onChange={e => alignChange(e.target.value)}
            >
              {ALIGN_OPTIONS.map(justify => (
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
  path: PropTypes.object,
  onSchemaChange: PropTypes.func,
  onUiSchemaChange: PropTypes.func,
  _path: PropTypes.object,
};

export default Customize;

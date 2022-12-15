import React from "react";
import PropTypes from "prop-types";
import PropertyKeyEditorForm from "./PropKeyEditorForm";

import { Card, Space, Tag, Typography } from "antd";
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
    <Space direction="vertical" style={{ width: "100%" }}>
      <PropertyKeyEditorForm
        schema={props.schema && props.schema.toJS()}
        uiSchema={props.uiSchema && props.uiSchema.toJS()}
        formData={props.schema && props.schema.toJS()}
        onChange={_debounce(_onSchemaChange, 500)}
        optionsSchemaObject="optionsSchema"
        optionsUiSchemaObject="optionsSchemaUiSchema"
        title="Schema Settings"
      />

      <PropertyKeyEditorForm
        schema={props.schema && props.schema.toJS()}
        uiSchema={props.uiSchema && props.uiSchema.toJS()}
        formData={props.uiSchema && props.uiSchema.toJS()}
        onChange={_debounce(_onUiSchemaChange, 500)}
        optionsSchemaObject="optionsUiSchema"
        optionsUiSchemaObject="optionsUiSchemaUiSchema"
        title="UI Schema Settings"
      />

      {props._path.size == 0 && (
        <Card title="UI Options">
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Space>
              <Typography.Text>Size Options</Typography.Text>
              {SIZE_OPTIONS.map(size => (
                <Tag
                  onClick={() => sizeChange(size)}
                  key={size}
                  color={
                    props.uiSchema &&
                    props.uiSchema.toJS()["ui:options"] &&
                    props.uiSchema.toJS()["ui:options"].size == size &&
                    "geekblue"
                  }
                >
                  {size}
                </Tag>
              ))}
            </Space>
            <Space>
              <Typography.Text>Align Options</Typography.Text>

              {ALIGN_OPTIONS.map(justify => (
                <Tag
                  onClick={() => alignChange(justify)}
                  key={justify}
                  color={
                    props.uiSchema &&
                    props.uiSchema.toJS()["ui:options"] &&
                    props.uiSchema.toJS()["ui:options"].justify == justify &&
                    "geekblue"
                  }
                >
                  {justify}
                </Tag>
              ))}
            </Space>
          </Space>
        </Card>
      )}
    </Space>
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

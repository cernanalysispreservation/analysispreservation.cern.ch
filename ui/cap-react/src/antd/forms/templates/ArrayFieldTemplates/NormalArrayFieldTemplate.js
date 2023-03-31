import React, { useEffect, useState } from "react";
import classNames from "classnames";

import Button from "antd/lib/button";
import { Row, Col, Modal, Space, Tag, Checkbox, Table } from "antd";
import { withConfigConsumer } from "antd/lib/config-provider/context";
import PlusCircleOutlined from "@ant-design/icons/PlusCircleOutlined";

import ArrayFieldTemplateItem from "./ArrayFieldTemplateItem";
import LayerArrayFieldTemplate from "./LayerArrayFieldTemplate";
import EmptyArrayField from "./EmptyArrayField";
import AccordionArrayFieldTemplate from "./AccordionArrayFieldTemplate";
import PropTypes from "prop-types";
import axios from "axios";
import ImportListModal from "./ImportListModal";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import CodeViewer from "../../../utils/CodeViewer";
import { stex } from "@codemirror/legacy-modes/mode/stex";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  StreamLanguage,
} from "@codemirror/language";
import FieldHeader from "../Field/FieldHeader";

const NormalArrayFieldTemplate = ({
  canAdd,
  className,
  disabled,
  formContext,
  idSchema,
  items,
  options,
  onAddClick,
  prefixCls,
  readonly,
  required,
  schema,
  title,
  TitleField,
  uiSchema,
  formData,
}) => {
  const { labelAlign = "right", rowGutter = 24 } = formContext;
  const [latexData, setLatexData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [selectedEmailList, setSelectedEmailList] = useState(
    uiSchema["ui:options"] && uiSchema["ui:options"].email
      ? formData.map(user => user.profile.email)
      : []
  );
  const [copy, setCopy] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === "left" && `${labelClsBasic}-left`
  );
  let uiImport = null;
  let uiLatex = null;
  let uiEmail = null;
  let uiEmailDefaults = [];

  if (uiSchema["ui:options"]) {
    uiImport = uiSchema["ui:options"].import;
    uiLatex = uiSchema["ui:options"].latex;
    uiEmail = uiSchema["ui:options"].email;
    uiEmailDefaults = uiSchema["ui:options"].emailDefaults || [];
  }

  let typeOfArrayToDisplay = "default";
  if ("ui:array" in uiSchema) typeOfArrayToDisplay = uiSchema["ui:array"];
  else if (
    schema &&
    schema.items &&
    ["array", "object"].includes(schema.items.type)
  ) {
    typeOfArrayToDisplay = "LayerArrayField";
  }

  const getArrayContent = type => {
    const choices = {
      LayerArrayField: (
        <LayerArrayFieldTemplate
          items={items}
          formContext={formContext}
          id={idSchema.$id}
        />
      ),
      AccordionArrayField: (
        <AccordionArrayFieldTemplate
          items={items}
          formContext={formContext}
          id={idSchema.$id}
        />
      ),
      default: items.map((itemProps, index) => (
        <ArrayFieldTemplateItem
          key={idSchema.$id + index}
          {...itemProps}
          formContext={formContext}
        />
      )),
    };

    return choices[type] || choices["default"];
  };

  const _enableLatex = () => {
    let { items: { type } = {} } = schema;
    let { to } = uiImport;
    let data = formData;

    if (type == "object" && to) data = formData.map(item => item[to] || "");

    if (!latexData) {
      axios
        .post("/api/services/latex", {
          title: title || "Title goes here",
          paths: data,
        })
        .then(({ data }) => {
          setLatexData(data.latex);
          setShowModal(true);
        })
        .catch(() => {
          if (!latexData) setLatexData(null);
        });
    } else {
      setShowModal(true);
    }
  };

  const updateEmailSelectedList = email => {
    selectedEmailList.includes(email)
      ? setSelectedEmailList(selectedEmailList =>
          selectedEmailList.filter(item => item != email)
        )
      : setSelectedEmailList(selectedEmailList => [
          ...selectedEmailList,
          email,
        ]);
  };
  const updateEmailSelectedListAll = () => {
    formData.length === selectedEmailList.length
      ? setSelectedEmailList([])
      : setSelectedEmailList(formData.map(user => user.profile.email));
  };

  useEffect(() => {
    if (emailModal && formData.length != selectedEmailList.length)
      setSelectedEmailList(formData.map(user => user.profile.email));
  }, [emailModal]);

  return (
    <fieldset
      style={{ marginLeft: "12px", marginRight: "12px" }}
      className={className}
      id={idSchema.$id}
    >
      {uiLatex && (
        <Modal
          destroyOnClose
          visible={showModal}
          onCancel={() => {
            setShowModal(false);
            setLatexData(null);
          }}
          footer={
            <Row justify="end">
              <Space>
                <Button
                  onClick={() => {
                    setShowModal(false);
                    setLatexData(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  type="primary"
                  onClick={() => {
                    navigator.clipboard.writeText(decodeURI(latexData));
                    setCopy(true);
                  }}
                  icon={copy ? <CheckOutlined /> : <CopyOutlined />}
                >
                  {copy ? "Copied" : "Copy to clipboard"}
                </Button>
              </Space>
            </Row>
          }
        >
          <CodeViewer
            value={latexData}
            height="calc(100vh - 300px)"
            extraExtensions={[
              StreamLanguage.define(stex),
              syntaxHighlighting(defaultHighlightStyle),
            ]}
          />
        </Modal>
      )}
      {uiImport && (
        <ImportListModal
          visible={importModal}
          uiImport={uiImport}
          schema={schema}
          formData={formData}
          onAddClick={onAddClick}
          formItems={items}
          onCancel={() => setImportModal(false)}
        />
      )}
      {uiEmail && formData && (
        <Modal
          visible={emailModal}
          onCancel={() => setEmailModal(false)}
          title="Select user & egroups emails to send"
          okText="Send Email"
          okType="link"
          okButtonProps={{
            href: `mailto:${uiEmailDefaults
              .concat(selectedEmailList)
              .join(",")}`,
          }}
          width={900}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <Checkbox
              onChange={() => updateEmailSelectedListAll()}
              checked={formData.length === selectedEmailList.length}
            >
              Select all
            </Checkbox>
            {uiEmailDefaults.length > 0 ? (
              <Col>
                Default email recepients:{" "}
                <Space>
                  {uiEmailDefaults.map(i => (
                    <Tag>{i}</Tag>
                  ))}
                </Space>
              </Col>
            ) : null}
            <Table
              dataSource={formData.map(i => i.profile || i)}
              columns={[
                {
                  title: "Email User",
                  key: "action",
                  render: (_, user) => (
                    <Checkbox
                      checked={selectedEmailList.includes(user.email)}
                      onChange={() => updateEmailSelectedList(user.email)}
                    />
                  ),
                },
                {
                  title: "Name",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "Email",
                  dataIndex: "email",
                  key: "email",
                  render: txt => <Tag color="geekblue">{txt}</Tag>,
                },
                {
                  title: "Department",
                  dataIndex: "department",
                  key: "department",
                  render: txt => <Tag color="blue">{txt}</Tag>,
                },
              ]}
            />
          </Space>
        </Modal>
      )}
      <Row gutter={rowGutter}>
        {title && (
          <Col className={labelColClassName} span={24} style={{ padding: "0" }}>
            <TitleField
              id={`${idSchema.$id}__title`}
              key={`array-field-title-${idSchema.$id}`}
              required={required}
              title={uiSchema["ui:title"] || title}
              uiImport={uiImport}
              uiLatex={uiLatex}
              uiEmail={uiEmail}
              readonly={readonly}
              enableLatex={() => _enableLatex()}
              enableImport={() => setImportModal(true)}
              enableEmail={() => setEmailModal(true)}
            />
          </Col>
        )}
        <FieldHeader
          description={uiSchema["ui:description"] || schema.description}
          uiSchema={uiSchema}
          key={`array-field-header-${idSchema.$id}`}
          idSchema={idSchema}
        />
        <Col span={24} style={{ marginTop: "5px" }} className="nestedObject">
          <Row>
            {items && (
              <Col span={24}>
                {items.length > 0 ? (
                  getArrayContent(typeOfArrayToDisplay)
                ) : (
                  <EmptyArrayField
                    canAdd={canAdd}
                    disabled={disabled}
                    readonly={readonly}
                    onAddClick={onAddClick}
                    options={options}
                  />
                )}
              </Col>
            )}
          </Row>
        </Col>
        {items && items.length > 0 && canAdd && !readonly && (
          <Col span={24} style={{ marginTop: "10px" }}>
            <Row gutter={rowGutter} justify="end">
              <Col flex="192px">
                <Button
                  block
                  disabled={disabled || readonly}
                  onClick={onAddClick}
                  type="primary"
                >
                  <PlusCircleOutlined /> Add{" "}
                  {options && options.addLabel ? options.addLabel : `Item`}
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </fieldset>
  );
};

NormalArrayFieldTemplate.propTypes = {
  canAdd: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  formContext: PropTypes.object,
  idSchema: PropTypes.object,
  items: PropTypes.array,
  onAddClick: PropTypes.func,
  prefixCls: PropTypes.string,
  readonly: PropTypes.bool,
  required: PropTypes.bool,
  schema: PropTypes.object,
  title: PropTypes.string,
  TitleField: PropTypes.node,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
};

export default withConfigConsumer({ prefixCls: "form" })(
  NormalArrayFieldTemplate
);

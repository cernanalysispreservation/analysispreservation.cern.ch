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

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import axios from "axios";
import ImportListModal from "./ImportListModal";
import CopyToClipboard from "react-copy-to-clipboard";
import { CheckOutlined } from "@ant-design/icons";

const DESCRIPTION_COL_STYLE = {
  paddingBottom: "8px"
};

const NormalArrayFieldTemplate = ({
  canAdd,
  className,
  DescriptionField,
  disabled,
  formContext,
  // formData,
  idSchema,
  items,
  onAddClick,
  prefixCls,
  readonly,
  // registry,
  required,
  schema,
  title,
  TitleField,
  uiSchema,
  formData
}) => {
  const { labelAlign = "right", rowGutter = 24 } = formContext;
  const [latexData, setLatexData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emailCernUsersModal, setEmailCernUsersModal] = useState(false);
  const [selectedEmailList, setSelectedEmailList] = useState(
    uiSchema["ui:options"] && uiSchema["ui:options"].emailCernUsers
      ? formData.map(user => user[uiSchema["ui:options"].emailCernUsers])
      : []
  );
  const [copy, setCopy] = useState(false);
  const [importModal, setImportModal] = useState(false);
  const labelClsBasic = `${prefixCls}-item-label`;
  const labelColClassName = classNames(
    labelClsBasic,
    labelAlign === "left" && `${labelClsBasic}-left`
    // labelCol.className,
  );
  let uiImport = null;
  let uiLatex = null;
  let uiEmailCernUsers = null;

  if (uiSchema["ui:options"]) {
    uiImport = uiSchema["ui:options"].import;
    uiLatex = uiSchema["ui:options"].latex;
    uiEmailCernUsers = uiSchema["ui:options"].emailCernUsers;
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
      default: items.map(itemProps => (
        <ArrayFieldTemplateItem {...itemProps} formContext={formContext} />
      ))
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
          paths: data
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
          email
        ]);
  };
  const updateEmailSelectedListAll = () => {
    formData.length === selectedEmailList.length
      ? setSelectedEmailList([])
      : setSelectedEmailList(formData.map(user => user.email));
  };

  useEffect(
    () => {
      if (emailCernUsersModal && formData.length != selectedEmailList.length)
        setSelectedEmailList(formData.map(user => user.email));
    },
    [emailCernUsersModal]
  );

  return (
    <fieldset className={className} id={idSchema.$id}>
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
                <CopyToClipboard
                  text={decodeURI(latexData)}
                  onCopy={() => !copy && setCopy(true)}
                >
                  <Button type="primary" icon={copy && <CheckOutlined />}>
                    {copy ? "Copied" : "Copy to clipboard"}
                  </Button>
                </CopyToClipboard>
              </Space>
            </Row>
          }
        >
          <AceEditor
            mode="latex"
            theme="github"
            width="100%"
            height="200px"
            name="UNIQUE_ID_OF_DIV"
            value={latexData}
            editorProps={{ $blockScrolling: true }}
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
      {uiEmailCernUsers &&
        formData && (
          <Modal
            visible={emailCernUsersModal}
            onCancel={() => setEmailCernUsersModal(false)}
            title="Email Cern users"
            okText="Send Email"
            okType="link"
            okButtonProps={{
              href: `mailto:${selectedEmailList.join(",")}`
            }}
            width={900}
          >
            <Space direction="vertical" style={{ width: "100%" }} size="large">
              <Checkbox
                onChange={() => updateEmailSelectedListAll()}
                checked={formData.length === selectedEmailList.length}
              >
                Select All Users
              </Checkbox>
              <Table
                dataSource={formData}
                columns={[
                  {
                    title: "Email User",
                    key: "action",
                    render: (_, user) => (
                      <Checkbox
                        checked={selectedEmailList.includes(user.email)}
                        onChange={() => updateEmailSelectedList(user.email)}
                      />
                    )
                  },
                  {
                    title: "Name",
                    dataIndex: "name",
                    key: "name"
                  },
                  {
                    title: "Email",
                    dataIndex: "email",
                    key: "email",
                    render: txt => <Tag color="geekblue">{txt}</Tag>
                  },
                  {
                    title: "Department",
                    dataIndex: "department",
                    key: "department",
                    render: txt => <Tag color="blue">{txt}</Tag>
                  }
                ]}
              />
            </Space>
          </Modal>
        )}
      <Row gutter={rowGutter} style={{ background: "#fff", padding: "10px" }}>
        {title && (
          <Col className={labelColClassName} span={24}>
            <TitleField
              id={`${idSchema.$id}__title`}
              key={`array-field-title-${idSchema.$id}`}
              required={required}
              title={uiSchema["ui:title"] || title}
              uiImport={uiImport}
              uiLatex={uiLatex}
              uiEmailCernUsers={uiEmailCernUsers}
              enableLatex={() => _enableLatex()}
              enableImport={() => setImportModal(true)}
              sendEmailToCernUsers={() => setEmailCernUsersModal(true)}
            />
          </Col>
        )}

        {(uiSchema["ui:description"] || schema.description) && (
          <Col span={24} style={DESCRIPTION_COL_STYLE}>
            <DescriptionField
              description={uiSchema["ui:description"] || schema.description}
              id={`${idSchema.$id}__description`}
              key={`array-field-description-${idSchema.$id}`}
            />
          </Col>
        )}
        {items && (
          <Col className="row array-item-list" span={24}>
            {items.length > 0 ? (
              getArrayContent(typeOfArrayToDisplay)
            ) : (
              <EmptyArrayField
                canAdd={canAdd}
                disabled={disabled}
                readonly={readonly}
                onAddClick={onAddClick}
              />
            )}
          </Col>
        )}

        {items &&
          items.length > 0 &&
          canAdd && (
            <Col span={24} style={{ marginTop: "10px" }}>
              <Row gutter={rowGutter} justify="end">
                <Col flex="192px">
                  <Button
                    block
                    className="array-item-add"
                    disabled={disabled || readonly}
                    onClick={onAddClick}
                    type="primary"
                  >
                    <PlusCircleOutlined /> Add Item
                  </Button>
                </Col>
              </Row>
            </Col>
          )}
      </Row>
    </fieldset>
  );
};

export default withConfigConsumer({ prefixCls: "form" })(
  NormalArrayFieldTemplate
);

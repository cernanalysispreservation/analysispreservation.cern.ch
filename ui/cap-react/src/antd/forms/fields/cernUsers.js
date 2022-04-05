import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  Table,
  Tag,
  Typography
} from "antd";
import axios from "axios";
import _debounce from "lodash/debounce";
import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

const CernUsers = ({ onChange, formData, uiSchema }) => {
  const autoOpenModal =
    uiSchema["ui:options"] && uiSchema["ui:options"].autoOpenModal;

  let searchType = uiSchema["ui:options"] && uiSchema["ui:options"].searchType;
  searchType = searchType ? searchType : ["user"];

  const [showModal, setShowModal] = useState(
    autoOpenModal
      ? !formData || (formData && Object.keys(formData).length == 0)
      : false
  );
  const [ldapData, setLdapData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [form] = Form.useForm();

  const modalColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email"
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: tag => <Tag color="geekblue">{tag}</Tag>
    },
    {
      title: "Action",
      key: "action",
      render: item => (
        <Button
          type="primary"
          onClick={() => {
            setShowModal(false);
            form.resetFields();
            setLdapData([]);
            onChange({
              name: item.name,
              email: item.email,
              department: item.department
            });
          }}
        >
          Add
        </Button>
      )
    }
  ];

  const fetchLDAPdata = _debounce(
    async ({ searchFor = searchType[0], searchInput }) => {
      setTableLoading(true);
      const response = await axios.get(
        `/api/services/ldap/${searchFor}/mail?query=${searchInput}`
      );

      setLdapData(
        response.data.map(item => ({
          target: searchFor,
          key: item.email ? item.email : item,
          email: item.email ? item.email : item,
          department: item.email ? item.profile.department : "egroup",
          name: item.email
            ? item.profile.display_name
            : item.split("@cern.ch")[0]
        }))
      );
      setTableLoading(false);
    },
    500
  );

  return (
    <React.Fragment>
      <Modal
        visible={showModal}
        onCancel={() => {
          setShowModal(false);
          form.resetFields();
          setLdapData([]);
        }}
        width={1000}
      >
        <Form
          form={form}
          initialValues={{ searchFor: "user" }}
          layout="vertical"
          onValuesChange={(_, values) =>
            values.searchInput && values.searchInput.length > 0
              ? fetchLDAPdata(values)
              : setLdapData([]) && setTableLoading(false)
          }
        >
          {searchType.length > 1 && (
            <Form.Item label="Search For" name="searchFor">
              <Radio.Group buttonStyle="solid">
                {searchType.map(type => (
                  <Radio.Button key={type} value={type}>
                    {type}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          )}
          <Form.Item name="searchInput">
            <Input
              placeholder={
                searchType.length == 1
                  ? `Search for ${searchType[0]} emails...`
                  : "Search for emails..."
              }
            />
          </Form.Item>
        </Form>
        <Table
          loading={tableLoading}
          dataSource={ldapData}
          columns={modalColumns}
          fixedHeader
          pagination={false}
        />
      </Modal>

      {formData && Object.keys(formData).length > 0 ? (
        <Row
          justify="space-between"
          style={!autoOpenModal && { background: "#fff", padding: "10px" }}
        >
          <Space>
            <Typography.Text>{formData.name}</Typography.Text>
            <Tag color="geekblue">{formData.email}</Tag>
            <Tag color="blue">{formData.department}</Tag>
          </Space>
          {!autoOpenModal && (
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => onChange(undefined)}
            />
          )}
        </Row>
      ) : (
        <Row
          justify="center"
          style={!autoOpenModal && { background: "#fff", padding: "10px" }}
        >
          <Button type="primary" onClick={() => setShowModal(true)}>
            Search Contacts
          </Button>
        </Row>
      )}
    </React.Fragment>
  );
};

CernUsers.propTypes = {
  formData: PropTypes.object,
  uiSchema: PropTypes.object,
  onChange: PropTypes.func
};

export default CernUsers;

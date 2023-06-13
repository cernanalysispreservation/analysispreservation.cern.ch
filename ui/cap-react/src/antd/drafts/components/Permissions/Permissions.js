import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { permissionsPerUser } from "../../../utils";
import DropDown from "./DropDown";
import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Radio,
  Table,
  Tag,
  Tooltip,
  Grid,
  Typography,
} from "antd";
import axios from "axios";
import { debounce } from "lodash-es";

const Permissions = ({
  draft_id,
  handlePermissions,
  permissions,
  created_by,
  canAdmin,
}) => {
  const [ldapData, setLdapData] = useState([]);
  const [permissionsArray, setPermissionsArray] = useState([]);
  const [emailsArray, setEmailsArray] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [form] = Form.useForm();
  const updateModalLdapPermission = (val, record) => {
    let newPermissions;
    if (record.permission.includes(val)) {
      newPermissions = record.permission.filter(item => item != val);
    } else {
      newPermissions = [...record.permission, val];
    }

    const newData = ldapData.map(item => {
      if (item.email == record.email) {
        return {
          ...item,
          permission: newPermissions,
        };
      } else return item;
    });

    setLdapData(newData);
  };
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const modalColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: tag => <Tag color="geekblue">{tag}</Tag>,
    },
    {
      title: "Permissions",
      dataIndex: "permission",
      key: "permission",
      render: (_, item) => (
        <DropDown
          permission={item.permission}
          updatePermissions={val => updateModalLdapPermission(val, item)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: item =>
        emailsArray.includes(item.email.toLowerCase()) ? (
          <Button disabled>Added</Button>
        ) : (
          <Button
            type="primary"
            onClick={() =>
              handlePermissions(
                draft_id,
                item.target,
                item.email,
                item.permission,
                "add"
              )
            }
          >
            Add
          </Button>
        ),
    },
  ];
  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      ellipsis: !screens.md,
      render: txt => {
        return !screens.md ? (
          <Tooltip placement="top" title={txt}>
            {txt}
          </Tooltip>
        ) : (
          <Typography.Text>{txt}</Typography.Text>
        );
      },
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, item) =>
        created_by && created_by.email == item.email ? (
          <Tag color="geekblue">owner</Tag>
        ) : (
          <Tag color="blue">{item.type}</Tag>
        ),
    },
    {
      title: "Permissions",
      dataIndex: "permission",
      key: "permission",
      render: (_, item) => (
        <DropDown
          shouldDisableOptions={!canAdmin}
          isOwner={created_by && created_by.email == item.email}
          permission={item.permissions}
          updatePermissions={val =>
            handlePermissions(
              draft_id,
              item.type,
              item.email,
              val,
              item.permissions.includes(val) ? "remove" : "add"
            )
          }
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: item => (
        <Button
          danger
          disabled={(created_by && created_by.email == item.email) || !canAdmin}
          icon={<DeleteOutlined />}
          onClick={() =>
            handlePermissions(
              draft_id,
              item.type,
              item.email,
              item.permissions,
              "remove"
            )
          }
        />
      ),
    },
  ];

  useEffect(() => {
    const { permissionsArray, emailsArray } = permissionsPerUser(permissions);
    setPermissionsArray(permissionsArray);
    setEmailsArray(emailsArray);
  }, [permissions]);

  const fetchLDAPdata = debounce(async ({ searchFor, searchInput }) => {
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
          : item.split("@cern.ch")[0],
        permission: ["deposit-read"],
      }))
    );
    setTableLoading(false);
  }, 500);

  const [displayModal, setDisplayModal] = useState(false);
  return (
    <>
      <Modal
        open={displayModal}
        onCancel={() => {
          setDisplayModal(false);
          form.resetFields();
          setLdapData([]);
        }}
        okButtonProps={{
          onClick: () => {
            setDisplayModal(false);
            form.resetFields();
            setLdapData([]);
          },
        }}
        title="Give user/egroup permissions"
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
          <Form.Item label="Search For" name="searchFor">
            <Radio.Group buttonStyle="solid">
              <Radio.Button value="user">Users</Radio.Button>
              <Radio.Button value="egroup">E groups</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="searchInput">
            <Input placeholder="Search for emails..." />
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
      <Card
        title="Access & Permissions"
        extra={
          <Button
            disabled={!canAdmin}
            type="primary"
            onClick={() => setDisplayModal(true)}
          >
            Add
          </Button>
        }
      >
        <Table
          dataSource={permissionsArray}
          columns={columns}
          fixedHeader
          pagination={{ pageSize: 5 }}
        />
      </Card>
    </>
  );
};

Permissions.propTypes = {
  draft_id: PropTypes.string,
  handlePermissions: PropTypes.func,
  permissions: PropTypes.object,
  canAdmin: PropTypes.bool,
  created_by: PropTypes.object,
};

export default Permissions;

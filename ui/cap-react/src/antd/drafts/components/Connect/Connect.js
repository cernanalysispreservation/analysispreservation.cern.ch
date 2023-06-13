import { useState } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Empty,
  Form,
  Input,
  Space,
  Typography,
  notification,
  Collapse,
  Tag,
  Table,
} from "antd";
import RepoActions from "./RepoActions";
import { CheckCircleTwoTone } from "@ant-design/icons";
import ReactTimeago from "react-timeago";
import { getIcon } from "./utils";
import DefaultRepositories from "./DefaultRepositories";

const Connect = ({
  repos = [],
  repoConfig = {},
  canUpdate,
  uploadViaRepoUrl,
  uploadDefaultRepo,
  id,
}) => {
  const [form] = Form.useForm();

  const [myRepo, setMyRepo] = useState(null);
  const [error, setError] = useState(null);

  const getEvenTypeLabel = type => {
    switch (type) {
      case "release":
        return "on Tag/Release";
      case "push":
        return "on Tag/Release";
      default:
        return null;
    }
  };

  const columns = [
    {
      title: "Ref",
      render: snap => {
        return snap.payload.event_type == "release" ? (
          <Tag>{snap.payload.release.tag}</Tag>
        ) : (
          <Typography.Text>
            {snap.payload.commit.slice(-1)[0].message}
          </Typography.Text>
        );
      },
      width: "60%",
      key: "ref",
      ellipsis: true,
    },
    {
      title: "Created",
      render: snap => {
        return (
          snap.created && <ReactTimeago date={snap.created} minPeriod="60" />
        );
      },
      width: "20%",
      key: "created",
    },
    {
      title: "Link",
      render: snap => (
        <Typography.Link href={snap.payload.link} target="_blank">
          link
        </Typography.Link>
      ),
      width: "20%",
      key: "link",
    },
  ];

  const uploadRepo = (
    webhook = null,
    event_type = null,
    ref = null,
    filepath = null
  ) => {
    let { resource, owner, name } = myRepo;

    let url = `https://${resource}/${owner}/${name}`;

    if (ref) url = `${url}/tree/${ref}`;
    if (filepath)
      url = `${url}${filepath[0] == "/" ? filepath : "/" + filepath}`;

    uploadViaRepoUrl(id, url, webhook, event_type, {
      resource,
      owner,
      name,
      ref,
      filepath,
    })
      .then(() => {
        notification.open({
          message: "Success",
          description: "Your task was successfuly created",
          duration: 4,
          icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
        });
        setMyRepo(null);
        form.resetFields();
      })
      .catch(e =>
        setError({
          ...e.error.response.data,
          type: event_type ? event_type : "upload",
        })
      );
  };

  const updateQuery = () => {
    let value = form.getFieldsValue().repo;
    if (value == "" || value.trim() == "" || value.length < 2) {
      setMyRepo(null);
      setError(null);
      return;
    }
    let regex =
      /(https|http):\/\/(github\.com|gitlab\.cern\.ch|gitlab-test\.cern\.ch)[:|\/]([\w\.-]+)\/([\w\.-]+)(\.git|\/tree\/|\/-\/tree\/|\/blob\/|\/-\/blob\/|\/releases\/tag\/|\/-\/tags\/)?\/?([\w.-]+)?\/?(.+)?/; //eslint-disable-line
    let repo = value.match(regex);
    let [href, scheme, resource, owner, name, type, ref, filepath] = repo;
    const acceptedResources = [
      "github.com",
      "gitlab.cern.ch",
      "gitlab-test.cern.ch",
    ];
    if (acceptedResources.includes(resource) && owner && name) {
      setMyRepo({ href, scheme, resource, owner, name, type, ref, filepath });
      setError(null);
    }
  };

  return (
    <Col xxl={16} lg={18} xs={22} sm={22}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Repositories">
          <Typography.Paragraph>
            <Typography.Text strong>Download</Typography.Text>{" "}
            {`a snapshot of
            repository, that you'd like to preserve with your analysis. You can
            point to the whole repo, specific branch or even a single file -
            whatever your analysis needs. Some repositories are private or
            restricted for CERN users only (like all the repos in CERN Gitlab) -
            to download those you need to connect your Github/Gitlab account
            first`}
          </Typography.Paragraph>
          <Typography.Paragraph>
            <Typography.Text strong>Connect</Typography.Text>{" "}
            {`repositories with
            analysis that are still in progress, to keep them in sync. We'll
            make a new snapshot on any changes pushed in this repository. This
            way your analysis will be always up to date with your code. Keep in
            mind that you cannot connect to public repositories (owner has to
            give you a specific access to do that).`}
          </Typography.Paragraph>
        </Card>

        <DefaultRepositories
          draftID={id}
          repos={repos}
          repoConfig={repoConfig}
          upload={uploadDefaultRepo}
        />

        {canUpdate && (
          <Card title="Add new repository">
            <Form
              form={form}
              layout="vertical"
              onFieldsChange={() =>
                setTimeout(
                  () =>
                    form.getFieldsError()[0].errors.length < 1 && updateQuery(),
                  100
                )
              }
            >
              <Form.Item
                name="repo"
                label="Github/Gitlab URL"
                rules={[
                  {
                    pattern: new RegExp(
                      /(http:\/\/|https:\/\/|root:\/\/)(github\.com|gitlab\.cern\.ch|gitlab-test\.cern\.ch)?(\/.*)?$/
                    ),
                    message:
                      "Please provide a Github or CERN Gitlab URL. URL is not correct",
                  },
                ]}
              >
                <Input placeholder="Please provide a valid Github/Gitlab repository or file URL" />
              </Form.Item>
            </Form>
            <RepoActions
              myRepo={myRepo}
              uploadRepo={uploadRepo}
              error={error}
            />
          </Card>
        )}
        <Card title="Connected Repositories">
          {repos && repos.length > 0 ? (
            <Collapse>
              {repos.map(repo => (
                <Collapse.Panel
                  header={`${repo.owner}/${repo.name}`}
                  key={repo.id}
                  extra={
                    <Space size="middle">
                      <Typography.Text>
                        {getEvenTypeLabel(repo.event_type)}
                      </Typography.Text>
                      {repo.branch}
                      {getIcon(repo.host)}
                    </Space>
                  }
                >
                  <Table dataSource={repo.snapshots} columns={columns} />
                </Collapse.Panel>
              ))}
            </Collapse>
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No connected repositories"
            />
          )}
        </Card>
      </Space>
    </Col>
  );
};

Connect.propTypes = {
  repos: PropTypes.array,
  repo: PropTypes.object,
  canUpdate: PropTypes.bool,
  uploadViaRepoUrl: PropTypes.func,
  id: PropTypes.string,
};

export default Connect;

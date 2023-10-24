import { useEffect, useState } from "react";
import { Button, Col, Input, Row, Select, Space, Typography } from "antd";
import axios from "../../../axios";
import Ror from "./services/Ror";
import Zenodo from "./services/Zenodo";
import Orcid from "./services/Orcid";
import { DeleteOutlined } from "@ant-design/icons";
import OrcidSvg from "./services/svg/OrcidSvg";
import ZenodoSvg from "./services/svg/ZenodoSvg";
import RorSvg from "./services/svg/RorSvg";
import Icon from "@ant-design/icons";
import CAPDeposit from "./services/CAPDeposit";
import CAPLogo from "./services/svg/capLogo";

const SERVICES = {
  orcid: {
    name: "ORCiD",
    url: "/api/services/orcid/",
    svg: OrcidSvg,
  },
  ror: {
    name: "ROR",
    url: "/api/services/ror/",
    svg: RorSvg,
  },
  zenodo: {
    name: "Zenodo",
    url: "/api/services/zenodo/record/",
    svg: ZenodoSvg,
  },
  capRecords: {
    name: "CAP Records",
    url: "/api/records/",
    svg: ZenodoSvg,
  },
  capDeposits: {
    name: "CAP Deposits",
    url: "/api/deposits/",
    svg: CAPLogo,
  },
};

const ServiceGetter = ({ formData = {}, uiSchema ={}, onChange }) => {
  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(() => {
    if (uiSchema?.["ui:servicesList"]?.length === 1) {
      setService(uiSchema["ui:servicesList"]);
    }
  }, [uiSchema]);

  const getContentByName = name => {
    const choices = {
      ror: <Ror data={formData.fetched} />,
      zenodo: <Zenodo data={formData.fetched} />,
      orcid: <Orcid data={formData.fetched} />,
      capDeposits: <CAPDeposit data={formData.fetched} />,
    };
    return choices[name] || <span>{JSON.stringify(formData.fetched)}</span>;
  };

  const getId = (service, id) => {
    switch (service) {
      case "zenodo":
        if (id.match(/\W+(zenodo.org)/)) {
          return id.match(/(record\/)(.*)(#*)/)[2];
        }
        break;
      case "orcid":
        if (id.match(/\W+(orcid.org)/)) {
          return id.match(/(orcid.org\/)(.*)/)[2];
        }
        break;
      case "ror":
        if (id.match(/\W+(ror.org)/)) {
          return id.match(/(ror.org\/)(.*)/)[2];
        }
        break;

      default:
        return id;
    }

    return id;
  };
  const onSearch = async val => {
    setErrorMessage(undefined);
    const currentServiceApi = SERVICES[service].url || null;
    const resourceID = getId(service, val);
    if (currentServiceApi && !resourceID == "") {
      setLoading(true);
      try {
        const results = await axios.get(currentServiceApi + resourceID);
        let { data } = results;
        if (!data.statuss) {
          const resource_data = {
            source: {
              service: service,
              externalID: resourceID,
            },
            fetched: data,
          };
          onChange(resource_data);
        } else setErrorMessage("Resource not found or inaccessible");
      } catch (e) {
        setErrorMessage("Resource not found or inaccessible");
      }
      setLoading(false);
    } else {
      setErrorMessage("Please make sure you filled in all the inputs");
    }
  };

  return (
    <div>
      {formData.fetched ? (
        <Row wrap={false} align="middle" gutter={10}>
          <Col flex="auto">{getContentByName(formData.source.service)}</Col>
          <Col flex="none">
            <Button
              size="small"
              danger
              onClick={() => onChange({})}
              icon={<DeleteOutlined />}
            />
          </Col>
        </Row>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          {uiSchema["ui:servicesList"]?.length > 1 && (
            <Select
              value={service}
              placeHolder="Select service"
              onChange={val => setService(val)}
              style={{ width: "100%" }}
            >
              {uiSchema["ui:servicesList"]?.map(service => (
                <Select.Option value={service} key={service}>
                  {SERVICES[service].name}
                </Select.Option>
              ))}
            </Select>
          )}
          {service && (
            <Space direction="vertical">
              <Space align="center">
                <Icon
                  component={SERVICES[service].svg}
                  style={{ verticalAlign: "middle" }}
                />
                <Input.Search
                  placeholder={`${SERVICES[service].name} ID here`}
                  enterButton="Fetch"
                  loading={loading}
                  onSearch={onSearch}
                />
              </Space>
              <Typography.Text type="danger">{errorMessage}</Typography.Text>
            </Space>
          )}
        </Space>
      )}
    </div>
  );
};

ServiceGetter.propTypes = {};

export default ServiceGetter;

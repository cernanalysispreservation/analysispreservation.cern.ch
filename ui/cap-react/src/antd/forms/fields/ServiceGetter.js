import React, { useEffect, useState } from "react";
import ORCidIcon from "../../../components/drafts/form/themes/grommet/fields/ServiceIdGetter/components/ORCID/ORCidIcon";
import { Button, Input, Select, Space, Typography } from "antd";
import ZenodoIcon from "../../../components/drafts/form/themes/grommet/fields/ServiceIdGetter/components/Zenodo/ZenodoIcon";
import RORIcon from "../../../components/drafts/form/themes/grommet/fields/ServiceIdGetter/components/ROR/RORIcon";
import axios from "axios";
import Ror from "./services/Ror";
import Zenodo from "./services/Zenodo";
import Orcid from "./services/Orcid";

const SERVICES = {
  zenodo: {
    url: "/api/services/zenodo/record/",
  },
  orcid: {
    url: "/api/services/orcid/",
  },
  ror: {
    url: "/api/services/ror/",
  },
};

const ServiceGetter = ({ formData = {}, uiSchema, onChange }) => {
  const [service, setService] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(undefined);

  useEffect(
    () => {
      if (uiSchema["ui:servicesList"].length === 1) {
        setService(uiSchema["ui:servicesList"]);
      }
    },
    [uiSchema]
  );

  const getContentByName = name => {
    const choices = {
      ror: <Ror data={formData.fetched} />,
      zenodo: <Zenodo data={formData.fetched} />,
      orcid: <Orcid data={formData.fetched} />,
    };
    return choices[name];
  };

  const IconFactory = {
    orcid: <ORCidIcon />,
    zenodo: <ZenodoIcon />,
    ror: <RORIcon />,
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
    const currentServiceApi = SERVICES[service] || null;
    const resourceID = getId(service, val);
    if (currentServiceApi && !resourceID == "") {
      setLoading(true);
      try {
        const results = await axios.get(currentServiceApi.url + resourceID);
        let { data } = results;
        if (!data.status) {
          const resource_data = {
            source: {
              service: service,
              externalID: resourceID,
            },
            fetched: data,
          };
          onChange(resource_data);
        } else setErrorMessage("Resource not found or unaccessible");
      } catch (e) {
        setErrorMessage("Resource not found or unaccessible");
      }
      setLoading(false);
    } else {
      setErrorMessage("Please make sure you filled in all the inputs");
    }
  };

  return (
    <div>
      {formData.fetched ? (
        <Space>
          {getContentByName(formData.source.service)}
          <Button danger onClick={() => onChange({})}>
            Remove
          </Button>
        </Space>
      ) : (
        <Space direction="vertical" style={{ width: "100%" }}>
          {uiSchema["ui:servicesList"].length > 1 && (
            <Select
              value={service}
              placeHolder="Select service"
              onChange={val => setService(val)}
            >
              {uiSchema["ui:servicesList"].map(service => (
                <Select.Option value={service} key={service}>
                  {service}
                </Select.Option>
              ))}
            </Select>
          )}
          {service && (
            <Space direction="vertical">
              <Space>
                {IconFactory[service]}
                <Typography.Text>{service}</Typography.Text>
                <Input.Search
                  placeholder="ID here"
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

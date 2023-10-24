import React, { useState } from "react";
import PropTypes from "prop-types";

import axios from "axios";

// import CustomOption from "./ImportDataFieldSelectComponent";
import { Avatar, Checkbox, Input, List, Select, Space, Typography } from "antd";
import ServiceGetter from "./ServiceGetter";

const EMPTY_VALUE = "---- No Selection ---- ";

const ImportDataField = ({ schema, uiSchema, formData, onChange }) => {
  // const [data, setData] = useState([]);
  const [selected, setSelected] = useState();

  const query = uiSchema?.["ui:options"]?.query || undefined;
  const importData = uiSchema["importData"] || {};

  const [fetchedResults, setFetchedResults] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [data, setData] = useState(null);

  const {
    "x-cap-import-data": {
      queryUrl = "/api/deposits",
      // queryUrl = "",
      queryParam = "q",
      resultsPath = "hits.hits",
      hitTitle = "metadata.general_title",
      hitDescription = "created_by.email",
      // resultsPath = null
    } = {},
  } = schema;
  // } = uiSchema;

  const getResultFromData = data => {
    let results = data;
    const resultPathArray = resultsPath.split(".");
    resultPathArray.map(p => (results = results[p]));
    return results;
  };

  const serializeResults = data => {
    return data.map(entry => {
      let title = entry;
      let description = entry;

      hitTitle.split(".").map(i => (title = title[i]));
      hitDescription.split(".").map(i => (description = description[i]));
      return {
        label: title,
        value: description,
        data: entry,
      };
    });
    // let results = data;
    // const resultPathArray = resultsPath.split(".");
    // resultPathArray.map(p => (results = results[p]));
    // return results;
  };
  const fetchSuggestions = async (val = "") => {
    try {
      const { data } = await axios.get(queryUrl, {
        params: {
          [queryParam]: val,
        },
      });
      console.log(data);

      let results = getResultFromData(data);
      console.log("rrrrrrrrrrrrrrrr", results);
      results = serializeResults(results);
      console.log("rrrrrrrrrrrr3333rrrr", results);
      setFetchedResults(results);
      // updateAll(data, true);
    } catch (err) {
      //
    }
  };

  return (
    <Space direction="vertical" style={{ flex: 1, display: "flex" }}>
      <Select
        onSearch={fetchSuggestions}
        optionds={fetchedResults?.map(i => ({
          ...i,
          label: (
            <Space direction="vertical">
              <span>
                {i.value} -- {i.data.id} || {i.label}
              </span>
            </Space>
          ),
        }))}
        dropdownRendder={() => (
          <Space>
            <Typography.Text>tools</Typography.Text>
          </Space>
        )}
        showSearch
        filterOption={false}
        placeholder="Inserted are removed"
        style={{ width: "100%" }}
        // listHeight={500}
        clearIcon
        size="large"
        mode="tags"
        
      >
          {fetchedResults?.map(i => (
            <Select.Option key={i.label} value={i.value} label={i.label}>
        <List>
              <List.Item extra={[<div>Content</div>]}>
                <List.Item.Meta
                  title={i.label}
                  avatar={<Avatar style={{ background: "#10899e" }} />}
                  description={i.value}
                />
              </List.Item>
              </List>
            </Select.Option>

            //   {
            //   ...i,
            //   label: (
            //     <Space direction="vertical">
            //       <span>
            //         {i.value} -- {i.data.id} || {i.label}
            //       </span>
            //     </Space>
            //   ),
            // }
          ))}
      </Select>
      <Input.Search
        enterButton="Fetch"
        placeholder="Insert your pattern e.x /dataset/*"
        // onChange={e => {
        //   e.target.value == "" &&
        //     fetchedResults &&
        //     setFetchedResults(null);
        //   updateAll(fetchedResults || [], false);
        // }}
        onSearch={fetchSuggestions}
      />
      {fetchedResults && (
        <List   
          dataSource={fetchedResults}
          renderItem={item => (
            <List.Item onClick={i => {
              console.log(item)
              setData(item.data)}
              
              } extfra={[<div>Content</div>]}>
            <List.Item.Meta
              title={item.label}
              // avatar={<Avatar style={{ background: "#10899e" }} />}
              description={item.value}
            />
          </List.Item>
          )}
        />
      )}

      <ServiceGetter />
      {
        data && JSON.stringify(data)
      }
    </Space>
  );
};

ImportDataField.propTypes = {
  onChange: PropTypes.func,
  uiSchema: PropTypes.object,
  formData: PropTypes.object,
};

export default ImportDataField;

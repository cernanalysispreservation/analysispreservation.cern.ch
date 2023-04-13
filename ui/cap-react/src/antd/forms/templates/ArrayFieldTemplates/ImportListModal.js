import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Checkbox, Input, List, Modal, Tabs, Typography } from "antd";
import axios from "axios";

const ImportListModal = ({
  open,
  onCancel,
  uiImport,
  schema,
  onAddClick,
  formData,
  formItems,
}) => {
  const {
    description,
    listSuggestions,
    placeholder,
    to,
    delimiter = "\n",
  } = uiImport;

  const [fetchedResults, setFetchedResults] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [data, setData] = useState(null);
  // const [error, setError] = useState(null);

  useEffect(
    () => {
      if (currentIndex) {
        formItems[currentIndex.index].children.props.onChange(
          currentIndex.value
        );
      }
    },
    [currentIndex]
  );

  const updateAll = (items = [], add = true) => {
    let updated = items.map(item => item + "\n");
    if (!data) setData(updated.join(",").replace(/,/g, ""));
    else {
      if (!add) {
        setData(data => [
          ...data,
          updated
            .filter(item => !data.includes(item))
            .join(",")
            .replace(/,/g, ""),
        ]);
      } else {
        let clips = data;
        updated.map(item => {
          if (data.includes(item)) {
            clips = clips.replace(item, "");
          }
        });
        setData(clips);
      }
    }
  };
  const fetchSuggestions = async val => {
    try {
      const { data } = await axios.get(listSuggestions + val);
      setFetchedResults(data);
      updateAll(data, true);
    } catch (err) {
      // setError(error);
    }
  };

  const _batchImport = () => {
    let values = [];
    if (!data) return;

    // Replace multiple spaces with one
    let value = data.replace(/ +(?= )/g, "");
    // Trim whitespaces from beginning/end
    value = value.trim();
    // Remove empty lines
    value = value.replace(/^\s*[\r\n]/gm, "");

    // Split string depending on the delimiter passed in the uiOptionns
    values = value.split(delimiter);

    // Get form configurations/options
    let { items: { type } = {} } = schema;

    if (Array.isArray(values)) {
      setTimeout(() => {
        values.map(() => {
          onAddClick();
        });
      }, 1);
    }

    setTimeout(
      () =>
        values.map((value, index) => {
          let _index = formData.length + index;
          if (type == "object" && to) {
            value = { [to]: value };
          }
          setCurrentIndex({
            index: _index,
            value,
          });
        }),
      1
    );

    onCancel();
  };
  return (
    <Modal
      onCancel={() => {
        onCancel();
        setData(null);
        setFetchedResults(null);
      }}
      open={open}
      title="Provide a pattern to fetch available paths"
      okButtonProps={{
        disabled: !data,
        onClick: () => {
          _batchImport();
          setData(null);
          setFetchedResults(null);
        },
      }}
      okText="Import"
      destroyOnClose
    >
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Fetch from URL",
            children: (
              <>
                <Input.Search
                  enterButton="Fetch"
                  placeHolder="Insert your pattern e.x /dataset/*"
                  onChange={e => {
                    e.target.value == "" &&
                      fetchedResults &&
                      setFetchedResults(null);
                    updateAll(fetchedResults || [], false);
                  }}
                  onSearch={fetchSuggestions}
                />
                {fetchedResults && (
                  <List
                    dataSource={fetchedResults}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={
                            <Checkbox
                              checked={data && data.includes(item)}
                              onChange={() => {
                                if (!data) setData(item + "\n");
                                else {
                                  data.includes(item)
                                    ? setData(data =>
                                        data.replace(item + "\n", "")
                                      )
                                    : setData(data => data + item + "\n");
                                }
                              }}
                            >
                              {item}
                            </Checkbox>
                          }
                        />
                      </List.Item>
                    )}
                  />
                )}
              </>
            ),
          },
          {
            key: "2",
            label: "Add list manually",
            children: (
              <>
                <Typography.Title level={5}>
                  {description} || Paste your list here. Insert one item per
                  line:
                </Typography.Title>
                <Input.TextArea
                  rows={15}
                  value={data}
                  placeholder={
                    placeholder || "ex.\n\nitem1 \n\nitem2 \n\nitem3\n"
                  }
                  onChange={e => setData(e.target.value)}
                />
              </>
            ),
          },
        ]}
      />
    </Modal>
  );
};

ImportListModal.propTypes = {
  open: PropTypes.bool,
  onCancel: PropTypes.func,
  uiImport: PropTypes.object,
  schema: PropTypes.object,
  formItems: PropTypes.object,
  formData: PropTypes.object,
  onAddClick: PropTypes.func,
};

export default ImportListModal;

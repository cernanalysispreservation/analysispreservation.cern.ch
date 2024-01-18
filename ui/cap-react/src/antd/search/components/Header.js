import PropTypes from "prop-types";
import queryString from "query-string";
import { Button, Dropdown, Row, Select, Space, Typography } from "antd";
import { EllipsisOutlined, FilterOutlined } from "@ant-design/icons";
import { DRAFTS, PUBLISHED } from "../../routes";

const SORT_OPTIONS = [
  { value: "mostrecent", label: "Newest First" },
  { value: "-mostrecent", label: "Oldest First" },
  { value: "bestmatch", label: "Best Match" },
];

const EXPORT_OPTIONS = [
  {
    key: "csv",
    label: "Export CSV",
  },
  {
    key: "xml",
    label: "Export XML",
  },
];

const getValueFromLocation = (value = "mostrecent") => {
  const choices = {
    mostrecent: "Newest First",
    "-mostrecent": "Oldest First",
    bestmatch: "Best Match",
  };

  return choices[value];
};

const Header = ({
  location,
  results,
  onChange,
  shouldDisplayFacetButton,
  updateDisplayFacet,
}) => {
  const total = results.getIn(["hits", "total"]) || 0;

  let searchParams = queryString.parse(location.search);
  let sortParam = searchParams.sort || "mostrecent";

  const onExport = async (mimetype) => {
    let acceptHeader = null;
    if (mimetype == "csv") { acceptHeader = "application/csv"}
    else if (mimetype == "xml") { acceptHeader = "application/marcxml+xml"}
    else return;

    const timestamp = new Date().getTime();
    const filename = `export-${timestamp}.${mimetype}`

    let record_type = null;
    if (location.pathname == DRAFTS) { record_type = "deposits"}
    else if (location.pathname == PUBLISHED) { record_type = "records"}
    else return;

    try {
      const apiUrl = `/api/${record_type}/${location.search}`;
      const headers = { 'Accept': acceptHeader };

      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
      console.error('Download failed', error);
  }
  };

  // let isDescending = sortParam && sortParam[0] == "-";
  // TODO: For asc/desc sorting
  // let sortValue = isDescending ? sortParam.substring(1) : sortParam;
  // let sortDesc = isDescending? "desc" : "asc";
  // const [descSort, setDescSort] = useState(sortDesc);

  // const updateSort = sort => {
  //   sort = sort.target.value;
  //   if (isDescending && sort == "asc") {
  //     onChange(sortParam.substring(1));
  //   } else if (!isDescending && sort == "desc") {
  //     onChange(`-${sortParam}`);
  //   }
  // };
  return (
    <Row style={{ marginBottom: "10px" }} justify="space-between">
      {queryString.parse(location.search).q ? (
        <Typography.Title level={5}>
          {total > 1 ? `${total} Results for ` : `${total} Result for `}
          <Typography.Text italic>
            {queryString.parse(location.search).q}
          </Typography.Text>
        </Typography.Title>
      ) : (
        <Typography.Title level={5}>
          {total > 1 ? `${total} Results ` : `${total} Result `}
        </Typography.Title>
      )}
      <Space>
        {shouldDisplayFacetButton && (
          <Button size="small" icon={<FilterOutlined />} onClick={updateDisplayFacet}>
            Filters
          </Button>
        )}
        <Space>
          <Select
            size="small"
            defaultValue={sortParam}
            style={{ width: 120 }}
            onChange={onChange}
            data-cy="sortSelectMenu"
          >
            {SORT_OPTIONS.map(item => (
              <Select.Option
                value={item.value}
                key={item.value}
                data-cy={item.value}
              >
                {getValueFromLocation(item.value)}
              </Select.Option>
            ))}
          </Select>
          <Dropdown
            placement="bottomRight"
            trigger={["click"]}
            menu={{
              items: EXPORT_OPTIONS,
              onClick: e => onExport(e.key)
            }}
          >
            <Button size="small" icon={<EllipsisOutlined />} />
          </Dropdown>
          {/*
          <Radio.Group size="small" value={descSort} onChange={updateSort}>
            <Radio.Button value="asc">
              <ArrowUpOutlined type="primary" />
            </Radio.Button>
            <Radio.Button value="desc">
              <ArrowDownOutlined />
            </Radio.Button>
            <Select
              size="small"
              defaultValue={
                sortValue || "mostrecent"
              }
              style={{ width: 120 }}
              onChange={onChange}
            >
              {SORT_OPTIONS.map(item => (
                <Select.Option value={item.value} key={item.value}>
                  {getValueFromLocation(item.value)}
                </Select.Option>
              ))}
            </Select>
          </Radio.Group>
          */}
        </Space>
      </Space>
    </Row>
  );
};

Header.propTypes = {
  location: PropTypes.object,
  results: PropTypes.object,
  onChange: PropTypes.func,
  shouldDisplayFacetButton: PropTypes.bool,
  updateDisplayFacet: PropTypes.func,
};

export default Header;

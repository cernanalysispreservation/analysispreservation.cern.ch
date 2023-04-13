import { Descriptions, Typography, Grid } from "antd";
const { useBreakpoint } = Grid;

const HowToSearch = () => {
  const screens = useBreakpoint();
  return (
    <Descriptions bordered layout={!screens.md && "vertical"}>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To perform a free text search, simply enter a text string. This will
            search for given terms in the whole document
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>validation data 2011</Typography.Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To make more detailed query ask for terms in a specific fields
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>object:electron</Typography.Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To point to nested fields use{" "}
            <Typography.Text code>.</Typography.Text>
            operator or one of many available aliases
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>
          researcher reviewer ananote arxiv status keyword dataset trigger
          object
        </Typography.Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To make your query more generic, use wildcards:
            <Typography.Text code>?</Typography.Text> for a single character
            <Typography.Text code>*</Typography.Text> for multiple ones
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>/DoubleMu*/*/AOD</Typography.Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To search for terms contatining special characters escape them with{" "}
            <Typography.Text code>/</Typography.Text>
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>* ? . : ! ( ) {} [ ] &quot; ~</Typography.Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To search for a range of dates, put them in brackets, using the
            keyword <Typography.Text code>TO</Typography.Text> between them. The
            dates follow the <Typography.Text code>YYYY-MM-DD</Typography.Text>
            standard.
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>
          deadline:[2018-01-20 TO 2020-02-01]
        </Typography.Text>
      </Descriptions.Item>
      <Descriptions.Item
        label={
          <Typography.Title strong level={5}>
            To search for the whole phrase, put it in quotes. Keep in mind that
            <Typography.Text code>phrases are not analyzed</Typography.Text>,
            hence all special characters (like wildcards) do not have any
            effect.
          </Typography.Title>
        }
        span={24}
      >
        <Typography.Text code>researcher:&quot;John Doe&quot;</Typography.Text>
      </Descriptions.Item>
    </Descriptions>
  );
};

HowToSearch.propTypes = {};

export default HowToSearch;

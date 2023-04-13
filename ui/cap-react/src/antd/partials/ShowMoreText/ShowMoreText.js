import { useState } from "react";
import PropTypes from "prop-types";
import { Button, Typography } from "antd";

const ShowMoreText = (
  props,
  { ellipsis = { rows: 3, expandable: true, symbol: "Show More" } }
) => {
  const [expand, setExpand] = useState(false);
  const [counter, setCounter] = useState(0);

  return (
    <>
      <Typography.Paragraph
        key={counter}
        {...props}
        ellipsis={{
          ...ellipsis,
          onExpand: () => {
            setExpand(true);
            expand && setCounter(counter + 1);
          },
        }}
      >
        {props.children}
      </Typography.Paragraph>
      {expand && (
        <Button
          type="link"
          onClick={() => {
            setExpand(false);
            expand && setCounter(counter + 1);
          }}
        >
          Show Less
        </Button>
      )}
    </>
  );
};

ShowMoreText.propTypes = {
  children: PropTypes.string,
};

export default ShowMoreText;

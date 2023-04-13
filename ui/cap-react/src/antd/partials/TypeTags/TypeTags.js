import { useState } from "react";
import { Tag } from "antd";
import PropTypes from "prop-types";

const { CheckableTag } = Tag;

function TypeTags({ types, updateActiveList }) {
  const [selectedTags, setSelectedTags] = useState(types.sort()[0]);

  return types.map(tag => (
    <CheckableTag
      key={tag}
      checked={selectedTags.indexOf(tag) > -1}
      onChange={() => {
        setSelectedTags(tag);
        updateActiveList(tag);
      }}
    >
      {tag}
    </CheckableTag>
  ));
}

TypeTags.propTypes = {
  types: PropTypes.array,
  updateActiveList: PropTypes.func,
};

export default TypeTags;

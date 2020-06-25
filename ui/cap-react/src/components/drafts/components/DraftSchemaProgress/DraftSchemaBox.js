import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "grommet/components/Box";
import Anchor from "grommet/components/Anchor";
import { AiOutlineCheck, AiOutlinePlus } from "react-icons/ai";

const DraftSchemaBox = ({ item, draft_id, fields }) => {
  const [all, setAll] = useState([]);
  const [non, setNon] = useState([]);

  useEffect(() => {
    let allFields = fields.filter(field => field.id.includes(item[0]));

    let nonEmptyFields = allFields.filter(
      empties => empties.content !== undefined
    );

    setAll(allFields.length);
    setNon(nonEmptyFields.length);
  }, []);

  if (all === 0 && non === 0) {
    return (
      <Anchor path={`/drafts/${draft_id}/edit`}>
        <Box direction="row" align="center" pad="small" colorIndex="light-2">
          <AiOutlinePlus /> add
        </Box>
      </Anchor>
    );
  }

  return (
    <Box>
      <Box
        style={{
          position: "absolute",
          height: "1px",
          width: non / all === 1 ? "0" : (non / all) * 100 + "%",
          bottom: "0",
          left: "0",
          background: "#007298"
        }}
      />
      <Box
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          background: non / all === 1 ? "#E9F9E0" : "#f5f5f5",
          zIndex: -1
        }}
      />
      <Box
        style={{
          display: non / all === 1 ? "block" : "none",
          position: "absolute",
          right: "5px",
          top: "50%",
          color: "#509137"
        }}
      >
        <AiOutlineCheck />
      </Box>
      <Box>fields</Box>
      <Box direction="row" responsive={false}>
        <Box style={{ fontSize: "16px" }}>{non} /</Box>
        <Box
          style={{
            fontSize: "12px",
            color: "rgba(0,0,0,.4)",
            marginLeft: "3px"
          }}
          justify="end"
        >
          {all}
        </Box>
      </Box>
    </Box>
  );
};

DraftSchemaBox.propTypes = {
  fields: PropTypes.array,
  item: PropTypes.array,
  metadata: PropTypes.object,
  draft_id: PropTypes.string
};

export default DraftSchemaBox;

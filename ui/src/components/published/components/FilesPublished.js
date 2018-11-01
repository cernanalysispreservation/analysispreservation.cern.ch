import React from "react";
import PropTypes from "prop-types";

import Label from "grommet/components/Label";
import List from "grommet/components/List";
import ListItem from "grommet/components/ListItem";
import prettyBytes from "pretty-bytes";
import NoteIcon from "grommet/components/icons/base/Note";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

const FilesPublished = props => {
  let files = props.files;
  return (
    <List>
      {files && files.length > 0 ? (
        files.map((i, index) => (
          <ListItem key={`${i.key}-${index}`} justify="between">
            <Label justify="center" margin="none" size="small" truncate={true}>
              <NoteIcon type="status" size="xsmall" /> {i.key}{" "}
              <strong>({prettyBytes(parseInt(i.size))})</strong>
            </Label>
          </ListItem>
        ))
      ) : (
        <ListPlaceholder
          emptyMessage="No files have been attached to this analysis."
          unfilteredTotal={0}
        />
      )}
    </List>
  );
};

FilesPublished.propTypes = {
  files: PropTypes.array
};

export default FilesPublished;

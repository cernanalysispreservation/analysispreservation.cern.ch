import React from "react";
import PropTypes from "prop-types";

import Label from "grommet/components/Label";
import List from "grommet/components/List";
import ListPlaceholder from "grommet-addons/components/ListPlaceholder";

import FileItem from "./FileItem";

// import ArchiveIcon from "grommet/components/icons/base/Archive";
// import DocumentConfigIcon from "grommet/components/icons/base/DocumentConfig";
// import PieChartIcon from "grommet/components/icons/base/PieChart";
// import BookIcon from "grommet/components/icons/base/Book";
// import NoteIcon from "grommet/components/icons/base/Note";

import { connect } from "react-redux";

class FileList extends React.Component {
  constructor(props) {
    super(props);
  }

  // _getIcon(type) {
  //   const catToIcon = {
  //     default: <ArchiveIcon type="status" size="xsmall" />,
  //     archive: <ArchiveIcon type="status" size="xsmall" />,
  //     configuration: <DocumentConfigIcon type="status" size="xsmall" />,
  //     dataset: <PieChartIcon type="status" size="xsmall" />,
  //     publication: <BookIcon type="status" size="xsmall" />,
  //     plot: <PieChartIcon type="status" size="xsmall" />
  //   };

  //   return catToIcon[type] ? (
  //     catToIcon[type]
  //   ) : (
  //       <NoteIcon type="status" size="xsmall" />
  //     );
  // }

  _actionItem(selected) {
    this.props.action(selected);
  }

  render() {
    return (
      <List selectable={this.props.selectableActionLayer ? true : false}>
        {this.props.files ? (
          Array.isArray(this.props.files) ? (
            this.props.files.map((file, index) => {
              return (
                <FileItem
                  key={`${file.key}-${index}`}
                  action={key =>
                    this.props.action ? this._actionItem.bind(this, key) : null
                  }
                  file={file}
                  status={this.props.status}
                />
              );
            })
          ) : this.props.files.size > 0 ? (
            this.props.files
              .keySeq()
              .toArray()
              .map((filename, index) => {
                let file = this.props.files.get(filename);
                return (
                  <FileItem
                    key={`${filename}-${index}`}
                    action={key =>
                      this.props.action
                        ? this._actionItem.bind(this, key)
                        : null
                    }
                    file={file}
                  />
                );
              })
          ) : null
        ) : (
          <ListPlaceholder
            emptyMessage={
              <Label size="small" margin="none">
                <strong>No files have been attached.</strong> Upload your
                analysis files here (n-tuples, macros, publication, output,
                etc). 10 GB of storage are available for each analysis
              </Label>
            }
            unfilteredTotal={0}
          />
        )}
      </List>
    );
  }
}

FileList.propTypes = {
  action: PropTypes.func,
  selectableActionLayer: PropTypes.func,
  files: PropTypes.object
};

const mapStateToProps = state => {
  return {
    selectableActionLayer: state.draftItem.get(
      "fileManagerLayerSelectableAction"
    )
  };
};

export default connect(mapStateToProps)(FileList);

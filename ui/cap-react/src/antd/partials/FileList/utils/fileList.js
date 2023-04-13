import { Space } from "antd";
import DropDownFiles from "../containers/DropDownFiles";
import { _getIcon } from "./getFileItemIcon";
export const constructTree = (data, setFile, onFileClick) => {
  let paths = [];

  data.mapEntries(item => {
    paths.push([item[0].split("/"), item[1]]);
  });

  let children = arrangeIntoTree(paths, setFile, onFileClick);

  return { children };
};

function arrangeIntoTree(paths, setFile, onFileClick) {
  // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
  let tree = [];

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i][0];
    let pathData = paths[i][1];
    let currentLevel = tree;
    for (let j = 0; j < path.length; j++) {
      let part = path[j];

      let existingPath = findWhere(currentLevel, "name", part);
      if (existingPath) {
        if (!existingPath.children) existingPath["children"] = [];
        currentLevel = existingPath.children;
      } else {
        let newPart = {
          name: part,
          key: part,
          title: (
            <Space>
              {_getIcon()}
              {part}
            </Space>
          ),
          data: pathData,
        };
        if (path.length > j + 1) newPart["children"] = [];
        if (!(path.length > j + 1)) {
          newPart["isLeaf"] = true;
          newPart["icon"] = _getIcon(pathData.mimetype);
          newPart["title"] = (
            <DropDownFiles
              file={newPart}
              infoClick={setFile}
              onFileClick={onFileClick}
            />
          );
        }

        currentLevel.push(newPart);
        currentLevel = newPart.children;
      }
    }
  }
  return tree;

  function findWhere(array, key, value) {
    // Adapted from https://stackoverflow.com/questions/32932994/findwhere-from-underscorejs-to-jquery
    let t = 0; // t is used as a counter
    while (t < array.length && array[t][key] !== value) {
      t++;
    } // find the index where the id is the as the aValue

    if (t < array.length) {
      return array[t];
    } else {
      return false;
    }
  }
}

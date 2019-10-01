export function arrangeIntoTree(paths) {
  // Adapted from http://brandonclapp.com/arranging-an-array-of-flat-paths-into-a-json-tree-like-structure/
  var tree = [];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i][0];
    var pathData = paths[i][1];
    var currentLevel = tree;
    for (var j = 0; j < path.length; j++) {
      var part = path[j];

      var existingPath = findWhere(currentLevel, "name", part);

      if (existingPath) {
        if (!existingPath.children) existingPath["children"] = [];
        currentLevel = existingPath.children;
      } else {
        var newPart = { name: part, data: pathData };
        if (path.length > j + 1) newPart["children"] = [];

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

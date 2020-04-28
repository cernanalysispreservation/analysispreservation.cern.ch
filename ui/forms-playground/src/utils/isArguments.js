export function isArguments(object) {
  return Object.prototype.toString.call(object) === "[object Arguments]";
}

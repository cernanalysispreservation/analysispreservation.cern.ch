import { push, replace } from "connected-react-router";

export function pushPath(path) {
  return dispatch => {
    dispatch(push(path));
  };
}

export function replacePath(path) {
  return dispatch => {
    dispatch(replace(path));
  };
}

import React from "react";
import { create } from "jss";
import { jssPreset, StylesProvider } from "@material-ui/core/styles";
import Frame from "react-frame-component";

function DemoFrame(props) {
  const { children, classes, theme, ...other } = props;
  const [state, setState] = React.useState({
    ready: false
  });
  const instanceRef = React.useRef();

  const handleRef = React.useCallback(ref => {
    instanceRef.current = {
      contentDocument: ref ? ref.node.contentDocument : null,
      contentWindow: ref ? ref.node.contentWindow : null
    };
  }, []);

  const onContentDidMount = () => {
    setState({
      ready: true,
      jss: create({
        plugins: jssPreset().plugins,
        insertionPoint: instanceRef.current.contentWindow["demo-frame-jss"]
      }),
      sheetsManager: new Map(),
      container: instanceRef.current.contentDocument.body,
      window: () => instanceRef.current.contentWindow
    });
  };
  return (
    <Frame ref={handleRef} contentDidMount={onContentDidMount} {...other}>
      <div id="demo-frame-jss" />
      {/* We need to wrap the material-ui form in a custom StylesProvider
            so that styles are injected into the iframe, not the parent window. */}
      {theme === "material-ui" ? (
        state.ready ? (
          <StylesProvider jss={state.jss} sheetsManager={state.sheetsManager}>
            {React.cloneElement(children, {
              container: state.container,
              window: state.window
            })}
          </StylesProvider>
        ) : null
      ) : (
        children
      )}
    </Frame>
  );
}

export default DemoFrame;

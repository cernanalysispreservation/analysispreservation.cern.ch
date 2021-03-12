import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton
} from "@draft-js-plugins/buttons";
import draftToMarkdown from "draftjs-to-markdown";

import createToolbarPlugin, {
  Separator
} from "@draft-js-plugins/static-toolbar";
import { convertToRaw } from "draft-js";
import { Box } from "grommet";
import "./RichEditorStyles.css";

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];
const text =
  "In this editor a toolbar shows up once you select part of the text …";

const RichEditor = props => {
  const [editorState, setEditorState] = useState(() =>
    createEditorStateWithText(text)
  );

  const editor = useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };

  const rawContentState = convertToRaw(editorState.getCurrentContent());
  const markup = draftToMarkdown(rawContentState, null, null, {
    blockTypesMapping: {
      /* mappings */
      emptyLineBeforeBlock: false
    }
  });

  console.log("====================================");
  console.log(markup);
  console.log("====================================");

  return (
    <Box>
      <Toolbar>
        {// may be use React.Fragment instead of div to improve perfomance after React 16
        externalProps => (
          <div className="rich-editor-toolbar">
            <BoldButton {...externalProps} />
            <ItalicButton {...externalProps} />
            <UnderlineButton {...externalProps} />
            <CodeButton {...externalProps} />
            <Separator {...externalProps} />
            <HeadlineOneButton {...externalProps} />
            <HeadlineTwoButton {...externalProps} />
            <HeadlineThreeButton {...externalProps} />
            <UnorderedListButton {...externalProps} />
            <OrderedListButton {...externalProps} />
            <BlockquoteButton {...externalProps} />
            <CodeBlockButton {...externalProps} />
          </div>
        )}
      </Toolbar>
      <Box onClick={focusEditor} className="editor">
        <Editor
          ref={editor}
          editorState={editorState}
          onChange={setEditorState}
          placeholder="Your text goes here..."
          plugins={plugins}
          spellCheck
        />
      </Box>
    </Box>
  );
};

RichEditor.propTypes = {};

export default RichEditor;

import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import Editor, { createEditorStateWithText } from "@draft-js-plugins/editor";
import {
  ItalicButton,
  BoldButton,
  CodeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton
} from "@draft-js-plugins/buttons";

import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import {
  convertToRaw,
  convertFromRaw,
  EditorState,
  SelectionState
} from "draft-js";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";

import moveSelectionToEnd from "./moveSelectioToEnd";

import { Box } from "grommet";
import "./RichEditorStyles.css";
import Button from "../Button";

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];

const RichEditor = () => {
  const [editorState, setEditorState] = useState(() =>
    createEditorStateWithText("")
  );
  const [preview, setPreview] = useState(false);

  const editor = useRef(null);
  const focusEditor = () => {
    editor.current.focus();
  };

  const convertToPreview = () => {
    let con = editorState.getCurrentContent();
    let raw = convertToRaw(con);
    let markup = draftToMarkdown(raw);
    let draft = markdownToDraft(markup);
    let content = convertFromRaw(draft);
    let state = EditorState.createWithContent(content);

    setPreview(true);
    setEditorState(state);
  };

  const convertToWrite = () => {
    let con = editorState.getCurrentContent();
    let raw = convertToRaw(con);
    let markup = draftToMarkdown(raw);
    let state = createEditorStateWithText(markup);

    setPreview(false);
    setEditorState(state);
  };

  return (
    <Box>
      <Toolbar>
        {externalProps => (
          <Box
            direction="row"
            responsive={false}
            colorIndex="light-1"
            justify="between"
            pad={{ horizontal: "small" }}
            margin={{ bottom: "small" }}
          >
            <Box
              direction="row"
              responsive={false}
              margin={{ vertical: "small" }}
            >
              <Button
                text="Write"
                margin="0 5px 0 0 "
                onClick={() => convertToWrite()}
                primary={!preview}
              />
              <Button
                text="Preview"
                primary={preview}
                onClick={() => convertToPreview()}
              />
            </Box>

            <div className="rich-editor-toolbar">
              <HeadlineOneButton {...externalProps} />
              <HeadlineTwoButton {...externalProps} />
              <HeadlineThreeButton {...externalProps} />
              <BoldButton {...externalProps} />
              <ItalicButton {...externalProps} />
              <CodeButton {...externalProps} />
              <UnorderedListButton {...externalProps} />
              <OrderedListButton {...externalProps} />
              <BlockquoteButton {...externalProps} />
              <CodeBlockButton {...externalProps} />
            </div>
          </Box>
        )}
      </Toolbar>

      <Box onClick={focusEditor} className="editor">
        <Editor
          ref={editor}
          editorState={EditorState.acceptSelection(
            editorState,
            editorState.getSelection()
          )}
          onChange={state => {
            if (state.getCurrentContent() !== editorState.getCurrentContent()) {
              let con = state.getCurrentContent();
              let raw = convertToRaw(con);
              let markup = draftToMarkdown(raw);
              let ate = createEditorStateWithText(markup);
              setEditorState(moveSelectionToEnd(ate));
            }
          }}
          placeholder="Your text goes here..."
          plugins={plugins}
          readOnly={preview}
          spellCheck
        />
      </Box>
    </Box>
  );
};

RichEditor.propTypes = {};

export default RichEditor;

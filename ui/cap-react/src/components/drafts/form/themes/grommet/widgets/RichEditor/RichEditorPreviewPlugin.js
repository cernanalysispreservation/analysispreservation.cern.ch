import * as React from "react";
import { PluginComponent } from "react-markdown-editor-lite";
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai";

export default class RichEditorPreviewPlugin extends PluginComponent {
  static pluginName = "cap-toggle";
  static align = "right";

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isEditView: this.getConfig("isEditView")
    };
  }

  handleClick() {
    if (this.state.isEditView.md) {
      this.editor.setView({ html: true, md: false });
      this.setState({ isEditView: { html: true, md: false } });
    } else {
      this.editor.setView({ html: false, md: true });
      this.setState({ isEditView: { html: false, md: true } });
    }
  }

  render() {
    return (
      <span
        className="button button-type-counter"
        title="Toggler"
        onClick={this.handleClick}
      >
        {this.state.isEditView.md ? (
          <AiOutlineEye color="#000" />
        ) : (
          <AiOutlineEdit color="#000" />
        )}
      </span>
    );
  }
}

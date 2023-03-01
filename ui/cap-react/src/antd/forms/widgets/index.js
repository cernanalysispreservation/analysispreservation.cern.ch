import TextWidget from "./TextWidget";
import SelectWidget from "./SelectWidget";
import RichEditorWidget from "./RichEditorWidget";
import SwitchWidget from "./SwitchWidget";
import CheckboxWidget from "./CheckboxWidget";
import UriWidget from "./UriWidget";

const widgets = {
  text: TextWidget,
  uri: UriWidget,
  select: SelectWidget,
  richeditor: RichEditorWidget,
  switch: SwitchWidget,
  checkbox: CheckboxWidget,
};

export default widgets;

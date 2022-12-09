import TextWidget from "./TextWidget";
import SelectWidget from "./SelectWidget";
import RichEditorWidget from "./RichEditorWidget";
import SwitchWidget from "./SwitchWidget";
import CheckboxWidget from "./CheckboxWidget";

const widgets = {
  text: TextWidget,
  select: SelectWidget,
  richeditor: RichEditorWidget,
  switch: SwitchWidget,
  checkbox: CheckboxWidget,
};

export default widgets;

import TextWidget from "./TextWidget";
import SelectWidget from "./SelectWidget";
import UpDownWidget from "./UpDownWidget";
import RadioWidget from "./RadioWidget";
import CheckboxWidget from "./CheckboxWidget";
import TextAreaWidget from "./TextAreaWidget";
import SwitchWidget from "./SwitchWidget";
import TagsWidget from "./TagsWidget";
import RichEditorSelector from "./RichEditor/RichEditorSelector";

const widgets = {
  text: TextWidget,
  select: SelectWidget,
  updown: UpDownWidget,
  radio: RadioWidget,
  checkboxes: CheckboxWidget,
  textarea: TextAreaWidget,
  richeditor: RichEditorSelector,
  switch: SwitchWidget,
  checkbox: SwitchWidget,
  tags: TagsWidget
};

export default widgets;

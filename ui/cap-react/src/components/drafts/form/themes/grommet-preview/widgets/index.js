import TextWidget from "./TextWidget";
import SelectWidget from "./SelectWidget";
import UpDownWidget from "./UpDownWidget";
import RadioWidget from "./RadioWidget";
import CheckboxWidget from "./CheckboxWidget";
import TextAreaWidget from "./TextAreaWidget";
import SwitchWidget from "./SwitchWidget";
import EmailWidget from "./EmailWidget";
import URLWidget from "./URLWidget";
import RichEditorSelect from "./RichEditor/RichEditorSelector";

const widgets = {
  text: TextWidget,
  select: SelectWidget,
  updown: UpDownWidget,
  radio: RadioWidget,
  checkboxes: CheckboxWidget,
  textarea: TextAreaWidget,
  richeditor: RichEditorSelect,
  switch: SwitchWidget,
  email: EmailWidget,
  uri: URLWidget
};

export default widgets;

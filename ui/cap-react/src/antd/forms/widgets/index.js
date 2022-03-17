import TextWidget from "./TextWidget";
import SelectWidget from "./SelectWidget";
import RichEditor from "./RichEditor";
import SwitchWidget from "./SwitchWidget";

const widgets = {
  text: TextWidget,
  latex: RichEditor,
  select: SelectWidget,
  richeditor: RichEditor,
  switch: SwitchWidget,
};

export default widgets;

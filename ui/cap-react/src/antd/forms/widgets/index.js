import TextWidget from "./TextWidget";
import SelectWidget from "./SelectWidget";
import RichEditor from "./RichEditor";

const widgets = {
  text: TextWidget,
  latex: RichEditor,
  select: SelectWidget,
  richeditor: RichEditor
};

export default widgets;

import TextWidget from './TextWidget';
import SelectWidget from './SelectWidget';
import UpDownWidget from './UpDownWidget';
import RadioWidget from './RadioWidget';
import CheckboxWidget from './CheckboxWidget';
import AutocompleteWidget from './AutocompleteWidget';
import TextAreaWidget from './TextAreaWidget';

const widgets = {
  text: TextWidget,
  select: SelectWidget,
  updown: UpDownWidget,
  radio: RadioWidget,
  checkboxes: CheckboxWidget,
  textarea: TextAreaWidget,
  autocomplete: AutocompleteWidget
};

export default widgets;

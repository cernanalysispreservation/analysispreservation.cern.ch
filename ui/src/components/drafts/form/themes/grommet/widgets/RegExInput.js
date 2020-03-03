import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RXInputMask } from "incr-regex-package";

const KEYCODE_Z = 90;
const KEYCODE_Y = 89;

const isUndo = e => {
  return (
    (e.ctrlKey || e.metaKey) &&
    e.keyCode === (e.shiftKey ? KEYCODE_Y : KEYCODE_Z)
  );
};

const isRedo = e => {
  return (
    (e.ctrlKey || e.metaKey) &&
    e.keyCode === (e.shiftKey ? KEYCODE_Z : KEYCODE_Y)
  );
};

const getSelection = el => {
  let start, end, rangeEl, clone;

  if (el.selectionStart !== undefined) {
    start = el.selectionStart;
    end = el.selectionEnd;
  } else {
    try {
      el.focus();
      rangeEl = el.createTextRange();
      clone = rangeEl.duplicate();

      rangeEl.moveToBookmark(document.selection.createRange().getBookmark());
      clone.setEndPoint("EndToStart", rangeEl);

      start = clone.text.length;
      end = start + rangeEl.text.length;
    } catch (e) {
      /* not focused or not visible */
    }
  }

  return { start, end };
};

const setSelections = (el, selection) => {
  let rangeEl;

  try {
    if (el.selectionStart !== undefined) {
      el.focus();
      el.setSelectionRange(selection.start, selection.end);
    } else {
      el.focus();
      rangeEl = el.createTextRange();
      rangeEl.collapse(true);
      rangeEl.moveStart("character", selection.start);
      rangeEl.moveEnd("character", selection.end - selection.start);
      rangeEl.select();
    }
  } catch (e) {
    /* not focused or not visible */
  }
};

const eqSel = (sel1, sel2) => {
  if (sel1 === sel2) return true;
  if (sel1 === undefined || sel2 === undefined) return false;
  return sel1.start === sel2.start && sel1.end === sel2.end;
};

const RegExInpt = props => {
  useEffect(
    () => {
      mask.setPattern(props.mask, {
        value: props.value,
        selection: mask.selection
      });
      setSelection(selection);
      setValues(props.value);
    },
    [props.mask.toString()]
  );
  useEffect(
    () => {
      mask.setValue(props.value);
    },
    [props.value]
  );

  let options = {
    pattern: props.mask || /.*/,
    value: props.value || ""
  };

  const [value, setValues] = useState(props.value || "");
  const [mask, setMask] = useState(new RXInputMask(options));
  const [selection, setSelection] = useState(props.selection);
  const [inputRef, setInputRef] = useState(null);

  const _updateMaskSelection = () => {
    setSelection(getSelection(inputRef));
  };
  const _updateInputSelection = () => {
    if (!eqSel(getSelection(inputRef), mask.selection))
      setSelections(inputRef, mask.selection);
  };
  const _onFocus = e => {
    if (props.onFocus) props.onFocus(e);
  };

  const _onBlur = e => {
    fireChange(e);
  };

  const fireChange = e => {
    if (props.onChange) {
      let opt = {
        value: mask._getValue(),
        target: e.target,
        name: props.name,
        mask: mask
      };
      props.onChange({ target: opt });
    }
  };

  const _onChange = e => {
    let maskValue = mask.getValue();
    if (e.target.value !== maskValue) {
      // Cut or delete operations will have shortened the value
      if (e.target.value.length < maskValue.length) {
        let sizeDiff = maskValue.length - e.target.value.length;
        _updateMaskSelection();
        mask.selection.end = mask.selection.start + sizeDiff;
        mask.backspace();
      }

      if (e.target.value) {
        _updateInputSelection();
      }
    }
    setSelection(mask.selection);
    fireChange(e);
  };

  const _onKeyDown = e => {
    const isKey = keyV => e => e.key === keyV;

    const _C = (test, action) => {
      if (!test(e)) return false;
      e.preventDefault();
      _updateMaskSelection();
      if (action()) {
        let oldVal = e.target.value;
        let value = _getDisplayValue();
        e.target.value = value;
        if (value) {
          _updateInputSelection();
        }
        if (props.onChange && oldVal != value) {
          fireChange(e);
        }
      }
      setSelection(mask.selection);
      return true;
    };
    if (
      _C(isUndo, () => mask.undo()) ||
      _C(isRedo, () => mask.redo()) ||
      _C(isKey("Backspace"), () => mask.backspace()) ||
      _C(isKey("Delete"), () => mask.del())
    )
      return;

    if (
      e.metaKey ||
      e.altKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.key === "Enter" ||
      e.key === "Tab"
    ) {
      return;
    }
    if (e.key === "ArrowLeft" || e.key == "ArrowRight") {
      // Check if mask supports arrow support
      let sel = getSelection(inputRef);

      if (sel.start === sel.end && mask.left !== undefined) {
        e.preventDefault();
        if (e.key === "ArrowLeft") mask.left(sel);
        else mask.right(sel);
        _updateInputSelection();
      }
    }
  };

  const _onKeyPress = e => {
    // Ignore modified key presses
    // Ignore enter key to allow form submission
    if (e.metaKey || e.altKey || e.ctrlKey || e.key === "Enter") {
      return;
    }

    e.preventDefault();
    _updateMaskSelection();

    if (insert(e.key)) {
      let oldVal = e.target.value;
      let value = mask.getValue();
      e.target.value = value;
      _updateInputSelection();
      setSelection(mask.selection);

      if (props.onChange && oldVal != value) {
        let opt = { target: { value: mask._getValue() } };
        props.onChange(opt);
      }
    }
  };
  const insert = ch => {
    if (mask.input(ch)) return true;
    if (ch !== ch.toUpperCase()) return mask.input(ch.toUpperCase());
    else if (ch != ch.toLowerCase()) return mask.input(ch.toLowerCase());
    return false;
  };

  const _onPaste = e => {
    e.preventDefault();
    _updateMaskSelection();
    // getData value needed for IE also works in FF & Chrome
    if (mask.paste(e.clipboardData.getData("Text"))) {
      e.target.value = mask.getValue();
      // Timeout needed for IE
      setTimeout(_updateInputSelection, 0);
      setSelection(mask.selection);
    }
  };

  const _getDisplayValue = () => {
    let value = mask.getValue();
    return value === mask.emptyValue ? "" : value;
  };
  let patternLength = mask.pattern.length;

  const setRef = aDomElem => {
    setInputRef(aDomElem);
  };

  return (
    <input
      style={{ padding: "3px 0px 3px 3px", outline: "none", border: "none" }}
      {...props}
      ref={setRef}
      maxLength={patternLength}
      onChange={_onChange}
      onKeyDown={_onKeyDown}
      onKeyPress={_onKeyPress}
      onPaste={_onPaste}
      onFocus={_onFocus}
      onBlur={_onBlur}
      placeholder={props.placeholder || mask.emptyValue}
      size={patternLength}
      value={_getDisplayValue()}
    />
  );
};

RegExInpt.propTypes = {
  value: PropTypes.string,
  mask: PropTypes.instanceOf(RegExp),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  onFocus: PropTypes.func
};

export default RegExInpt;

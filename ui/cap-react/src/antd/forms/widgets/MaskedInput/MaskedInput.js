import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState
} from "react";

import { useForwardedRef, FormContext } from "./utils";

import { Input } from "antd";

const parseValue = (mask, value) => {
  // break the value up into mask parts
  const valueParts = []; // { part, beginIndex, endIndex }
  let valueIndex = 0;
  let maskIndex = 0;

  while (
    value !== undefined &&
    value !== null &&
    valueIndex < value.length &&
    maskIndex < mask.length
  ) {
    const item = mask[maskIndex];

    let found;
    if (item.fixed) {
      const { length } = item.fixed;

      // grab however much of value (starting at valueIndex) matches
      // item.fixed. If none matches it and there is more in value
      // add in the fixed item.
      let matching = 0;
      while (
        matching < length &&
        value[valueIndex + matching] === item.fixed[matching]
      ) {
        matching += 1;
      }

      if (matching > 0) {
        let part = value.slice(valueIndex, valueIndex + matching);
        if (valueIndex + matching < value.length) {
          // matched part of the fixed portion but there's more stuff
          // after it. Go ahead and fill in the entire fixed chunk
          part = item.fixed;
        }
        valueParts.push({
          part,
          beginIndex: valueIndex,
          endIndex: valueIndex + matching - 1
        });
        valueIndex += matching;
      } else {
        valueParts.push({
          part: item.fixed,
          beginIndex: valueIndex,
          endIndex: valueIndex + length - 1
        });
      }

      maskIndex += 1;
      found = true;
    } else if (item.options) {
      // reverse assuming larger is later
      found = item.options
        .slice(0)
        .reverse()
        // eslint-disable-next-line no-loop-func
        .some(option => {
          const { length } = option;
          const part = value.slice(valueIndex, valueIndex + length);
          if (part === option) {
            valueParts.push({
              part,
              beginIndex: valueIndex,
              endIndex: valueIndex + length - 1
            });
            valueIndex += length;
            maskIndex += 1;
            return true;
          }
          return false;
        });
    }
    if (!found) {
      if (item.regexp) {
        const minLength =
          (Array.isArray(item.length) && item.length[0]) || item.length || 1;
        const maxLength =
          (Array.isArray(item.length) && item.length[1]) ||
          item.length ||
          value.length - valueIndex;

        let length = maxLength;

        while (!found && length >= minLength) {
          // make sure that if the regex needs capidatl letters
          // then transform them to upperCase so then is provided an easier UX
          const part =
            item.regexp.includes("A-Z") && !item.regexp.includes("a-z")
              ? value.slice(valueIndex, valueIndex + length).toUpperCase()
              : value.slice(valueIndex, valueIndex + length);

          let reg = new RegExp(item.regexp);

          if (reg.test(part)) {
            valueParts.push({
              part,
              beginIndex: valueIndex,
              endIndex: valueIndex + length - 1
            });
            valueIndex += length;
            maskIndex += 1;
            found = true;
          }
          length -= 1;
        }
        if (!found) {
          valueIndex = value.length;
        }
      } else {
        const length = Array.isArray(item.length)
          ? item.length[1]
          : item.length || value.length - valueIndex;
        const part = value.slice(valueIndex, valueIndex + length);
        valueParts.push({
          part,
          beginIndex: valueIndex,
          endIndex: valueIndex + length - 1
        });
        valueIndex += length;
        maskIndex += 1;
      }
    }
  }
  return valueParts;
};

const version = [
  {
    regexp: "^.*$"
  }
];

const defaultMask = version;

const MaskedInput = forwardRef(
  (
    {
      a11yTitle,
      focus: focusProp,
      icon,
      id,
      mask = defaultMask,
      name,
      onBlur,
      schemaMask,
      onChange,
      onFocus,
      onPressEnter,
      placeholder,
      plain,
      buttons,
      reverse,
      value: valueProp,
      disabled,
      message,
      ...rest
    },
    ref
  ) => {
    const formContext = useContext(FormContext);

    const [value, setValue] = formContext.useFormInput(name, valueProp);

    const [valueParts, setValueParts] = useState(parseValue(mask, value));
    useEffect(
      () => {
        setValueParts(parseValue(mask, value));
      },
      [mask, value]
    );

    const inputRef = useForwardedRef(ref);

    const [focus, setFocus] = useState(focusProp);
    const [activeMaskIndex, setActiveMaskIndex] = useState();

    useEffect(
      () => {
        if (focus) {
          const timer = setTimeout(() => {
            // determine which mask element the caret is at
            const caretIndex = inputRef.current.selectionStart;
            let maskIndex;
            valueParts.some((part, index) => {
              if (
                part.beginIndex <= caretIndex &&
                part.endIndex >= caretIndex
              ) {
                maskIndex = index;
                return true;
              }
              return false;
            });
            if (maskIndex === undefined && valueParts.length < mask.length) {
              maskIndex = valueParts.length; // first unused one
            }
            if (maskIndex && mask[maskIndex].fixed) {
              maskIndex -= 1; // fixed mask parts are never "active"
            }
            if (maskIndex !== activeMaskIndex) {
              setActiveMaskIndex(maskIndex);
            }
          }, 10); // 10ms empirically chosen
          return () => clearTimeout(timer);
        }
        return undefined;
      },
      [activeMaskIndex, focus, inputRef, mask, valueParts]
    );

    const setInputValue = useCallback(
      nextValue => {
        // Calling set value function directly on input because React library
        // overrides setter `event.target.value =` and loses original event
        // target fidelity.
        // https://stackoverflow.com/a/46012210 &&
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          "value"
        ).set;
        nativeInputValueSetter.call(inputRef.current.input, nextValue);

        const event = new Event("input", { bubbles: true });
        inputRef.current.input.dispatchEvent(event);
      },
      [inputRef]
    );

    // This could be due to a paste or as the user is typing.
    const onChangeInput = useCallback(
      event => {
        // Align with the mask.

        const nextValueParts = parseValue(mask, event.target.value);
        const nextValue = nextValueParts.map(part => part.part).join("");

        if (nextValue !== event.target.value) {
          // The mask required inserting something, change the input.
          // This will re-trigger this callback with the next value
          setInputValue(nextValue);
        } else if (value !== nextValue) {
          setValue(nextValue);
          if (onChange) onChange(event);
        }
      },
      [mask, onChange, setInputValue, setValue, value]
    );

    const renderPlaceholder = () => {
      return mask.map(item => item.placeholder || item.fixed).join("");
    };

    const status = new RegExp(schemaMask).test(valueProp);

    return (
      <div>
        <Input
          disabled={disabled}
          ref={inputRef}
          aria-label={a11yTitle}
          id={id}
          name={name}
          autoComplete="off"
          plain={plain}
          placeholder={placeholder || renderPlaceholder()}
          icon={icon}
          reverse={reverse}
          focus={focus}
          {...rest}
          value={valueProp}
          onPressEnter={onPressEnter}
          onFocus={event => {
            setFocus(true);

            if (onFocus) onFocus(event);
          }}
          onBlur={event => {
            if (status) {
              if (!onBlur) return;
              setFocus(false);
              onBlur(event);
            }
          }}
          onChange={onChangeInput}
          suffix={buttons && buttons(status)}
        />
        {message && (
          <div
            style={{
              marginLeft: "5px",
              color: message.status == "success" ? "green" : "#ff4d4f"
            }}
          >
            {message.message}
          </div>
        )}
      </div>
    );
  }
);

export default MaskedInput;

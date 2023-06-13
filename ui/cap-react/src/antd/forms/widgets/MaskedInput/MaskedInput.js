import { Input } from "antd";
import InputMask from "react-input-mask";

const MAPPINGS = {
  a: /[a-z]/,
  A: /[A-Z]/,
  0: /[0-9]/,
  "*": /[a-zA-Z0-9]/,
};

const MaskedInput = ({
  id,
  mask,
  pattern,
  name,
  onBlur,
  onChange,
  onFocus,
  onPressEnter,
  placeholder,
  buttons,
  value,
  disabled,
  message,
  convertToUppercase,
}) => {
  const status = new RegExp(pattern).test(value);

  return (
    <div>
      <InputMask
        mask={
          mask &&
          mask
            .split(/(.*?[^\\])/)
            .filter(i => i) // needed to remove empty entries
            .map(i => {
              let mappings = convertToUppercase
                ? { ...MAPPINGS, a: /[a-zA-Z]/, A: /[a-zA-Z]/ }
                : MAPPINGS;
              return i in mappings ? mappings[i] : i.replace("\\", "");
            })
        }
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onPressEnter={onPressEnter}
        value={value}
        disabled={disabled}
      >
        <Input
          id={id}
          name={name}
          placeholder={placeholder}
          autoComplete="off"
          suffix={buttons && buttons(status)}
        />
      </InputMask>
      {message && (
        <div
          style={{
            marginLeft: "5px",
            color: message.status == "success" ? "green" : "#ff4d4f",
          }}
        >
          {message.message}
        </div>
      )}
    </div>
  );
};

export default MaskedInput;

import { Switch } from "antd";

const ReverseSwitchWidget = ({ value, onChange }) => {
  return (
    <Switch
      onChange={checked => onChange(!checked)}
      checked={value === undefined ? false : !value}
    />
  );
};

export default ReverseSwitchWidget;

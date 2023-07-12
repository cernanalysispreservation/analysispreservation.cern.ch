import { Switch } from "antd";

const RequiredWidget = ({ value, onChange, path, updateRequired }) => {
  const handleChange = checked => {
    onChange(checked);
    updateRequired(path.get("path").toJS(), checked);
  };

  return (
    <Switch onChange={handleChange} checked={value}>
      Required
    </Switch>
  );
};

export default RequiredWidget;

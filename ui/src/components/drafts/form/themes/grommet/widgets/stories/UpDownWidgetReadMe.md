# UpDown Widget :smiley:

The UpDown input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the NumberInput of the `Grommet` library and then customised under the style guides of the platform.

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name         | type      | Required   | Description                                                        | Values             |
| ------------ | --------- | ---------- | ------------------------------------------------------------------ | ------------------ |
| disabled     | `boolean` | No         | Assigned the `readonly` value fetched from `props`                 | `true`or`false`    |
| onChange     | `func`    | Yes        | Updates which `value` of the input.                                | ()=>{...}          |
| onBlur       | `func`    | Yes        | The onBlur function is fetched from `props`                        | ()=>{...}          |
| value        | `string`  | Yes        | The value is fetched from the `props` and assigned as defaultValue | Any `number` value |
| id           | `string`  | Predefined | The `id` of the input                                              | Any `string` value |
| name         | `string`  | Predefined | The `name` of the input                                            | Any `string` value |
| step         | `string`  | Predefined | The `step` of the input                                            | Any `number` value |
| min          | `string`  | Predefined | The `min` of the input                                             | Any `number` value |
| max          | `string`  | Predefined | The `max` of the input                                             | Any `number` value |
| defaultValue | `string`  | Yes        | The `value` fetched from `props`                                   | Any `number` value |

### Example

- Text Input

```
    <NumberInput
      disabled={props.readonly}
      id="item1"
      name="item-1"
      step={null}
      min={null}
      max={null}
      onChange={_onChange.bind(this)}
      onBlur={onBlur}
      defaultValue={value}
    />
```

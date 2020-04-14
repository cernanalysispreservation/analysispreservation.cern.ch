# Switch Widget :smiley:

The switch input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the Checkbox Button of the `Grommet` library and then customised under the style guides of the platform.

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name     | type      | Required   | Description                                                                             | Values             |
| -------- | --------- | ---------- | --------------------------------------------------------------------------------------- | ------------------ |
| disabled | `boolean` | No         | Assigned from the `props`. Fetches the `readonly` property. If not defined then `false` | `true`or`false`    |
| onChange | `func`    | Yes        | `rjsf onChange method`. Updates which `value` should be selected.                       | ()=>{...}          |
| toggle   | `boolean` | Predefined | Sets the UI to be `switch` instead of `checkbox`                                        | `true`             |
| name     | `string`  | Yes        | Fetches from the `props` the `id` value                                                 | Any `string` value |
| checked  | `boolean` | Yes        | Fetches the `formData` from `props` and decides whether should be checked or not        | `true` or `false`  |

### Example

- Radio Button

```
    <CheckBox
      disabled={props.readonly}
      key={props.id}
      toggle={true}
      name={props.id}
      onChange={_onChange}
      checked={checked}
    />
```

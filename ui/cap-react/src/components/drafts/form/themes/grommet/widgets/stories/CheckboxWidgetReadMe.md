# Checkbox Widget :smiley:

The checkbox input belongs to a wide collection of widgets:

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

| Name        | type               | Required   | Default Value                                                              | Values                 |
| ----------- | ------------------ | ---------- | -------------------------------------------------------------------------- | ---------------------- |
| enumOptions | `array of objects` | Yes        | []                                                                         | [{label:"", value:""}] |
| disabled    | `boolean`          | No         | Assigned from the `props`. Fetches the `readonly` property                 | `true`or`false`        |
| onChange    | `func`             | Yes        | `rjsf onChange method`. Updates which value should be checked              | ()=>{...}              |
| name        | `string`           | Yes        | It is fetched from the `props` and the `label` values is assigned          | Any `string` value     |
| key         | `string`           | Yes        | It is fetched from the `props` and the `label` values is assigned          | Any `string` value     |
| label       | `string`           | Yes        | It is fetched from the `props` from the objects in the `enumOptions` array | Any `string` value     |
| value       | `string`           | Yes        | It is fetched from the `props` from the objects in the `enumOptions` array | Any `string` value     |
| inline      | `string`           | Predefined | Always set to `"true"`                                                     | `"true"`               |

### Examples

- enumOptions

```
    enumOptions: [
    {
        label: "Choice 1",
        value: "Choice 1"
    }
]
```

- Checkbox

```
    props.options.enumOptions.map(item => (
        <CheckBox
            disabled={props.readonly}
            key={item.label}
            inline="true"
            name={item.label}
            label={item.value}
            value={item.value}
            onChange={_onChange}
        />
    ))
```

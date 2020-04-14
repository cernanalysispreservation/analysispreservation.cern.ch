# Radio Widget :smiley:

The radio input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the Radio Button of the `Grommet` library and then customised under the style guides of the platform.

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name        | type               | Required | Default Value                                                                     | Values                 |
| ----------- | ------------------ | -------- | --------------------------------------------------------------------------------- | ---------------------- |
| enumOptions | `array of objects` | Yes      | Fetched from the props. Relies in the `options` object                            | [{label:"", value:""}] |
| disabled    | `boolean`          | No       | Assigned from the `props`. Fetches the `readonly` property                        | `true`or`false`        |
| onChange    | `func`             | Yes      | `rjsf onChange method`. Updates which value should be checked                     | ()=>{...}              |
| name        | `string`           | Yes      | It is fetched from the `props` and the `label` value is assigned                  | Any `string` value     |
| key         | `string`           | Yes      | It is fetched from the `props` and the `value` value is assigned                  | Any `string` value     |
| id          | `string`           | Yes      | It is fetched from the `props` and the `value` value is assigned                  | Any `string` value     |
| label       | `string`           | Yes      | It is fetched from the `props` and the `value` value is assigned                  | Any `string` value     |
| value       | `string`           | Yes      | It is fetched from the `props` from the objects in the `enumOptions` array        | Any `string` value     |
| checked     | `boolean`          | Yes      | Compares the selected `value` with the item `value` to define if `checked` or not | `true` or `false`      |

### Example

- enumOptions

```
    [
        {
            label: "Choice 1",
            value: "Choice 1"
        },
        {
            label: "Choice 2",
            value: "Choice 2"
        }
    ]
```

- Radio Button

```
      options.enumOptions.map(item => (
            <RadioButton
              disabled={props.readonly}
              key={item.value}
              id={item.value}
              name={item.label}
              label={item.value}
              value={item.value}
              checked={value == item.value}
              onChange={_onChange}
            />
          )
```

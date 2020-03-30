# Select Widget :smiley:

The select input belongs to a wide collection of widgets:

- [x] Checkbox
- [x] Radio
- [x] Select
- [x] Switch
- [x] Tags
- [x] Text
- [x] TextArea
- [x] UpDown

This input is generated from the Select Button of the `Grommet` library and then customised under the style guides of the platform.

### General Information

The UI ecosystem of the [CAP](https://github.com/cernanalysispreservation/analysispreservation.cern.ch) platform relies to two main projects

- React Json Schema Forms for the form architecture [link](https://github.com/rjsf-team/react-jsonschema-form)

* Grommet V1 for the UI framework [link](https://github.com/grommet/grommet/tree/v1)

### Properties

| Name        | type               | Required   | Description                                                           | Values                 |
| ----------- | ------------------ | ---------- | --------------------------------------------------------------------- | ---------------------- |
| readonly    | `boolean`          | No         | Fetched from `props` and default value `false`                        | `true`or`false`        |
| enumOptions | `array of objects` | Yes        | This array is fetched from `props` inside the `options` object        | [{label:"", value:""}] |
| onChange    | `func`             | Yes        | `rjsf onChange method`. Updates which `value` should be selected.     | ()=>{...}              |
| onBlur      | `func`             | Yes        | `rjsf onChange method`. Fetched from `props`                          | ()=>{...}              |
| value       | `string`           | Yes        | Fetched from `props`. The value that should be selected               | The `value` string     |
| inline      | `boolean`          | No         | Fetched from `props` inside the options object. Default value `false` | `true` or `false`      |
| multiline   | `boolean`          | No         | Fetched from `props` inside the options object. Default value `false` | `true` or `false`      |
| plaleholder | `string`           | Predefined | Set to `"Choose from list"`                                           | Any `string` value     |

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
        },
        {
            label: "Choice 3",
            value: "Choice 3"
        },
        {
            label: "Choice 4",
            value: "Choice 4"
        }
    ]
```

- If readonly equals `true` then this text will be presented:

```
    <Box pad={{ horizontal: "medium" }}>
      <Paragraph>
        {`Selected Value:  ${props.value || " user inserted no value"}`}
      </Paragraph>
    </Box>
```

- Select Button

```
    <Select
      placeHolder="Choose from list"
      inline={props.options.inline ? true : false}
      multiple={props.options.multiple ? true : false}
      options={props.readonly ? null : props.options.enumOptions}
      value={props.value}
      onBlur={props.onBlur}
      onChange={_onChange}
    />
```

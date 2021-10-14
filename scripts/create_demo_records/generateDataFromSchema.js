#!/usr/bin/env node

const yargs = require('yargs/yargs')(process.argv);
const axios = require('axios');
const fs = require('fs');
const Chance = require('chance');

let async = require("async");
let jsf = require('json-schema-faker');
jsf.extend('chance', () => new Chance());
// jsf.option('requiredOnly', true);

let args = yargs.argv;

let url = args["u"];
let file = args["f"];
let number = args["n"];
let output = args["o"];

const PRESERVE_FIELDS = [
  '_deposit',
  '_buckets',
  '_files',
  '_review',
  '_experiment',
  '_access',
  '_user_edited',
  '_fetched_from',
  'control_number',
  'general_title',
  '$schema',
  "created",
  "updated",
  "_created",
  "_updated"
];

let faker_config = fs.readFileSync("faker_map.json");
let FAKER_MAP = JSON.parse(faker_config);

main(url, file, number, output)

function main(uri, file, number, output) {
  console.log(`URL: ${url} - File: ${file} - Number: ${number} - Output: ${output}`);

  if (url) generateFromURL(url, number, data => handleResult(data, output));
  else if (file) generateFromFile(file, number, data => handleResult(data, output));
  else console.log("ERROR: You need to either pass filepath (-f) OR a URL (-u)")
}

function handleResult(data, output) {
  if (output) writeToFile(output, data);
  else console.log(data);
}


function generateFromFile(filename, number = 1, cb) {
  fs.readFile(filename, 'utf8', (err, schema) => {
    if (err) {
      console.error(err)
      return
    }
    schema = JSON.parse(schema);
    return generate_data(schema, number, cb)
  })
}

function generateFromURL(url, number = 1, cb) {
  axios.get(url)
    .then(function (response) {
      // handle success
      schema = response.data;
      generate_data(schema, number, cb)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

function generate_data(schema, number = 1, cb) {
  schema = prepare_schema(schema);

  let functions = [...Array(number).keys()]
  .map(() => {
    return (callback) => {
      jsf.resolve(schema).then(item => {
        callback(null, item);
      });
    }
  })

  async.series(functions, (err, results) => {
    cb(results);
  });
}

function prepare_schema(schema) {
  let schema_props = schema.properties;
  schema_keys = Object.keys(schema_props)

  schema_keys.map(key => {
    if (key[0] == "_" || PRESERVE_FIELDS.indexOf(key) > -1 ) {
      delete schema_props[key];
    }
  })

  schema["properties"] = schema_props;
  schema["additionalProperties"] = false;
  schema = traverseAndReplace(schema);
  return schema;
}

function writeToFile(output, data) {
  let content = JSON.stringify(data, null, 2);
  fs.writeFileSync(output, content);
}

function traverseAndReplace(o) {
  for (var i in o) {
      // Chekc if key from FAKER_MAP
      if( Object.keys(FAKER_MAP).indexOf(i) > -1 ) {
        delete o[i];
        if ( Object.keys(o).indexOf(FAKER_MAP[i].key) < 0 ) {
          o[FAKER_MAP[i].key] = FAKER_MAP[i].params
        }
      }
      if (o[i] !== null && typeof(o[i])=="object") {
          //going one step down in the object tree!!
          o[i] = traverseAndReplace(o[i]);
      }
  }
  return o;
}

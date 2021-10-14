# Creating demo records

> ## Prerequisites
> - Make sure DB, ES, indices, schemas are all created properly
> - Create users that will act as creators
> - Have a resolved schema ready (either URL or file)
> - Generate faker map, for "x-cap-*" fields (optional - datasets, triggers and resources)
>
>



### 1. Install NPM dependencies
```
# while on the 'create_demo_records' directory

# install npm packeage needed
npm install
```

### 2. Generate X number of <schema> objects
```
# Generate from schema on file, give me 5 records
$ node generateDataFromSchema.js -f example-schema.json -n 5

# Generate from schema on file, give me 5 records, output to file
$ node generateDataFromSchema.js -f example-schema.json -n 5 -o data-demo.json

# Generate from schema on URL, give me 5 records
$ node generateDataFromSchema.js -u https://cernbox/test-file -n 5

# Generate from schema on URL, give me 5 records, output to file
$ node generateDataFromSchema.js -u https://cernbox/test-file -n 5 -o data-demo.json


```

### 3. Take output file and run cap CLI command

```
# Where file can be the generated demo record file (eg "./data-demo.json" )
# and ana_type is the schema type of records you want to create 
# 

$ cap fixtures create-deposit -f <file> -a <ana_type>

# More advanced options exist for `create-deposit` CLI command. You can see them 
# by doing

$ cap fixtures create-deposit --help

```


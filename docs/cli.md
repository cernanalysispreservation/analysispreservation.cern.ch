# CLI tools

A number of additional CLI commands have been created in order to provide an easy to use interface
for common functionality.

#### Deposit Creation

    cap fixtures create-deposit --f DATAFILE -r ROLE --u USER --o OWNER

Creates a new deposit through the CLI. The datafile contains a json with all the analysis metadata,
and the additional role/user/owner attributes provide access to the analysis. The role/users arguments can accept
multiple values, e.g:

    cap fixtures create-deposit --f path/to/file -r role1 -r role2 -u user1 -o owner1

#### Validation

    cap fixtures validate --ana-type ANA --ana-version VERSION --compare-with VERSION --status draft [--export /path/to/export --export-type md]

Validates deposit or record metadata based on their schema. The user needs to provide the schema url
OR the ana-type and version, as well as the schema version that they want to compare the records to.
If no version is provided, the latest will be used. If a -c parameter is not provided, the records 
will compare the data to their own schema. Some examples:

        cap fixtures validate --ana-type test-analysis --compare-with 1.0.0
        cap fixtures validate --ana-type test-analysis --status record

#### Schema updating
    
    cap fixtures schemas [--dir DIR --url URL]

Adds schemas to CAP, either by downloading them from a url, or by adding them from a path. If no args are provided,
then the schemas from the default path will be added to CAP, e.g:

    cap fixtures schemas --dir cap/folder/schemas
    cap fixtures schemas --url https://schemas.org/my-schema.json
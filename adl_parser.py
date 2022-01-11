block_names = ("object", "region", "info", "table")
table_k_v = "# val    err-     err+     xmin     xmax"


def adl_parser(adl_file='adl.adl'):
    """Returns the ADL parsed file as JSON object

    :param type: File
    :param adl_file: Input .adl from the user.
    :return : JSON object
    """
    json_parsed = {
        "object": [],
        "region": [],
        "info": [],
        "table": []
    }
    block_data = {}
    parsing_block = False
    parsing_table = False

    # Read the ADL file
    f = open(adl_file, 'r')

    for line in f:
        # Skip comment lines outside block
        if line.startswith("#"):
            continue

        # Skip empty lines w/o whitespaces or tabs
        if line in ['\n', '\r\n']:
            # Pop out the previous block when new line appears
            if parsing_block:
                json_parsed[block_type].append(block_data)
                block_data = {}
                parsing_block = False
                parsing_table = False
            else:
                continue

        line = line.strip()
        if not line:
            continue

        # Check for block types and parse the block data
        if line.startswith(block_names) and not block_data:
            block = line.split(" ", 1)
            block_type = block[0]
            block_data["name"] = block[-1]
            parsing_block = True
            continue

        # Pop out the block when new block starts without empty line
        elif line.startswith(block_names) and block_data:
            json_parsed[block_type].append(block_data)
            block_data = {}
            block_data["name"] = line.split(" ", 1)[-1]
            parsing_block = True
            parsing_table = False
            continue

        # Parse the keyword value pair under a block
        if parsing_block:
            # Skip comment lines inside the block
            if line.startswith("#") and line != table_k_v:
                continue

            # Parse the rows for the table block
            if block_type == "table":
                if line == table_k_v:
                    parsing_table = True
                    block_data["data"] = []
                    continue
                if parsing_table:
                    values = list(filter(None, line.split(" ")))
                    if len(values) == 5:
                        block_data["data"].append({
                            "val": values[0],
                            "err-": values[1],
                            "err+": values[2],
                            "xmin": values[3],
                            "xmax": values[4],
                        })
                    continue
            keyword_value = line.split(" ", 1)
            if keyword_value[0] == "select":
                # use list for storing `select` values
                if block_data.get(keyword_value[0]):
                    block_data[keyword_value[0]].append(keyword_value[-1])
                else:
                    block_data[keyword_value[0]] = [keyword_value[-1]]
            else:
                block_data[keyword_value[0]] = keyword_value[-1]

    return json_parsed

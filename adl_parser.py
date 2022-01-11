"""
json = {
	"block_<number>": {
		"blocktype": "blockname",
		"k1": "v1",
		"k2": ["v2", "v3"]
	}
}
"""

def adl_parser(adl_file='adl.adl'):
    """Returns the parsed file as JSON object

    :param type: File
    :param adl_file: Input .adl from a user.
    :return : JSON object
    """
    json_parsed={}
    indentation = []
    indentation.append(0)
    block_number = 1
    block_data = {}
    parsing_block = False

    f = open("adl.adl", 'r')

    for line in f:
        #import pdb; pdb.set_trace()
        # Skip comment lines
        if line.startswith("#"):
            continue

        # Skip empty lines w/o whitespaces or tabs
        if line in ['\n', '\r\n']:
            if parsing_block:
                json_parsed[block_number] = block_data
                block_data = {}
                block_number += 1
                parsing_block = False
            else:
                continue

        content = line.strip()
        indent = len(line) - len(content)

        if content.startswith("object") and not block_data:
            block_name = content.split(" ", 1)[-1]
            block_data["object"] = block_name
            parsing_block = True
            continue

        elif content.startswith("object") and block_data:
            json_parsed[block_number] = block_data
            block_data = {}
            block_name = content.split(" ", 1)[-1]
            block_data["object"] = block_name
            block_number += 1
            parsing_block = True
            indentation = [0]
            continue

        if indent > indentation[-1] or parsing_block:
            indentation.append(indent)
            data = content.split(" ", 1)
            if isinstance(block_data.get(data[0]), list):
                block_data[data[0]].append(data[-1])
            elif isinstance(block_data.get(data[0]), str):
                block_data[data[0]] = [block_data.get(data[0]), data[-1]]
            else:
                block_data[data[0]] = data[-1]        

    print(json_parsed)

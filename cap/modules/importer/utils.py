import re


def parse_url(url):
    """ verify url to find and return host, username and repository """
    # Pattern host/username/repository or host:username/repository
    # Example https://github.com/tiborsimko/myrepo and git@github.com:tiborsimko/myrepo
    pattern = r"(?P<host>github\.com|gitlab\.cern\.ch)[:|\/](?P<user>[a-zA-Z][\w.-]+)\/(?P<repo>[\w.-]+)"
    match = re.search(pattern, url, re.IGNORECASE)
    if not match:
        raise ValueError("The URL cannot be parsed, please provide a valid URL.")
    p = match.groupdict()
    # Remove '.git' if it is there
    if p['repo'].endswith(".git"): p['repo'] = p['repo'][:-4]
    return p['host'], p['user'], p['repo']


def main():
    print('/'.join(parse_url("https://github.com/tiborsimko/myrepo")))
    print('/'.join(parse_url("git@github.com:tiborsimko/myrepo")))
    print('/'.join(parse_url("https://github.com/atrisovic/cap-import.git")))
    print('/'.join(parse_url("https://gitlab.cern.ch/atrisovi/my-internal-project.git")))


if __name__ == '__main__':
    main()
    
import os
import argparse
import gitlab
from importer import Importer


def parse_args():
    """ parse arguments """
    parser = argparse.ArgumentParser()
    parser.add_argument("url", help="The Gitlab URL")
    parser.add_argument("token", help="The Gitlab API Token")
    parser.add_argument("-d", "--destination", default=os.getcwd(), help="The destination directory.")
    return parser.parse_args()


class GitlabImporter(Importer):

    def __init__(self, repo, token):
        self.repo = repo
        self.token = token

    def archive_repository(self):
        """ download and archive repo via python-gitlab """
        gl = gitlab.Gitlab('https://gitlab.cern.ch', self.token, api_version=4)
        repo = gl.projects.get(self.repo)
        tgz = repo.repository_archive()
        with open("archive.tar.gz", "w") as f:
            f.write(tgz)


def main():
    args = parse_args()
    gli = GitlabImporter(args.url, args.token)
    gli.archive_repository()


if __name__ == '__main__':
    main()

import os
import argparse
import urllib
from github import Github
from importer import Importer


def parse_args():
    """ parse arguments """
    parser = argparse.ArgumentParser()
    parser.add_argument("url", help="The Github URL")
    parser.add_argument("token", help="The Github API Token")
    parser.add_argument("-d", "--destination", default=os.getcwd(), help="The destination directory.")
    return parser.parse_args()


class GithubImporter(Importer):

    def __init__(self, repo, token):
        self.repo = repo
        self.token = token

    def archive_repository(self):
        """ download and archive repo via PyGithub """
        gh = Github(self.token)
        # self.repo: username/reponame
        repo = gh.get_repo(self.repo)
        link = repo.get_archive_link("tarball")
        urllib.urlretrieve(link, os.path.join(os.getcwd(), "archive.tar.gz"))


def main():
    args = parse_args()
    ghi = GithubImporter(args.url, args.token)
    ghi.archive_repository()


if __name__ == '__main__':
    main()

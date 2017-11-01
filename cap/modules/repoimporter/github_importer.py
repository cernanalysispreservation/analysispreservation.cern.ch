from urllib2 import urlopen
from github import Github
from utils import parse_url
import repo_importer
import sys


class GithubImporter(repo_importer.RepoImporter):

    def __init__(self, repo, ref=None, token=None):
        if repo.count('/') > 1:
            _host, _user, _repo = parse_url(repo)
            self.repo = '{}/{}'.format(_user, _repo)
        else:
            self.repo = repo
        self.token = token
        self.ref = ref

    def archive_repository(self):
        """Download and archive repo via PyGithub."""
        gh = Github(self.token)
        repo = gh.get_repo(self.repo)
        if self.ref:
            link = repo.get_archive_link("tarball", ref=self.ref)
        else:
            link = repo.get_archive_link("tarball")
        tgz = urlopen(link).read()
        return sys.getsizeof(tgz), tgz

    def get_url_of_repository_archive(self):
        """Retrieve repository archive URL via PyGithub."""
        gh = Github(self.token)
        repo = gh.get_repo(self.repo)
        if self.ref:
            link = repo.get_archive_link("tarball", ref=self.ref)
        else:
            link = repo.get_archive_link("tarball")
        return link

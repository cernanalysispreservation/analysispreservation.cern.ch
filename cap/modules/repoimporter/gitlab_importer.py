import gitlab
import sys
import repo_importer
from utils import parse_url


class GitlabImporter(repo_importer.RepoImporter):

    def __init__(self, repo, ref=None, token=None):
        if repo.count('/') > 1:
            _host, _user, _repo = parse_url(repo)
            self.repo = '{}/{}'.format(_user, _repo)
        else:
            self.repo = repo
        self.token = token
        self.ref = ref  # branch/tag/commit

    def archive_repository(self):
        """Download and archive repo via python-gitlab."""
        gl = gitlab.Gitlab('https://gitlab.cern.ch', self.token, api_version=4)
        repo = gl.projects.get(self.repo)
        tgz = repo.repository_archive(self.ref)
        return sys.getsizeof(tgz), tgz

    def get_url_of_repository_archive(self):
        """Retrieve repository archive URL."""
        if self.ref:
            self.ref = self.ref.replace('/', '%2F')
        else:
            self.ref = "master"
        host = "https://gitlab.cern.ch"
        url = '{}/{}/repository/{}/archive.tar.gz'.format(host, self.repo, self.ref)
        if self.token:
            url = url + "?private_token=" + self.token
        return url

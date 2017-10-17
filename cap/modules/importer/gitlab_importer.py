import gitlab
from importer import Importer
import utils


class GitlabImporter(Importer):

    def __init__(self, repo, token=None):
        self.repo = repo
        self.token = token

    def archive_repository(self):
        """ download and archive repo via python-gitlab """
        gl = gitlab.Gitlab('https://gitlab.cern.ch', self.token, api_version=4)
        repo = gl.projects.get(self.repo)
        tgz = repo.repository_archive()
        with open("archive.tar.gz", "w") as f:
            f.write(tgz)

    def parse_url(self, url):
        utils.parse_urls(url)

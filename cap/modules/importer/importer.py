from abc import ABCMeta, abstractmethod


class Importer:
    __metaclass__ = ABCMeta

    @abstractmethod
    def archive_repository(self):
        pass

    @abstractmethod
    def parse_url(self, url):
        pass

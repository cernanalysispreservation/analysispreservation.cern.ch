import docker
import requests
from docker.errors import DockerException
from subprocess import check_call, CalledProcessError


class ImageImporter:
    """ ImageImporter saves docker images

    Attributes:
        image_name  eg. gitlab-registry.cern.ch/atrisovi/test-dockint
        image_tag   optional
        location    location to save the image at
        username    username
        token       private token
    """

    def __init__(self, username=None, token=None):
        if username is None or token is None:
            self.auth_config = None
        else:
            self.auth_config = {
                "username": username,
                "password": token
            }
        self.username = username
        self.token = token
        self.image_name = None
        self.image_tag = None
        self.location = None

    def archive_image(self, image_name, location, image_tag=None):
        """ Archives image """
        if ':' in image_name:
            self.image_name, self.image_tag = image_name.split(':')
        else:
            self.image_name = image_name
            self.image_tag = "latest"
        if image_tag is not None:
            self.image_tag = image_tag

        self.location = location
        if self.location[-1] == '/':
            self.location = location[:-1]

        try:
            self.archive_image_with_python()
        except (DockerException, requests.exceptions.Timeout) as e:
            try:  # try another method
                self.archive_image_with_skopeo()
            except CalledProcessError:
                return

    def archive_image_with_python(self):
        """ Archives image with docker-py. """
        self.location = '{}/{}_{}'.format(self.location, self.image_name.replace('/', '_'),
                                          self.image_tag)
        client = docker.from_env()
        img_name = '{}:{}'.format(self.image_name, self.image_tag)
        if self.auth_config:
            img = client.images.pull(img_name, auth_config=self.auth_config)
        else:
            img = client.images.pull(img_name)
        with open('{}.tar'.format(self.location), 'w') as f:
            resp = img.save()
            for chunk in resp:
                f.write(chunk)
        client.images.remove(img_name)

    def archive_image_with_skopeo(self):
        """ Archives image with skopeo. """
        if self.token is None:
            check_call(["skopeo", "copy", "docker://{}".format(self.image_name),
                        "dir:{}".format(self.location)])
        else:
            cred = "--src-creds={}:{}".format(self.username, self.token)
            check_call(["skopeo", "copy", cred, "docker://{}".format(self.image_name),
                        "dir:{}".format(self.location)])

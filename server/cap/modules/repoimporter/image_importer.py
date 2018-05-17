from subprocess import check_call


class ImageImporter:
    """ ImageImporter saves docker images

    Attributes:
        username    username
        token       private token
    """

    def __init__(self, username=None, token=None):
        self.username = username
        self.token = token

    def archive_image(self, image_name, location):
        """ Archives image """
        location = location.rstrip('/')

        if self.token is None:
            check_call(["skopeo", "copy",
                        "docker://{}".format(image_name),
                        "dir:{}".format(location)])
        else:
            cred = "--src-creds={}:{}".format(self.username, self.token)
            check_call(["skopeo", "copy", cred,
                        "docker://{}".format(image_name),
                        "dir:{}".format(location)])

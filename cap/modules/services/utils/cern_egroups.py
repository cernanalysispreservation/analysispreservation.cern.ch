from flask import current_app
from suds.client import Client

from .helpers import checkOK, generateGroup, getMemberObject

# Implementation idea from: https://gitlab.cern.ch/-/snippets/85

WSDL_URI = (
    "https://foundservices.cern.ch/ws/"
    "egroups/v1/EgroupsWebService/EgroupsWebService.wsdl"
)


class EgroupError(Exception):
    """Account not registered in LDAP exception."""

    pass


def getClient():
    try:
        client = Client(
            WSDL_URI,
            username=current_app.config.get("CERN_EGROUP_ACCOUNT_USERNAME"),
            password=current_app.config.get("CERN_EGROUP_ACCOUNT_PASSWORD"),
        )
        return client
    except Exception:
        raise EgroupError()


def findGroup(group_name=None):
    client = getClient()
    group = None
    try:
        group = client.service.FindEgroupByName(group_name).result
    except Exception:
        pass

    return group


def createGroup(group_name=None, description="-", owner=None):
    if not group_name:
        return

    client = getClient()

    if owner is None:
        owner = current_app.config.get("CERN_EGROUP_ACCOUNT_DEFAULT_OWNER_ID")

    group_name = group_name.lower()
    group = generateGroup(group_name, description, owner)

    try:
        result = client.service.SynchronizeEgroup(group)
        if not checkOK(result):
            errors = [warn["Message"] for warn in result.warnings]
            print(f"ERROR could not create group, {group_name}")
            print(f"reason given by server: {errors}")
            raise EgroupError({"errors": errors})
    except Exception as ex:
        raise EgroupError(ex)

    return result


def addMembers(group_name, members=[]):
    client = getClient()

    group_name = group_name.lower()
    members = [getMemberObject(member) for member in members]

    try:
        result = client.service.AddEgroupMembers(group_name, False, members)
        if not checkOK(result):
            errors = [warn["Message"] for warn in result.warnings]
            print(f"ERROR could not add group members in {group_name}")
            print(f"reason given by server: {errors}")
            raise EgroupError({"errors": errors})
    except Exception as ex:
        raise EgroupError(ex)

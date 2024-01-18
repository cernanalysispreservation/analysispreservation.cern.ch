import copy

# Implementation idea from: https://gitlab.cern.ch/-/snippets/85

EGROUP_OBJECT_TEMPLATE = {
    "Name": "",
    "Description": "",
    "Type": "StaticEgroup",
    "Usage": "SecurityMailing",
    "Owner": {},
    "Selfsubscription": "Closed",
    # "EgroupWithPrivileges": [
    #     {
    #         "Name": "test-group",
    #         "Privilege": "SeeMembers"
    #     },
    #     {
    #         "Name": "test-group-admin",
    #         "Privilege": "SeeMembers | Admin"
    #     }
    # ],
    "Privacy": "",
    "Members": [],
    "Comments": "This e-group was created dynamically/on-demand"
    " by CERN Analysis Preservation service",
}


def generate_members(members):
    # MEMBER_TYPES = [
    #     "Account",
    #     "DynamicEgroup",
    #     "StaticEgroup",
    #     "Person",
    #     "External",
    #     "ServiceProvider"

    # ]
    # for member in members:
    #     if members["Type"] in MEMBER_TYPES:
    return members


def generate_privileged_egroup(privileged_egroups):
    return privileged_egroups


def generate_type(type):
    TYPE_TYPES = ["StaticEgroup", "DynamicEgroup"]
    if type in TYPE_TYPES:
        return type


def generate_usage(usage):
    USAGE_TYPES = ["EgroupsOnly", "SecurityMailing"]
    if usage in USAGE_TYPES:
        return usage


def generate_owner(owner):
    return {"PersonId": owner}


def generate_selfsubscription(selfsubscription):
    SELF_SUBSCRIPTION_TYPES = [
        "Open",
        "Members",
        "Closed",
        "Users",
        "OpenWithAdminsAproval",
        "UsersWithAdminsAproval",
    ]
    if selfsubscription in SELF_SUBSCRIPTION_TYPES:
        return selfsubscription


def generate_privacy(privacy):
    PRIVACY_TYPES = [
        "Open",
        "Members",
        "Administrators",
        "Users",
    ]
    if privacy in PRIVACY_TYPES:
        return privacy


def generateGroup(
    name,
    description,
    owner,
    members=[],
    privileged_egroups=[],
    selfsubscription="Closed",
    privacy="Members",
    adminGroup=None,
    type="StaticEgroup",
    usage="SecurityMailing",
    status="Active",
):

    group = copy.copy(EGROUP_OBJECT_TEMPLATE)

    group["Name"] = name
    group["Description"] = description
    group["Privacy"] = generate_privacy(privacy)
    group["Members"] = generate_members(members)
    if privileged_egroups:
        group["EgroupWithPrivileges"] = generate_privileged_egroup(
            privileged_egroups
        )
    group["Type"] = generate_type(type)
    group["Usage"] = generate_usage(usage)
    group["Owner"] = generate_owner(owner)
    group["Selfsubscription"] = generate_selfsubscription(selfsubscription)

    return group


def checkOK(replyIn):

    reply = str(replyIn)
    if "ErrorType" in reply:
        return False

    return True


def getMemberObject(member):
    type = member.get("type")
    value = member.get("value")

    if type == "external":
        return {"Type": "External", "Email": value}
    elif type == "username":
        return {"Type": "Account", "Name": value}
    elif type == "personID":
        return {"Type": "Person", "ID": value}
    elif type == "egroup":
        return {"Type": "StaticEgroup", "Name": value}

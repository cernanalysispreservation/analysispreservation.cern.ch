from mock import patch

from cap.modules.repoimporter.errors import GitError
from cap.modules.repoimporter.models import GitWebhook, GitWebhookSubscriber
from cap.modules.repoimporter.tasks import ping_webhooks


@patch('cap.modules.repoimporter.factory.GitHubAPI.ping_webhook',
       return_value=None)
@patch('cap.modules.repoimporter.factory.GitLabAPI.ping_webhook',
       return_value=None)
def test_ping_webhooks_when_webhook_exist_status_stays_active(
    mocked_gitlab_api, mocked_github_api, db, gitlab_repo, github_repo,
    superuser, deposit):
    github_webhook = GitWebhook(event_type='push',
                                repo_id=github_repo.id,
                                external_id=1)
    gitlab_webhook = GitWebhook(event_type='push',
                                repo_id=gitlab_repo.id,
                                external_id=2)
    db.session.add(github_webhook)
    db.session.add(gitlab_webhook)
    sub1 = GitWebhookSubscriber(type='notify',
                                record_id=deposit.id,
                                user_id=superuser.id)
    sub2 = GitWebhookSubscriber(type='notify',
                                record_id=deposit.id,
                                user_id=superuser.id)
    github_webhook.subscribers.append(sub1)
    gitlab_webhook.subscribers.append(sub2)
    db.session.commit()

    ping_webhooks.delay()

    mocked_github_api.assert_called_with(sub1.webhook.external_id)
    mocked_gitlab_api.assert_called_with(sub2.webhook.external_id)

    assert GitWebhookSubscriber.query.get(sub1.id).status == 'active'
    assert GitWebhookSubscriber.query.get(sub2.id).status == 'active'


@patch('cap.modules.repoimporter.factory.GitHubAPI.ping_webhook',
       side_effect=GitError())
@patch('cap.modules.repoimporter.factory.GitLabAPI.ping_webhook',
       side_effect=GitError())
def test_ping_webhooks_when_webhook_doesnt_exists_change_subscriber_status_to_deleted(
    mocked_gitlab_api, mocked_github_api, db, gitlab_repo, github_repo,
    superuser, deposit):
    github_webhook = GitWebhook(event_type='push',
                                repo_id=github_repo.id,
                                external_id=1)
    gitlab_webhook = GitWebhook(event_type='push',
                                repo_id=gitlab_repo.id,
                                external_id=2)
    db.session.add(github_webhook)
    db.session.add(gitlab_webhook)
    sub1 = GitWebhookSubscriber(type='notify',
                                record_id=deposit.id,
                                user_id=superuser.id)
    sub2 = GitWebhookSubscriber(type='notify',
                                record_id=deposit.id,
                                user_id=superuser.id)
    github_webhook.subscribers.append(sub1)
    gitlab_webhook.subscribers.append(sub2)
    db.session.commit()

    ping_webhooks.delay()

    mocked_github_api.assert_called_with(sub1.webhook.external_id)
    mocked_gitlab_api.assert_called_with(sub2.webhook.external_id)

    assert GitWebhookSubscriber.query.get(sub1.id).status == 'deleted'
    assert GitWebhookSubscriber.query.get(sub2.id).status == 'deleted'

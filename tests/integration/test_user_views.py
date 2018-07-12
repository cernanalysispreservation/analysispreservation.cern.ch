import json

from mock import patch


@patch('requests.get')
def test_get_orcid_when_no_results_for_given_name_returns_empty_object(
        mock_requests, app, auth_headers_for_superuser):
    class MockedResp:
        def json(self):
            return {
                'num-results': 0,
                'result': []
            }

    with app.test_client() as client:
        mock_requests.return_value = MockedResp()

        resp = client.get('/orcid?name=some-name',
                          headers=auth_headers_for_superuser)

        assert json.loads(resp.data) == {}


@patch('requests.get')
def test_get_orcid_when_multiple_results_for_given_name_returns_empty_object(
        mock_requests, app, auth_headers_for_superuser):
    class MockedResp:
        def json(self):
            return {
                'num-results': 2,
                'result': [
                    {
                        'orcid-identifier': {
                            'path': '0000-0002-2341-2132'
                        }
                    },
                    {
                        'orcid-identifier': {
                            'path': '0000-0002-2341-2132'
                        }
                    },
                ]
            }

    with app.test_client() as client:
        mock_requests.return_value = MockedResp()

        resp = client.get('/orcid?name=some-name',
                          headers=auth_headers_for_superuser)

        assert json.loads(resp.data) == {}


@patch('requests.get')
def test_get_orcid_when_exactly_one_results_returns_orcid_path(
        mock_requests, app, auth_headers_for_superuser):
    class MockedResp:
        def json(self):
            return {
                'num-results': 1,
                'result': [
                    {
                        'orcid-identifier': {
                            'path': '0000-0002-2341-2132'
                        }
                    }
                ]
            }

    with app.test_client() as client:
        mock_requests.return_value = MockedResp()

        resp = client.get('/orcid?name=some-name',
                          headers=auth_headers_for_superuser)

        assert json.loads(resp.data) == {'orcid': '0000-0002-2341-2132'}

## GitHub Connect with CAP

Follow the instructions below and connect GitHub for CAP.

1. Go to Settings => Developer Settings => OAuth Apps => New OAuth App

2. Fill in the registration form.
    - **Application name**: Something users will recognize and trust.
    - **Homepage URL**: The full URL to your application homepage.
    - **Authorization callback URL**: Application’s callback URL.
        - It should be the endpoint which handles GitHub Auth in CAP Server.
        - Default: BASE_URL + `/auth/authorize`
        - Example: `http://localhost/auth/authorize/github?ui=1`

3. Export the GitHub Client ID to the current server environment.
    - Local Setup: `EXPORT INVENIO_GITHUB_CLIENT_ID=<value>`
    - Docker Setup: Add ENV var `INVENIO_GITHUB_CLIENT_ID=<value>` in `app-base` service.

4. Generate a new client secret and export the GitHub Client Secret to the current server environment.
    - Local Setup: `EXPORT INVENIO_GITHUB_CLIENT_SECRET=<value>`
    - Docker Setup: Add ENV var `INVENIO_GITHUB_CLIENT_SECRET=<value>` in `app-base` service.

### Create Webhook with GitHub (Local/Docker Setup)

1. You have to add another ENV variable `WEBHOOK_NGROK_URL` for creating of custom Webhooks.
2. You can start a ngrok server with `ngrok http 5000` exposing it on port 5000.
3. Export the ngrok server url as `WEBHOOK_NGROK_URL` in the server environment.
4. Follow the UI to create a webhook for different event types.

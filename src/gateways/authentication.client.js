const { AuthorizationCode } = require('simple-oauth2');

class GoogleAuthenticationClient {
    static _instance;
    static getInstance() {
        if (GoogleAuthenticationClient._instance == null) {
            GoogleAuthenticationClient._instance = new GoogleAuthenticationClient();
        }
        return GoogleAuthenticationClient._instance;
    }

    accessToken;
    config = {
        client: {
          id: 'client_id',
          secret: 'client_secret'
        },
        auth: {
            tokenHost: 'https://oauth2.googleapis.com',
            tokenPath: '/token',
            authorizeHost: 'https://accounts.google.com',
            authorizePath: '/o/oauth2/v2/auth',
        },
    };

    redirectUri = 'https://bed1c44a85cf.ngrok.io/auth/callback';
    scope = 'https://www.googleapis.com/auth/calendar';

    authorizationConfig = {
        redirect_uri: this.redirectUri,
        scope: this.scope,
        state: '<state>'
    }

    client = new AuthorizationCode(this.config);

    authenticationUrl() {
        return this.client.authorizeURL(this.authorizationConfig);
    }

    async getToken(code) {
        const tokenParams = {
            code: code,
            redirect_uri: this.redirectUri,
            scope: this.scope,
        };
        this.accessToken = await this.client.getToken(tokenParams);
    }
}

module.exports.GoogleAuthenticationClient = GoogleAuthenticationClient;

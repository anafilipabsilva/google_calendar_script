require('dotenv').config();

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
            id: process.env.CLIENT_ID,
            secret: process.env.CLIENT_SECRET
        },
        auth: {
            tokenHost: 'https://oauth2.googleapis.com',
            tokenPath: '/token',
            authorizeHost: 'https://accounts.google.com',
            authorizePath: '/o/oauth2/v2/auth',
        },
    };

    redirectUri = '/auth/callback';
    scope = 'https://www.googleapis.com/auth/calendar';

    client = new AuthorizationCode(this.config);

    authenticationUrl(address) {
        return this.client.authorizeURL({
            redirect_uri: `${address}${this.redirectUri}`,
            scope: this.scope,
            state: '<state>'
        });
    }

    async getToken(code, address) {
        const tokenParams = {
            code: code,
            redirect_uri: `${address}${this.redirectUri}`,
            scope: this.scope,
        };
        console.log(tokenParams);
        this.accessToken = await this.client.getToken(tokenParams);
    }
}

module.exports.GoogleAuthenticationClient = GoogleAuthenticationClient;

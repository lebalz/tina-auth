interface Credentials {
    tenantID: string;
    clientID: string;
}
interface Metadata {
    authority: string;
    discovery: string;
    version: string;
}
interface Settings {
    validateIssuer: boolean,
    passReqToCallback: boolean,
    loggingLevel: string;
}

interface Config {
    credentials: Credentials;
    metadata: Metadata;
    settings: Settings;
}

const authConfig: Config = {
    credentials: {
        tenantID: process.env.TENANT_ID || '',
        clientID: process.env.CLIENT_ID || '',
    },
    metadata: {
        authority: 'login.microsoftonline.com',
        discovery: '.well-known/openid-configuration',
        version: 'v2.0',
    },
    settings: {
        validateIssuer: true,
        passReqToCallback: false,
        loggingLevel: 'warn'
    }
};

export default authConfig;
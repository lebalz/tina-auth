import { BearerStrategy, IBearerStrategyOptionWithRequest, VerifyBearerFunction } from 'passport-azure-ad';
import authConfig from './authConfig';

export interface User {
    email: string;
    firstName: string;
    lastName: string;
    oid: string;
}

export const getAuthInfo = (authInfo?: Express.AuthInfo): User => {
    if (!authInfo) {
        throw 'No valid authorization provided';
    }
    const { name, preferred_username, oid } = (authInfo as any) || {};
    if (!name || !preferred_username || !oid) {
        throw 'No valid authorization provided';
    }
    const nameParts: string[] = (name?.split(", ") || [])[0]?.split(" ") || [preferred_username.split("@")[0].split(".")[0] || '', preferred_username.split("@")[0].split(".")[1] || ""];
    const firstName = nameParts.pop()!;
    const lastName = nameParts.join(" ");
    return {
        email: preferred_username?.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        oid: oid
    };
};


// Set the Azure AD B2C options
const auth = {
    tenantID: authConfig.credentials.tenantID,
    clientID: authConfig.credentials.clientID,
    audience: authConfig.credentials.clientID,
    authority: authConfig.metadata.authority,
    version: authConfig.metadata.version,
    discovery: authConfig.metadata.discovery,
    scope: ['access_as_user'],
    validateIssuer: authConfig.settings.validateIssuer,
    passReqToCallback: authConfig.settings.passReqToCallback,
    loggingLevel: authConfig.settings.loggingLevel,
};

const options: IBearerStrategyOptionWithRequest = {
    identityMetadata: `https://${auth.authority}/${auth.tenantID}/${auth.version}/${auth.discovery}`,
    issuer: `https://${auth.authority}/${auth.tenantID}/${auth.version}`,
    clientID: auth.clientID,
    audience: auth.audience,
    validateIssuer: auth.validateIssuer,
    passReqToCallback: auth.passReqToCallback,
    loggingLevel: auth.loggingLevel as 'info' | 'warn' | 'error' | undefined,
    loggingNoPII: true,
    scope: auth.scope,
};

const BearerVerify: VerifyBearerFunction = async (token, done) => {
    const authInfo = getAuthInfo(token);
    const users = (process.env.ALLOWD_USER_EMAILS ?? '').split(/\s*[,;\s]+\s*/).filter(u => !!u).map(u => u.toLowerCase());
    if (users.includes(authInfo.email.toLowerCase())) {
        return done(null, authInfo, token);
    }
    done(null, false, token);
    // Send user info using the second argument
};

export const getStrategy = () => {
    const strategy = new BearerStrategy(options, BearerVerify);
    return strategy;
};

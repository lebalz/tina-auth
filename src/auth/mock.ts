import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport';
import { ParsedQs } from 'qs';
class MockStrat extends Strategy {
    name = 'oauth-bearer';
    constructor() {
        super();
    }
    async authenticate(
        this: StrategyCreated<this, this & StrategyCreatedStatic>,
        req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
        options?: any
    ) {
        const email = process.env.TEST_USER_EMAIL ?? 'foo.bar@baz.ch';        
        const nameParts: string[] = [email.split("@")[0].split(".")[0] || '', email.split("@")[0].split(".")[1] || ''];
        const firstName = nameParts.pop()!;
        const lastName = nameParts.join(" ");
        return this.success({email, firstName, lastName, oid: ''}, { preferred_username: email });
    }
}

export const getStrategy = () => {
    const strategy = new MockStrat();
    return strategy;
};
# Tina-Auth

## Development

Better error reporting for Azure AD: set `loggingNoPII: false` in `src/auth/azure-ad.ts`.

## Environment

Copy the `example.env` file to `.env` and fill in the values.

```bash
cp example.env .env
```


## Start

```bash
yarn run dev
```

## Dokku



```sh
dokku apps:create tina-auth
dokku domains:add tina-auth $DOMAIN
dokku postgres:create tina-auth
dokku postgres:link tina-auth tina-auth
dokku config:set tina-auth CLIENT_ID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
dokku config:set tina-auth TENANT_ID="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
dokku config:set --no-restart tina-auth DOKKU_LETSENCRYPT_EMAIL="foo@bar.ch"
dokku config:set hfr-tina-auth CORS_ORIGIN="allowed.domain.ch"
dokku config:set hfr-tina-auth SESSION_SECRET=""
dokku config:set hfr-tina-auth UNTIS_SCHOOL="gym_Schoolname"
dokku config:set hfr-tina-auth UNTIS_USER="xyz"
dokku config:set hfr-tina-auth UNTIS_SECRET="XYZXZXYZ"
dokku config:set hfr-tina-auth UNTIS_BASE_URL="xyz.webuntis.com"
dokku config:set hfr-tina-auth SESSION_SECRET="asdfg"

dokku storage:ensure-directory hfr-tina-auth
dokku storage:mount hfr-tina-auth /var/lib/dokku/data/storage/hfr-tina-auth/ical:/app/ical

dokku nginx:set tina-auth client-max-body-size 5mb

# deploy the app

dokku letsencrypt:enable tina-auth
```

```sh
git remote add dokku dokku@<your-ip>:tina-auth
git push -u dokku
```
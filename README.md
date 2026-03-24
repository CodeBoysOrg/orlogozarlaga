## Local setup

1. Install dependencies:

```bash
npm install
```

2. Configure `.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/orlogozarlaga"

AUTH0_DOMAIN="your-tenant.us.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
AUTH0_SECRET="32-byte-hex-secret"
AUTH_SESSION_SECRET="change-me-to-a-long-random-secret"
APP_BASE_URL="http://localhost:3000"
```

3. Start PostgreSQL locally:

```bash
docker run --name orlogozarlaga-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=orlogozarlaga \
  -p 5433:5432 \
  -d postgres:16
```

4. Run migrations and seed:

```bash
npx prisma migrate dev
npx prisma db seed
```

5. Start the app:

```bash
npm run dev
```

## Demo Login

- Email: `demo@user.com`
- Password: `123456`

## Auth0 Setup

1. Create a Regular Web Application in Auth0 Dashboard.

2. In `Application -> Settings`, set:

```text
Allowed Callback URLs:x
http://localhost:3000/auth/callback

Allowed Logout URLs:
http://localhost:3000/login

Allowed Web Origins:
http://localhost:3000
```

3. Copy the following values into `.env`:

```env
AUTH0_DOMAIN="your-tenant.us.auth0.com"
AUTH0_CLIENT_ID="your-client-id"
AUTH0_CLIENT_SECRET="your-client-secret"
APP_BASE_URL="http://localhost:3000"
```

4. Generate `AUTH0_SECRET` locally:

```bash
openssl rand -hex 32
```

Then place the output into:

```env
AUTH0_SECRET="paste-generated-value-here"
```

5. Enable Universal Login in Auth0 and keep the app on the default hosted login page.

6. Start the app and open:

```text
http://localhost:3000/login
```

7. Test the full flow:

- Click `Continue with Auth0`
- Sign up or log in from Auth0 hosted page
- Confirm you return to `/pocketDashboard`
- Click `Logout` and confirm you return to `/login`

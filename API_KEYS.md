# ShipDesk — API Keys Setup Guide

> You don't need ALL of these to get started. The app runs fine with just the core two.
> Add the others whenever you're ready to unlock those features.

---

## 🗂️ Where Does Each Key Go?

| Secret Name | Vercel | Railway | What it does |
|---|:---:|:---:|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | ✅ | ❌ | Clerk login on the frontend |
| `VITE_API_BASE_URL` | ✅ | ❌ | Points frontend to your Railway backend |
| `CLERK_SECRET_KEY` | ❌ | ✅ | Verifies Clerk logins on the backend |
| `SESSION_SECRET` | ❌ | ✅ | Signs client portal session cookies |
| `DATABASE_URL` | ❌ | ✅ Auto | Railway sets this for you automatically |
| `NODE_ENV` | ❌ | ✅ | Set to `production` |
| `GEMINI_API_KEY` | ❌ | ✅ | AI report generation |
| `AES_ENCRYPTION_KEY` | ❌ | ✅ | Data encryption |
| `GITHUB_CLIENT_ID` | ❌ | ✅ | GitHub repo connection |
| `GITHUB_CLIENT_SECRET` | ❌ | ✅ | GitHub repo connection |
| `GITHUB_WEBHOOK_SECRET` | ❌ | ✅ | GitHub repo connection |
| `GITHUB_OAUTH_CALLBACK_URL` | ❌ | ✅ | GitHub repo connection |
| `RESEND_API_KEY` | ❌ | ✅ | Sending emails to clients |
| `EMAIL_FROM` | ❌ | ✅ | Sending emails to clients |
| `CLOUDINARY_CLOUD_NAME` | ❌ | ✅ | File uploads |
| `CLOUDINARY_API_KEY` | ❌ | ✅ | File uploads |
| `CLOUDINARY_API_SECRET` | ❌ | ✅ | File uploads |
| `CLOUDINARY_UPLOAD_PRESET` | ❌ | ✅ | File uploads |
| `LEMONSQUEEZY_API_KEY` | ❌ | ✅ | Online payments |
| `LEMONSQUEEZY_STORE_ID` | ❌ | ✅ | Online payments |
| `LEMONSQUEEZY_PRODUCT_ID` | ❌ | ✅ | Online payments |
| `LEMONSQUEEZY_VARIANT_ID` | ❌ | ✅ | Online payments |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | ❌ | ✅ | Online payments |
| `CLERK_WEBHOOK_SECRET` | ❌ | ✅ | User profile sync |
| `FRONTEND_URL` | ❌ | ✅ | Your Vercel URL (for email links) |

> **Simple rule:** Vercel only needs 2 keys. Everything else goes in Railway.

---

## ✅ Vercel Environment Variables (Frontend — only 2 needed)

Go to your Vercel project → **Settings** → **Environment Variables** and add:

```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_xxxxxxxxxxxx
VITE_API_BASE_URL          = https://your-app.up.railway.app
```

- `VITE_CLERK_PUBLISHABLE_KEY` → from [clerk.com](https://clerk.com) → your app → **"API Keys"** → copy the Publishable key
- `VITE_API_BASE_URL` → your Railway backend URL (you get this after deploying to Railway)

---

## 🚂 Railway Environment Variables (Backend — everything else)

Go to your Railway project → your backend service → **"Variables"** tab and add the ones below.

---

### 🟢 Start Here — Must Have

#### GEMINI_API_KEY
**What it does:** Powers the AI that writes weekly status reports for your clients.

1. Open [aistudio.google.com](https://aistudio.google.com) and sign in with Google
2. Click **"Get API key"** in the left sidebar
3. Click **"Create API key"** → pick any Google Cloud project → click **"Create"**
4. Copy the key → add to **Railway** as:
   ```
   GEMINI_API_KEY = paste-your-key-here
   ```

---

#### AES_ENCRYPTION_KEY
**What it does:** Encrypts sensitive data before saving it to the database.

1. Open the **Shell** tab in Replit (or any terminal)
2. Run this command:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. Copy the 64-character string it prints → add to **Railway** as:
   ```
   AES_ENCRYPTION_KEY = paste-the-output-here
   ```
   > ⚠️ Never share this. If you lose it, encrypted data can't be recovered.

---

#### NODE_ENV
Set this directly in Railway Variables:
```
NODE_ENV = production
```

---

### 🔵 GitHub Integration
**What it does:** Connects GitHub repos so ShipDesk reads commits and auto-generates reports.

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in the form:

   | Field | What to enter |
   |---|---|
   | Application name | `ShipDesk` |
   | Homepage URL | Your Vercel URL (e.g. `https://yourapp.vercel.app`) |
   | Authorization callback URL | Your Railway URL + `/api/github/callback` |

   Example callback:
   ```
   https://your-app.up.railway.app/api/github/callback
   ```

4. Click **"Register application"**
5. Copy the values and add to **Railway**:
   ```
   GITHUB_CLIENT_ID          = paste-client-id-here
   GITHUB_CLIENT_SECRET      = paste-client-secret-here
   GITHUB_WEBHOOK_SECRET     = any-random-string-you-make-up
   GITHUB_OAUTH_CALLBACK_URL = https://your-app.up.railway.app/api/github/callback
   ```

---

### 📧 Email (Resend)
**What it does:** Sends magic login links and report notifications to your clients.

1. Go to [resend.com](https://resend.com) → create a free account
2. Click **"API Keys"** → **"Create API Key"** → name it `ShipDesk` → click **"Add"**
3. Add to **Railway**:
   ```
   RESEND_API_KEY = paste-your-key-here
   EMAIL_FROM     = you@yourdomain.com
   ```
   > 💡 For testing use `onboarding@resend.dev`. For production, verify your domain in Resend first.

---

### 🖼️ File Uploads (Cloudinary)
**What it does:** Stores logos, client files, and attachments.

1. Go to [cloudinary.com](https://cloudinary.com) → create a free account
2. From the dashboard, copy the three values and add to **Railway**:
   ```
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY    = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   ```
3. Create an Upload Preset:
   - Go to **Settings** (⚙️) → **"Upload"** tab → scroll to **"Upload presets"**
   - Click **"Add upload preset"** → set Signing mode to **`Unsigned`**
   - Name it `shipdesk` → click **"Save"**
   ```
   CLOUDINARY_UPLOAD_PRESET = shipdesk
   ```

---

### 💳 Payments (Lemon Squeezy)
**What it does:** Generates payment links on invoices so clients can pay you online.

1. Go to [lemonsqueezy.com](https://lemonsqueezy.com) → create an account and a store

2. **Store ID** → Settings → Stores → copy the number:
   ```
   LEMONSQUEEZY_STORE_ID = 12345
   ```

3. **API Key** → Settings → API → "Create new API key":
   ```
   LEMONSQUEEZY_API_KEY = paste-your-key-here
   ```

4. **Product & Variant** → Products → "New product" → create it → copy IDs:
   ```
   LEMONSQUEEZY_PRODUCT_ID = 67890
   LEMONSQUEEZY_VARIANT_ID = 11111
   ```

5. **Webhook** → Settings → Webhooks → "Add webhook":
   - URL: your Railway URL + `/api/webhooks/lemonsqueezy`
   ```
   LEMONSQUEEZY_WEBHOOK_SECRET = any-random-string-you-make-up
   ```

---

### 🔔 Clerk Webhook
**What it does:** Keeps your database updated when a user changes their profile in Clerk.

> 💡 **Skip this for now** — ShipDesk auto-creates users on first login. Only needed for profile update syncing.

1. Go to [clerk.com](https://clerk.com) → your app → **"Webhooks"** → **"Add Endpoint"**
2. URL: your Railway URL + `/api/webhooks/clerk`
3. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
4. Click **"Create"** → copy the Signing Secret:
   ```
   CLERK_WEBHOOK_SECRET = whsec_paste-here
   ```

---

### 🌐 FRONTEND_URL
**What it does:** Used in emails sent to clients — the link they click goes to your Vercel app.

```
FRONTEND_URL = https://yourapp.vercel.app
```

Set this in Railway after you've deployed to Vercel.

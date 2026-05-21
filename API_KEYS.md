# ShipDesk — API Keys Setup Guide

> You don't need ALL of these to get started. The app runs fine with just the core two.
> Add the others whenever you're ready to unlock those features.

---

## 🟢 Start Here — Must Have

### 1. GEMINI_API_KEY
**What it does:** Powers the AI that writes weekly status reports for your clients.

1. Open [aistudio.google.com](https://aistudio.google.com) and sign in with Google
2. Click **"Get API key"** in the left sidebar
3. Click **"Create API key"** → pick any Google Cloud project → click **"Create"**
4. Copy the key that appears
5. Paste it into Replit Secrets (or Railway/Vercel env vars) as:
   ```
   GEMINI_API_KEY = paste-your-key-here
   ```

---

### 2. AES_ENCRYPTION_KEY
**What it does:** Encrypts sensitive data before saving it to the database.

1. Open the **Shell** tab in Replit (bottom of screen)
2. Paste and run this command:
   ```
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
3. It will print a long string of letters and numbers — copy it
4. Add it as:
   ```
   AES_ENCRYPTION_KEY = paste-the-output-here
   ```
   > ⚠️ Keep this secret and never share it. If you lose it, encrypted data can't be recovered.

---

## 🔵 GitHub Integration
**What it does:** Lets you connect a GitHub repo to a project so ShipDesk can read commits and auto-generate reports.

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in the form like this:

   | Field | What to enter |
   |---|---|
   | Application name | `ShipDesk` |
   | Homepage URL | Your app URL (e.g. `https://yourapp.vercel.app`) |
   | Authorization callback URL | Your app URL + `/api/github/callback` |

   Example callback URL:
   ```
   https://yourapp.vercel.app/api/github/callback
   ```

4. Click **"Register application"**
5. You'll see a **Client ID** on the next page — copy it:
   ```
   GITHUB_CLIENT_ID = paste-client-id-here
   ```
6. Click **"Generate a new client secret"** → copy it:
   ```
   GITHUB_CLIENT_SECRET = paste-client-secret-here
   ```
7. Make up any password-like string for the webhook secret:
   ```
   GITHUB_WEBHOOK_SECRET = any-random-string-you-make-up
   ```
8. Add the full callback URL:
   ```
   GITHUB_OAUTH_CALLBACK_URL = https://yourapp.vercel.app/api/github/callback
   ```

---

## 📧 Email (Resend)
**What it does:** Sends magic login links and report notifications to your clients.

1. Go to [resend.com](https://resend.com) and create a free account
2. In the dashboard, go to **"API Keys"** → click **"Create API Key"**
3. Name it `ShipDesk` → click **"Add"** → copy the key:
   ```
   RESEND_API_KEY = paste-your-key-here
   ```
4. Set the email address your messages will be sent from:
   ```
   EMAIL_FROM = you@yourdomain.com
   ```
   > 💡 For testing, you can use `onboarding@resend.dev`. For production, add and verify your own domain in Resend first.

---

## 🖼️ File Uploads (Cloudinary)
**What it does:** Stores logos, client files, and attachments uploaded through the app.

1. Go to [cloudinary.com](https://cloudinary.com) and create a free account
2. On the dashboard homepage, you'll see three values — copy all three:
   ```
   CLOUDINARY_CLOUD_NAME = your-cloud-name
   CLOUDINARY_API_KEY    = your-api-key
   CLOUDINARY_API_SECRET = your-api-secret
   ```
3. Now create an **Upload Preset**:
   - Go to **Settings** (⚙️ icon) → **"Upload"** tab
   - Scroll down to **"Upload presets"** → click **"Add upload preset"**
   - Change **Signing mode** from `Signed` to **`Unsigned`**
   - Give it a name like `shipdesk`
   - Click **"Save"**
   - Copy the preset name:
   ```
   CLOUDINARY_UPLOAD_PRESET = shipdesk
   ```

---

## 💳 Payments (Lemon Squeezy)
**What it does:** Generates payment links on invoices so clients can pay you online.

1. Go to [lemonsqueezy.com](https://lemonsqueezy.com) and create an account
2. Create a store if you haven't already

3. **Get your Store ID:**
   - Go to **Settings** → **"Stores"**
   - Copy the number next to your store name:
   ```
   LEMONSQUEEZY_STORE_ID = 12345
   ```

4. **Get your API Key:**
   - Go to **Settings** → **"API"** → click **"Create new API key"**
   - Copy it:
   ```
   LEMONSQUEEZY_API_KEY = paste-your-key-here
   ```

5. **Create a Product** (used to generate invoice payment links):
   - Go to **Products** → **"New product"**
   - Create any simple product (name it "Invoice Payment" for example)
   - Copy the **Product ID** from the product page:
   ```
   LEMONSQUEEZY_PRODUCT_ID = 67890
   ```
   - Click into the product → copy the **Variant ID**:
   ```
   LEMONSQUEEZY_VARIANT_ID = 11111
   ```

6. **Set up a Webhook** (so the app knows when a payment completes):
   - Go to **Settings** → **"Webhooks"** → **"Add webhook"**
   - URL: your app URL + `/api/webhooks/lemonsqueezy`
   - Make up a secret string:
   ```
   LEMONSQUEEZY_WEBHOOK_SECRET = any-random-string-you-make-up
   ```

---

## 🔔 Clerk Webhook
**What it does:** Keeps your database up to date when a user changes their name/email in Clerk.

> 💡 **Skip this for now** — ShipDesk already auto-creates users when they first log in. You only need this if you want profile changes to sync automatically.

1. Go to [clerk.com](https://clerk.com) → open your app → click **"Webhooks"** in the sidebar
2. Click **"Add Endpoint"**
3. Enter your backend URL + `/api/webhooks/clerk`:
   ```
   https://your-railway-app.up.railway.app/api/webhooks/clerk
   ```
4. Under **"Subscribe to events"**, check: `user.created`, `user.updated`, `user.deleted`
5. Click **"Create"**
6. Copy the **Signing Secret** (starts with `whsec_`):
   ```
   CLERK_WEBHOOK_SECRET = whsec_paste-here
   ```

---

## 🌐 FRONTEND_URL
**What it does:** Used in emails sent to clients — links them back to your app.

```
FRONTEND_URL = https://yourapp.vercel.app
```

Set this to your Vercel URL after you deploy the frontend.

---

## 📋 Quick Reference Table

| Secret Name | Feature | Priority |
|---|---|---|
| `GEMINI_API_KEY` | AI report writing | ⭐ Start here |
| `AES_ENCRYPTION_KEY` | Data encryption | ⭐ Start here |
| `GITHUB_CLIENT_ID` | GitHub repo sync | When ready |
| `GITHUB_CLIENT_SECRET` | GitHub repo sync | When ready |
| `GITHUB_WEBHOOK_SECRET` | GitHub repo sync | When ready |
| `GITHUB_OAUTH_CALLBACK_URL` | GitHub repo sync | When ready |
| `RESEND_API_KEY` | Client emails | When ready |
| `EMAIL_FROM` | Client emails | When ready |
| `CLOUDINARY_CLOUD_NAME` | File uploads | When ready |
| `CLOUDINARY_API_KEY` | File uploads | When ready |
| `CLOUDINARY_API_SECRET` | File uploads | When ready |
| `CLOUDINARY_UPLOAD_PRESET` | File uploads | When ready |
| `LEMONSQUEEZY_API_KEY` | Online payments | When ready |
| `LEMONSQUEEZY_STORE_ID` | Online payments | When ready |
| `LEMONSQUEEZY_PRODUCT_ID` | Online payments | When ready |
| `LEMONSQUEEZY_VARIANT_ID` | Online payments | When ready |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | Online payments | When ready |
| `CLERK_WEBHOOK_SECRET` | User profile sync | Optional |
| `FRONTEND_URL` | Email links | After deployment |

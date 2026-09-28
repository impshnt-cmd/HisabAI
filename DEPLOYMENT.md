# HisabAI — Deploy karne ki poori guide

Teen cheezein deploy hoti hain, isi order mein:

1. **Database** — MongoDB Atlas
2. **Backend API** — Render
3. **Mobile app** — Android APK (GitHub Actions se, Android Studio ke bina) + optional Play Store / App Store

---

## Step 1 — Database (MongoDB Atlas, free)

1. https://www.mongodb.com/cloud/atlas/register pe account banao → free **M0** cluster.
2. **Database Access** → ek user + password banao.
3. **Network Access** → `0.0.0.0/0` add karo (Render ko access chahiye).
4. **Connect → Drivers** se connection string copy karo:
   `mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/hisabai`

Ye tumhara `MONGO_URI` hai.

## Step 2 — Code GitHub pe daalo

```bash
cd hisabai
git init
git add .
git commit -m "HisabAI first version"
# GitHub pe naya repo banao, phir:
git remote add origin https://github.com/<username>/hisabai.git
git branch -M main
git push -u origin main
```

(`.env` file `.gitignore` mein hai, isliye secrets push nahi honge.)

## Step 3 — Backend deploy (Render)

1. https://render.com → **New → Blueprint** → apna GitHub repo chuno. Repo mein `render.yaml` hai, Render sab khud setup kar dega.
2. Jo values maange (`sync: false` wali), wo bharo:
   - `MONGO_URI` → Step 1 wali
   - `GEMINI_API_KEY` → https://aistudio.google.com/apikey se
3. Deploy ke baad URL milega, jaise `https://hisabai-api.onrender.com`.
4. Browser mein kholo: `https://hisabai-api.onrender.com/api/health` → `{"status":"ok"}` aana chahiye.

> Free plan pe server idle hone ke baad sula deta hai — pehli request 30-50 second le sakti hai. Demo/production ke liye paid plan lo.

`GEMINI_MODEL` env variable se Gemini model badal sakte ho (default `gemini-2.5-flash`). Agar Google future mein model retire kare, bas ye value update kar do — code nahi badalna.

## Step 4 — Android APK banao (cloud pe, free)

1. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**
   - Name: `VITE_API_URL`
   - Value: `https://hisabai-api.onrender.com` (trailing `/` ya `/api` nahi)
2. **Actions** tab → **Build Android APK** → **Run workflow**.
3. 5-8 minute baad run khatam hoga. Us run ke page pe neeche **Artifacts → HisabAI-apk** download karo.
4. Zip kholo, `app-debug.apk` apne phone pe bhejo, install karo (Settings mein "Install unknown apps" allow karna padega).

Ye workflow khud `android/` project banata hai, icon + splash lagata hai, aur APK build karta hai.

### Ya apne computer pe (Android Studio ke saath)

```bash
cd frontend
cp .env.example .env        # VITE_API_URL apne Render URL pe set karo
npm install
npx cap add android          # sirf pehli baar
npm run app:icons            # icon + splash generate
npm run app:android          # build karke Android Studio kholta hai
```
Android Studio mein **Build → Generate Signed Bundle / APK**.

### iPhone (iOS)

Mac + Xcode chahiye:
```bash
npx cap add ios
npm run app:icons
npm run app:ios
```
Xcode mein Team select karo aur Run karo.

## Step 5 — Store pe publish (optional)

**Google Play** ($25 one-time)
1. https://play.google.com/console pe developer account banao.
2. Android Studio se **Signed Bundle (.aab)** banao (keystore file safe rakhna — har update mein wahi chahiye).
3. App create karo → store listing (naam, description, screenshots) → privacy policy URL → content rating → `.aab` upload → review ke liye submit.

**Apple App Store** ($99/year)
1. https://developer.apple.com/programs pe enroll karo.
2. Xcode: **Product → Archive → Distribute** → App Store Connect.
3. Listing bharo → TestFlight se test → review ke liye submit.

## Optional — Website version bhi (Vercel)

Same frontend web pe bhi chal sakta hai: Vercel pe repo import karo, **Root Directory = `frontend`**, env `VITE_API_URL` = Render URL. (`vercel.json` already hai.)

---

## Local pe chalana (development)

```bash
# terminal 1
cd backend && npm install && cp .env.example .env   # .env mein MONGO_URI, JWT_SECRET, GEMINI_API_KEY bharo
npm run dev

# terminal 2
cd frontend && npm install && npm run dev            # http://localhost:5173
```

## Kya kya deploy ke baad check karna

- [ ] `/api/health` chal raha hai
- [ ] Register → room create → invite code mila
- [ ] Doosre account se invite code se join hua
- [ ] Expense add karne pe Settlement page update hua
- [ ] AI Assistant page pe insight aaya (agar nahi, `GEMINI_API_KEY` check karo)

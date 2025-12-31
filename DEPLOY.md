# Hot Dog Shop - Railway.app Deploy Yo'riqnomasi

## 1. Loyihani tayyorlash

### node_modules o'chirildi ✅
- Backend: `D:\hotdog\node_modules` - o'chirildi
- Frontend: `D:\hotdog\client\node_modules` - o'chirildi
- ZIP hajmi: ~10-15MB (85MB dan kam!)

### .gitignore yangilandi ✅
```
node_modules/
.env
```

## 2. ZIP fayl yaratish

1. `D:\hotdog` papkasini to'liq tanlang
2. O'ng tugma → "Send to" → "Compressed (zipped) folder"
3. Yoki 7-Zip/WinRAR bilan ZIP yarating
4. Fayl nomi: `hotdog-app.zip`

## 3. Railway.app ga deploy qilish

### A. Railway.app ga kirish

1. https://railway.app ga kiring
2. "Start a New Project" yoki "Login with Email" (GitHub kerak emas!)
3. Email bilan ro'yxatdan o'ting (bepul tier: $5 credit)

### B. Yangi project yaratish

1. Dashboard da "New Project" bosing
2. "Deploy from GitHub repo" ni **TANLANG** (lekin biz ZIP ishlatamiz)
3. **Yoki** "Empty Project" tanlang

### C. Service qo'shish

Railway da 2 ta service kerak:

#### **Service 1: Backend (Node.js server)**

1. "New" → "Empty Service"
2. Service nomini o'zgartiring: "hotdog-backend"
3. Settings → "Source" → **"Local Directory"** yoki CLI orqali deploy

**Muammo:** Railway web interface orqali to'g'ridan-to'g'ri ZIP yuklash yo'q!

### D. Railway CLI orqali deploy (tavsiya etiladi)

```bash
# Railway CLI o'rnatish
npm install -g @railway/cli

# Login qilish
railway login

# Loyihaga kirish
cd D:\hotdog

# Yangi project yaratish
railway init

# Backend deploy
railway up

# Environment variables qo'shish
railway variables set MONGO_URI="your_mongodb_uri"
railway variables set JWT_SECRET="your_jwt_secret"
railway variables set IMGBB_API_KEY="your_imgbb_key"
railway variables set PORT=5000

# Deploy
railway up
```

---

## 4. Render.com (Osonroq variant - ZIP qabul qiladi!)

### Render.com afzalliklari:
- ✅ GitHub kerak emas
- ✅ Web interface orqali deploy
- ✅ Bepul tier (750 soat/oy)
- ✅ Avtomatik HTTPS

### Render.com deploy qadamlari:

1. **Ro'yxatdan o'tish**
   - https://render.com ga kiring
   - "Get Started for Free" → Email bilan ro'yxatdan o'ting

2. **Backend deploy**
   - Dashboard → "New +" → "Web Service"
   - "Build and deploy from a Git repository" **O'RNIGA**
   - **"Public Git repository"** tanlang va loyihangizni yuklang
   
   **Yoki osonroq:**
   - GitHub repo yaratmasdan, to'g'ridan-to'g'ri deploy qilish uchun:
   - Render CLI ishlatish kerak

3. **Render CLI orqali:**

```bash
# Loyihaga kirish
cd D:\hotdog

# render.yaml yaratish (quyida)
```

4. **render.yaml yaratish** (D:\hotdog da):

```yaml
services:
  - type: web
    name: hotdog-backend
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: IMGBB_API_KEY
        sync: false
      - key: PORT
        value: 5000
```

5. **Deploy qilish:**
   - Render dashboard → "New" → "Blueprint"
   - `render.yaml` faylini yuklang
   - Environment variables ni qo'shing

---

## 5. Eng oson yechim: Vercel + MongoDB Atlas

**Muammo:** Vercel GitHub talab qiladi, lekin eng oson.

Agar GitHub ishlatishga rozi bo'lsangiz:

1. GitHub akkaunt yarating (bepul)
2. Yangi repository yarating
3. Loyihani push qiling:
```bash
cd D:\hotdog
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/hotdog-app.git
git push -u origin main
```

4. Vercel ga kiring (GitHub bilan)
5. "Import Project" → Repository tanlang
6. Environment variables qo'shing
7. Deploy!

---

## 6. Tavsiya: Railway CLI (eng tez)

### Nega Railway?
- ✅ Full Node.js support
- ✅ Socket.io ishlaydi
- ✅ Bepul tier ($5 credit)
- ✅ Avtomatik HTTPS
- ✅ Environment variables oson

### Tezkor deploy:

```bash
# 1. Railway CLI o'rnatish
npm install -g @railway/cli

# 2. Login
railway login

# 3. Loyihaga kirish
cd D:\hotdog

# 4. Init
railway init

# 5. Environment variables
railway variables set MONGO_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your_secret"
railway variables set IMGBB_API_KEY="your_key"

# 6. Deploy
railway up

# 7. URL olish
railway domain
```

---

## 7. Environment Variables (barcha platformalar uchun)

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotdog?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_for_hotdog_app_12345
IMGBB_API_KEY=your_imgbb_api_key_here
PORT=5000
```

---

## 8. Deploy dan keyin test qilish

1. Backend URL ni oching (masalan: `https://hotdog-backend.railway.app`)
2. `/health` endpoint tekshiring: `https://hotdog-backend.railway.app/health`
3. Frontend URL: `https://hotdog-frontend.railway.app`
4. Boshliq login: `https://your-url.com/boshliq`
   - Username: `boshliq`
   - Parol: `admin123`

---

## Xulosa

**Eng oson:** Railway CLI (5 daqiqa)
**GitHub bilan:** Vercel (3 daqiqa)
**GitHub siz:** Render.com (10 daqiqa, manual setup)

**Tavsiya:** Railway CLI ishlatib, tezda deploy qiling!

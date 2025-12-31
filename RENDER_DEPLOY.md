# Render.com Deploy Yo'riqnomasi

## Loyiha tayyorligi ✅

Loyihangiz Render.com uchun tayyor:
- ✅ Backend: Node.js + Express
- ✅ Frontend: React (build qilinadi)
- ✅ Database: MongoDB Atlas
- ✅ Real-time: Socket.io
- ✅ Production static file serving qo'shildi

---

## 1. GitHub Repository yaratish (Render uchun kerak)

Render.com GitHub orqali deploy qiladi. Quyidagi qadamlarni bajaring:

### A. GitHub akkaunt yaratish (agar yo'q bo'lsa)
1. https://github.com ga kiring
2. "Sign up" bosing
3. Email, parol kiriting

### B. Yangi repository yaratish
1. GitHub da "+" → "New repository"
2. Repository nomi: `hotdog-app`
3. **Public** yoki **Private** tanlang
4. "Create repository" bosing

### C. Loyihani GitHub ga yuklash

PowerShell da quyidagi komandalarni bajaring:

```powershell
# Loyihaga kirish
cd D:\hotdog

# Git init (agar qilmagan bo'lsangiz)
git init

# Barcha fayllarni qo'shish
git add .

# Commit
git commit -m "Initial commit - Hot Dog Shop App"

# Remote qo'shish (GitHub URL ni o'zingiznikiga almashtiring)
git remote add origin https://github.com/username/hotdog-app.git

# Push qilish
git branch -M main
git push -u origin main
```

**Eslatma:** `username` ni o'zingizning GitHub username ga almashtiring!

---

## 2. Render.com ga deploy qilish

### A. Render akkaunt yaratish

1. https://render.com ga kiring
2. "Get Started for Free" bosing
3. **GitHub bilan kirish** (tavsiya etiladi)
4. GitHub akkauntingizni ulang

### B. Yangi Web Service yaratish

1. Render Dashboard da **"New +"** tugmasini bosing
2. **"Web Service"** ni tanlang
3. **"Connect a repository"** bo'limida:
   - GitHub repository ni tanlang: `hotdog-app`
   - "Connect" bosing

### C. Service sozlamalari

Quyidagi ma'lumotlarni kiriting:

**Basic Settings:**
- **Name:** `hotdog-shop` (yoki istalgan nom)
- **Region:** `Frankfurt (EU Central)` yoki yaqin region
- **Branch:** `main`
- **Root Directory:** bo'sh qoldiring
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:**
  ```bash
  npm install && npm run build
  ```

- **Start Command:**
  ```bash
  npm start
  ```

**Environment:**
- **Node Version:** `18` (yoki `20`)

### D. Environment Variables qo'shish

"Environment" bo'limida quyidagi o'zgaruvchilarni qo'shing:

```
MONGO_URI = mongodb+srv://username:password@cluster.mongodb.net/hotdog?retryWrites=true&w=majority
JWT_SECRET = my_super_secret_key_for_hotdog_app_12345
IMGBB_API_KEY = your_imgbb_api_key_here
NODE_ENV = production
PORT = 10000
```

**Muhim:**
- `MONGO_URI` - MongoDB Atlas connection string (parolda `!` bo'lsa `%21` qiling)
- `JWT_SECRET` - Kuchli secret key
- `IMGBB_API_KEY` - https://api.imgbb.com dan oling
- `NODE_ENV` - **production** bo'lishi shart
- `PORT` - Render avtomatik beradi, lekin 10000 yozish mumkin

### E. Deploy qilish

1. Barcha sozlamalarni to'ldirganingizdan keyin
2. **"Create Web Service"** tugmasini bosing
3. Render avtomatik build va deploy qiladi (5-10 daqiqa)

---

## 3. Deploy jarayonini kuzatish

### Build Logs

Deploy paytida Render quyidagi ishlarni bajaradi:

```
==> Cloning from https://github.com/username/hotdog-app...
==> Running build command: npm install && npm run build
==> Installing backend dependencies...
==> Building React frontend...
==> Build successful!
==> Starting server: npm start
==> Server listening on port 10000
==> MongoDB ga ulandi
==> Default admin yaratildi: boshliq / admin123
```

### Xatolar bo'lsa:

**MongoDB ulanish xatosi:**
- `MONGO_URI` to'g'riligini tekshiring
- MongoDB Atlas da IP whitelist: `0.0.0.0/0`

**Build xatosi:**
- GitHub da barcha fayllar borligini tekshiring
- `package.json` to'g'riligini tekshiring

---

## 4. Deploy dan keyin

### A. URL olish

Deploy muvaffaqiyatli bo'lgandan keyin:
- Render sizga URL beradi: `https://hotdog-shop.onrender.com`
- Bu URL orqali applikatsiyaga kirish mumkin

### B. Test qilish

1. **Health check:**
   ```
   https://hotdog-shop.onrender.com/health
   ```
   Javob: `{"status":"OK"}`

2. **Boshliq login:**
   ```
   https://hotdog-shop.onrender.com/boshliq
   ```
   - Username: `boshliq`
   - Parol: `admin123`

3. **Mijoz sahifasi:**
   ```
   https://hotdog-shop.onrender.com/
   ```

4. **Ekran:**
   ```
   https://hotdog-shop.onrender.com/ekran
   ```

### C. Socket.io sozlash

Frontend da Socket.io URL ni yangilash kerak. Quyidagi fayllarni o'zgartiring:

**1. `client/src/components/HodimDashboard.js`:**
```javascript
// 50-qator
const socket = io('https://hotdog-shop.onrender.com');
```

**2. `client/src/components/Ekran.js`:**
```javascript
// 15-qator
const socket = io('https://hotdog-shop.onrender.com');
```

**3. `client/src/components/BoshliqDashboard.js`:**
```javascript
// 50-qator
const socket = io('https://hotdog-shop.onrender.com');
```

O'zgartirishlardan keyin:
```bash
git add .
git commit -m "Update Socket.io URL for production"
git push
```

Render avtomatik qayta deploy qiladi!

---

## 5. Custom Domain (ixtiyoriy)

Agar o'z domeningiz bo'lsa:

1. Render Dashboard → Settings → Custom Domains
2. "Add Custom Domain" bosing
3. Domeningizni kiriting (masalan: `hotdog.uz`)
4. DNS sozlamalarini yangilang (Render ko'rsatadi)

---

## 6. Bepul Tier Limitlari

Render.com bepul tier:
- ✅ 750 soat/oy (31 kun)
- ✅ Avtomatik HTTPS
- ✅ Cheksiz deploy
- ⚠️ 15 daqiqa faoliyatsizlikdan keyin uyqu rejimiga o'tadi
- ⚠️ Birinchi request sekin bo'lishi mumkin (cold start)

---

## 7. Muammolarni hal qilish

### Build muvaffaqiyatsiz bo'lsa:
```bash
# Local da test qiling
npm install
npm run build
npm start
```

### MongoDB ulanmasa:
- MongoDB Atlas → Network Access → `0.0.0.0/0`
- Connection string da parol to'g'riligini tekshiring

### Frontend ko'rinmasa:
- `NODE_ENV=production` o'rnatilganligini tekshiring
- Build command to'g'riligini tekshiring

---

## 8. Yangilanishlar deploy qilish

Kod o'zgartirsangiz:

```bash
git add .
git commit -m "Yangilanish tavsifi"
git push
```

Render avtomatik yangi versiyani deploy qiladi!

---

## Xulosa

✅ GitHub repository yarating
✅ Render.com ga kiring (GitHub bilan)
✅ Web Service yarating
✅ Environment variables qo'shing
✅ Deploy qiling
✅ Socket.io URL larni yangilang
✅ Test qiling!

**Sizning applikatsiya URL:**
`https://hotdog-shop.onrender.com`

Muvaffaqiyatli deploy! 🎉

# Hot Dog Shop - Tezkor Boshlash

## 1. Paketlarni o'rnatish

```bash
# D:\hotdog papkasida
npm install

# Client paketlari
cd client
npm install
cd ..
```

## 2. .env fayl yaratish

`.env` fayl yarating va quyidagilarni kiriting:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hotdog?retryWrites=true&w=majority
JWT_SECRET=my_super_secret_key_12345
IMGBB_API_KEY=your_imgbb_api_key_here
PORT=5000
```

### MongoDB Atlas sozlash:
1. https://www.mongodb.com/cloud/atlas ga kiring
2. "Create a Free Cluster" bosing
3. Database Access da user yarating
4. Network Access da "0.0.0.0/0" qo'shing
5. "Connect" > "Connect your application" dan connection string oling

### ImgBB API sozlash:
1. https://api.imgbb.com ga kiring
2. "Get API Key" dan API key oling

## 3. Ishga tushirish

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

## 4. Kirish ma'lumotlari

**Dastlabki Admin:**
- Username: `boshliq`
- Parol: `admin123`

## 5. Sahifalar

- http://localhost:3000 - Mijoz (buyurtma berish)
- http://localhost:3000/hodim - Hodim kirish
- http://localhost:3000/ekran - Ekran (Smart TV)
- http://localhost:3000/boshliq - Boshliq kirish

## 6. Birinchi qadamlar

1. Boshliq sifatida kiring
2. "Menu" tabiga o'ting
3. Bo'lim qo'shing (masalan, "Hot doglar")
4. Mahsulot qo'shing (rasm bilan)
5. Yangi hodim yarating
6. Mijoz sifatida buyurtma bering
7. Hodim sifatida QR skanerlang va tasdiqlang
8. Ekranda buyurtmani ko'ring

## Muammolar?

README.md faylida batafsil ma'lumot bor.

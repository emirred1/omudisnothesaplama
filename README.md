# OMÜ Diş Hekimliği Not Hesaplayıcı

✨ OMÜ Diş Hekimliği öğrencilerinin vize ve final notlarını, okulun resmi ağırlıklandırma katsayılarına göre hesaplayan modern ve kullanıcı dostu bir web uygulamasıdır. 

* Front-end kısmı bana aittir. Hesaplama tarafında AI'dan destek alınmıştır.

## 🛠️ Kullanılan Teknolojiler (Tech Stack)

Bu proje modern web teknolojileri ile performanslı ve şık olacak şekilde geliştirilmiştir:

- **Dil:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** [Vercel](https://vercel.com/) (GitHub entegrasyonu ile otomatik dağıtım)

## 📊 Google Analytics 4

1. [Google Analytics](https://analytics.google.com/) → **Yönetim** → Veri akışı (Web) → `omudisnot.space`
2. Ölçüm kimliğini kopyala (`G-XXXXXXXXXX`)
3. **Vercel** → Settings → Environment Variables → `NEXT_PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (Production)
4. `npm install` → commit → push (yeniden deploy)

Olaylar: **Raporlar → Etkileşim → Olaylar** (`select_donem`, `select_yariyil`, `toggle_theme`, `score_entered`, `clear_scores`). Not değerleri asla gönderilmez.

## 🚀 Kurulum ve Başlangıç

Yerel makinenizde projeyi ayağa kaldırmak için:

```bash
# Projeyi klonlayın veya indirin
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

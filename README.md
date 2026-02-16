# នរាស្ថាបនា (Narea Sthapana)

ប្រព័ន្ធគ្រប់គ្រងបច្ច័យ និងការកសាងក្នុងវត្តអារាម និងកម្មវិធីបុណ្យផ្សេងៗ។

## បច្ចេកវិទ្យា (Tech Stack)
- **Framework:** Nuxt 3 (Vue.js)
- **Vite:** ប្រើជា build tool លំនាំដើមរបស់ Nuxt 3
- **Styling:** Tailwind CSS + Shadcn-Vue inspired components
- **Backend:** Firebase (Firestore & Auth)
- **State:** Pinia

## ការកំណត់រចនាសម្ព័ន្ធ (Setup)

1. **ដំឡើង Dependencies:**
   ```bash
   npm install
   ```

2. **កំណត់បរិស្ថាន (Environment Variables):**
   ចំឡងកូដពី `.env.example` ទៅជា `.env` រួចបំពេញព័ត៌មាន Firebase របស់អ្នក៖
   ```bash
   cp .env.example .env
   ```

3. **ដំណើរការកម្មវិធីសម្រាប់អភិវឌ្ឍ (Development):**
   ```bash
   npm run dev
   ```

4. **បង្កើតកម្មវិធីសម្រាប់ដាក់ឱ្យប្រើប្រាស់ (Build/Generate):**
   ```bash
   npm run generate
   ```

## រចនាសម្ព័ន្ធ Folder
- `pages/`: ទំព័រនីមួយៗរបស់កម្មវិធី (File-based routing)
- `components/`: UI components ដែលអាចប្រើឡើងវិញបាន
- `composables/`: Logic សម្រាប់ទាញទិន្នន័យ (Firebase logic)
- `stores/`: ការគ្រប់គ្រង State (Auth state)
- `plugins/`: ការកំណត់ Firebase client
- `assets/css/`: Global styles និង Tailwind configuration

# នរាស្ថាបនា (Narea Sthapana)

ប្រព័ន្ធគ្រប់គ្រងបច្ច័យ និងការកសាងក្នុងវត្តអារាម និងកម្មវិធីបុណ្យផ្សេងៗ។

## បច្ចេកវិទ្យា (Tech Stack)
- **Framework:** Vue 3 + Vite (Single Page Application)
- **Routing:** Vue Router (HTML5 history mode)
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

4. **បង្កើតកម្មវិធីសម្រាប់ដាក់ឱ្យប្រើប្រាស់ (Build):**
   ```bash
   npm run build
   ```

5. **ដាក់ឱ្យប្រើប្រាស់លើ Vercel (Deployment to Vercel):**

   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables (Production):
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
     - `VITE_FIREBASE_MEASUREMENT_ID`

   Vercel នឹងប្រើ `vercel.json` ដើម្បីបញ្ជូន route ទាំងអស់ទៅ `index.html` ដើម្បីអោយ Vue Router គ្រប់គ្រង client-side routing។

## រចនាសម្ព័ន្ធ Folder
- `src/pages/`: ទំព័រនីមួយៗ (file-based routing តាម vite-plugin-pages)
- `src/layouts/`: Layouts សម្រាប់ page (vite-plugin-vue-layouts)
- `src/components/`: UI components ដែលអាចប្រើឡើងវិញបាន
- `src/composables/`: Logic សម្រាប់ទាញទិន្នន័យ និង business logic (Firebase logic)
- `src/stores/`: Pinia stores (Auth state និង state ផ្សេងៗ)
- `src/utils/`: Utilities (ឧ. Firebase init, date helpers)
- `src/assets/css/`: Global styles និង Tailwind configuration

# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional.spec.ts >> Functional Tests >> Navigasi ke modul Hemodinamik berfungsi dengan benar
- Location: tests/functional.spec.ts:31:7

# Error details

```
Error: locator.click: Error: strict mode violation: locator('nav').locator('text=Hemodinamik') resolved to 2 elements:
    1) <div class="absolute left-16 px-3 py-1.5 bg-[var(--bg-panel)] text-[var(--text-secondary)] text-[10px] font-bold uppercase tracking-widest rounded border border-[var(--border-light)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">Hemodinamik</div> aka getByRole('link', { name: 'Hemodinamik', description: 'Hemodinamik', exact: true })
    2) <span>Hemodinamik</span> aka getByRole('link', { name: 'Hemodinamik' }).nth(1)

Call log:
  - waiting for locator('nav').locator('text=Hemodinamik')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - link [ref=e3] [cursor=pointer]:
      - /url: /
      - img [ref=e4]
    - generic [ref=e7]:
      - link "Anatomi Struktural" [ref=e8] [cursor=pointer]:
        - /url: /anatomy
        - img [ref=e10]
        - generic: Anatomi Struktural
      - link "Hemodinamik" [ref=e12] [cursor=pointer]:
        - /url: /hemodynamic
        - img [ref=e14]
        - generic: Hemodinamik
      - link "Sistem Konduksi" [ref=e16] [cursor=pointer]:
        - /url: /conduction
        - img [ref=e18]
        - generic: Sistem Konduksi
      - link "Kasus Klinis" [ref=e20] [cursor=pointer]:
        - /url: /clinical-cases
        - img [ref=e22]
        - generic: Kasus Klinis
      - link "Sumber Daya" [ref=e26] [cursor=pointer]:
        - /url: /resources
        - img [ref=e28]
        - generic: Sumber Daya
    - button "Light Mode" [ref=e31]:
      - img [ref=e32]
      - generic: Light Mode
  - main [ref=e38]:
    - main [ref=e42]:
      - navigation:
        - generic [ref=e43]:
          - link "Anatomi Struktural +" [ref=e44] [cursor=pointer]:
            - /url: /anatomy
            - generic [ref=e45]: Anatomi Struktural
            - generic [ref=e46]: +
          - link "Hemodinamik" [ref=e47] [cursor=pointer]:
            - /url: /hemodynamic
            - generic [ref=e48]: Hemodinamik
        - generic [ref=e52]:
          - button "Hide Menu" [ref=e53]:
            - generic [ref=e54]: Hide Menu
          - generic [ref=e59]:
            - generic [ref=e60]: Status
            - generic [ref=e61]: Interactive Cardiology Platform
      - generic:
        - heading "Anatomi Jantung" [level=1]
      - generic:
        - paragraph [ref=e64]: Eksplorasi anatomi jantung . menampilkan jantung dengan visual 3D untuk membantu orang umum memahami struktur serta cara kerja jantung secara lebih mendalam dan interaktif.
        - generic:
          - generic [ref=e67]:
            - heading "Visualisasi 3D" [level=3] [ref=e68]
            - paragraph [ref=e69]: Pelajari setiap detail jantung dengan 3D model. Membantu Anda mengenali anatomi dan potensi kelainan klinis dengan jauh lebih mudah.
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e72]: 92%
              - paragraph [ref=e73]: Pengalaman Belajar yang Lebih Menyeluruh
              - generic [ref=e74]:
                - heading "Dr. Nafisa Tasnim, Sp.JP" [level=4] [ref=e75]
                - paragraph [ref=e76]: "\"Visualisasi yang tepat adalah kunci untuk memahami cara kerja jantung yang kompleks secara lebih sederhana.\""
            - img "Doctor" [ref=e78]
      - generic:
        - generic: Scroll down to explore
  - button "Open Next.js Dev Tools" [ref=e84] [cursor=pointer]:
    - img [ref=e85]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Functional Tests', () => {
  4  |   test('Halaman utama memuat Canvas 3D dan UI Header', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     
  7  |     // Header text
  8  |     await expect(page.locator('text=PULSE SYNC')).toBeVisible();
  9  |     
  10 |     // Canvas WebGL render container
  11 |     const canvas = page.locator('canvas').first();
  12 |     await expect(canvas).toBeVisible({ timeout: 10000 });
  13 |   });
  14 | 
  15 |   test('Toggle Sidebar menyembunyikan dan menampilkan sidebar global', async ({ page }) => {
  16 |     await page.goto('/');
  17 |     
  18 |     // Tombol Hide Menu
  19 |     const toggleBtn = page.getByRole('button', { name: /Hide Menu|Show Menu/i }).first();
  20 |     await expect(toggleBtn).toBeVisible();
  21 |     
  22 |     // Klik untuk sembunyi
  23 |     await toggleBtn.click();
  24 |     await expect(page.getByRole('button', { name: /Show Menu/i }).first()).toBeVisible();
  25 |     
  26 |     // Klik untuk memunculkan kembali
  27 |     await toggleBtn.click();
  28 |     await expect(page.getByRole('button', { name: /Hide Menu/i }).first()).toBeVisible();
  29 |   });
  30 | 
  31 |   test('Navigasi ke modul Hemodinamik berfungsi dengan benar', async ({ page }) => {
  32 |     await page.goto('/');
  33 |     
  34 |     // Klik link Hemodinamik di header
  35 |     const hemoLink = page.locator('nav').locator('text=Hemodinamik');
> 36 |     await hemoLink.click();
     |                    ^ Error: locator.click: Error: strict mode violation: locator('nav').locator('text=Hemodinamik') resolved to 2 elements:
  37 |     
  38 |     // Pastikan URL berubah
  39 |     await expect(page).toHaveURL(/.*hemodynamic/);
  40 |     
  41 |     // Pastikan judul halaman modul Hemodinamik muncul
  42 |     await expect(page.locator('text=Sistem Hemodinamik')).toBeVisible();
  43 |   });
  44 | });
  45 | 
```
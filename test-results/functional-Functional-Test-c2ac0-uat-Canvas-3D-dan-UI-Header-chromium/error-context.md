# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional.spec.ts >> Functional Tests >> Halaman utama memuat Canvas 3D dan UI Header
- Location: tests/functional.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=PULSE SYNC')
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=PULSE SYNC')
    12 × locator resolved to <div class="text-xl font-bold tracking-[0.3em] text-[var(--text-primary)] pointer-events-auto opacity-0 invisible">PULSE SYNC</div>
       - unexpected value "hidden"

```

```yaml
- navigation:
  - link:
    - /url: /
  - link "Anatomi Struktural":
    - /url: /anatomy
  - link "Hemodinamik":
    - /url: /hemodynamic
  - link "Sistem Konduksi":
    - /url: /conduction
  - link "Kasus Klinis":
    - /url: /clinical-cases
  - link "Sumber Daya":
    - /url: /resources
  - button "Light Mode"
- main:
  - main:
    - navigation:
      - link "Anatomi Struktural +":
        - /url: /anatomy
      - link "Hemodinamik":
        - /url: /hemodynamic
      - button "Hide Menu"
      - text: Status Interactive Cardiology Platform
    - heading "Anatomi Jantung" [level=1]
    - paragraph: Eksplorasi anatomi jantung . menampilkan jantung dengan visual 3D untuk membantu orang umum memahami struktur serta cara kerja jantung secara lebih mendalam dan interaktif.
    - heading "Visualisasi 3D" [level=3]
    - paragraph: Pelajari setiap detail jantung dengan 3D model. Membantu Anda mengenali anatomi dan potensi kelainan klinis dengan jauh lebih mudah.
    - text: 92%
    - paragraph: Pengalaman Belajar yang Lebih Menyeluruh
    - heading "Dr. Nafisa Tasnim, Sp.JP" [level=4]
    - paragraph: "\"Visualisasi yang tepat adalah kunci untuk memahami cara kerja jantung yang kompleks secara lebih sederhana.\""
    - img "Doctor"
    - text: Scroll down to explore
- alert
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
> 8  |     await expect(page.locator('text=PULSE SYNC')).toBeVisible();
     |                                                   ^ Error: expect(locator).toBeVisible() failed
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
  36 |     await hemoLink.click();
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
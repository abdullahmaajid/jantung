import { test, expect } from '@playwright/test';

test.describe('UX Experience Tests', () => {
  test('Layar "Memuat Aset Medis" menghilang secara otomatis dan tidak memblokir UI', async ({ page }) => {
    await page.goto('/');
    
    // Teks dari SceneLoader
    const loaderText = page.locator('text=Memuat Aset Medis');
    
    // Mungkin muncul sesaat
    if (await loaderText.isVisible()) {
      // Tunggu Safety Timer bekerja (maks 2.5 - 3 detik)
      await expect(loaderText).toBeHidden({ timeout: 5000 });
    } else {
      // Jika langsung tersembunyi karena caching, kita expect tersembunyi
      await expect(loaderText).toBeHidden();
    }
    
    // Pastikan UI utama di belakangnya bisa diklik
    const toggleBtn = page.getByRole('button', { name: /Hide Menu|Show Menu/i }).first();
    await expect(toggleBtn).toBeEnabled();
  });

  test('Mengeksplorasi Jantung memuat font dan elemen UI tanpa terputus', async ({ page }) => {
    await page.goto('/');
    
    // Cek teks tipografi UX
    await expect(page.locator('text=Eksplorasi anatomi jantung')).toBeVisible();
    await expect(page.locator('text=Visualisasi 3D')).toBeVisible();
    await expect(page.locator('text=Dr. Nafisa Tasnim, Sp.JP')).toBeVisible();
  });
  
  test('Aksi scroll otomatis (Scroll Hint) berpindah rute dengan benar', async ({ page }) => {
    await page.goto('/');
    
    // Cek keberadaan tooltip interaktif
    await expect(page.locator('text=Scroll down to explore')).toBeVisible();
    
    // Simulasikan scroll mouse ke bawah (wheel event)
    await page.mouse.wheel(0, 100);
    
    // Berdasarkan page.tsx, script akan menangkap deltaY > 50 dan push router ke "/anatomy"
    await expect(page).toHaveURL(/.*anatomy/, { timeout: 3000 });
  });
});

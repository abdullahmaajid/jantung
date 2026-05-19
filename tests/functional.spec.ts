import { test, expect } from '@playwright/test';

test.describe('Functional Tests', () => {
  test('Halaman utama memuat Canvas 3D dan UI Header', async ({ page }) => {
    await page.goto('/');
    
    // Header text
    await expect(page.locator('text=PULSE SYNC')).toBeVisible();
    
    // Canvas WebGL render container
    const canvas = page.locator('canvas').first();
    await expect(canvas).toBeVisible({ timeout: 10000 });
  });

  test('Toggle Sidebar menyembunyikan dan menampilkan sidebar global', async ({ page }) => {
    await page.goto('/');
    
    // Tombol Hide Menu
    const toggleBtn = page.getByRole('button', { name: /Hide Menu|Show Menu/i }).first();
    await expect(toggleBtn).toBeVisible();
    
    // Klik untuk sembunyi
    await toggleBtn.click();
    await expect(page.getByRole('button', { name: /Show Menu/i }).first()).toBeVisible();
    
    // Klik untuk memunculkan kembali
    await toggleBtn.click();
    await expect(page.getByRole('button', { name: /Hide Menu/i }).first()).toBeVisible();
  });

  test('Navigasi ke modul Hemodinamik berfungsi dengan benar', async ({ page }) => {
    await page.goto('/');
    
    // Klik link Hemodinamik di header
    const hemoLink = page.locator('nav').locator('text=Hemodinamik');
    await hemoLink.click();
    
    // Pastikan URL berubah
    await expect(page).toHaveURL(/.*hemodynamic/);
    
    // Pastikan judul halaman modul Hemodinamik muncul
    await expect(page.locator('text=Sistem Hemodinamik')).toBeVisible();
  });
});

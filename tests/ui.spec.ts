import { test, expect } from '@playwright/test';

test.describe('UI Aesthetics Tests', () => {
  test('Tema default adalah Dark Mode', async ({ page }) => {
    await page.goto('/');
    
    // Pastikan body tidak memiliki class theme-light secara default
    const body = page.locator('body');
    await expect(body).not.toHaveClass(/theme-light/);
  });

  test('Gaya Brutalism (Sudut Tajam) diterapkan secara global pada komponen Card', async ({ page }) => {
    await page.goto('/');
    
    // Ambil salah satu elemen UI glass-ui-dark
    const uiCard = page.locator('.glass-ui-dark').first();
    await expect(uiCard).toBeVisible();
    
    // Menggunakan getComputedStyle untuk memastikan tidak ada border-radius
    const borderRadius = await uiCard.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('border-radius');
    });
    
    // Karena kita memaksa border-radius: 0 !important
    expect(borderRadius).toBe('0px');
  });

  test('Tulisan Utama (PULSE SYNC) tidak memiliki warna hardcoded standar', async ({ page }) => {
    await page.goto('/');
    
    const pulseText = page.locator('text=PULSE SYNC').first();
    const color = await pulseText.evaluate((el) => {
      return window.getComputedStyle(el).color;
    });
    
    // Memastikan color diambil dari var(--text-primary) yang diatur di CSS, bukan hitam atau putih absolut standar
    expect(color).not.toBe('rgb(0, 0, 0)');
    expect(color).not.toBe('rgb(255, 255, 255)');
  });
});

// TypeScript
import { Injectable } from '@angular/core';

export type AppTheme =
  | 'light'
  | 'dark'
  | 'cupcake'
  | 'corporate'
  | 'emerald'
  | 'dracula'
  | 'night'
  | 'winter';
const STORAGE_KEY = 'app-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private current: AppTheme = 'light';

  constructor() {
    const saved = (localStorage.getItem(STORAGE_KEY) as AppTheme) || this.systemPreferred();
    this.setTheme('winter');
  }

  getTheme(): AppTheme {
    return this.current;
  }

  setTheme(theme: AppTheme) {
    this.current = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }

  toggleLightDark() {
    this.setTheme(this.current === 'dark' ? 'light' : 'dark');
  }

  private systemPreferred(): AppTheme {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  
}

export const APP_THEMES: AppTheme[] = ['light','dark','cupcake','corporate','emerald','dracula','night','winter'];

export function isAppTheme(x: unknown): x is AppTheme {
  return typeof x === 'string' && (APP_THEMES as readonly string[]).includes(x);
}

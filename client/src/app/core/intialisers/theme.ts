// TypeScript
import { APP_INITIALIZER, Provider } from '@angular/core';
import { ThemeService } from '../services/theme-service.service';


export function initTheme(theme: ThemeService) {
    
  return () => {
console.log('Theme initialized');
theme.getTheme();
  } // constructor already applies theme
  
}

export const THEME_INIT_PROVIDER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  deps: [ThemeService],
  useFactory: initTheme,
};

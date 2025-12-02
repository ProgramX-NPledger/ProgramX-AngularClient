import {computed, signal} from '@angular/core';

export class SignalMap {
  private dataMap = signal(new Map<string, any>());

  getItem(key: string) : any {
    return computed(() => this.dataMap().get(key));
  }

  allItems() {
    return computed(() => this.dataMap().values());
  }
  addOrUpdateItem(key: string, value: any) {
    // IMPORTANT: Create new Map instance for signal reactivity
    const newMap = new Map(this.dataMap());
    newMap.set(key, value);
    this.dataMap.set(newMap);
  }
  removeItem(key: string) {
    const newMap = new Map(this.dataMap());
    newMap.delete(key);
    this.dataMap.set(newMap);
  }

  clearAll() {
    this.dataMap.set(new Map());
  }


}

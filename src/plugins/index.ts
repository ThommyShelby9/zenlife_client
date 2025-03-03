/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Pinia } from "pinia";
import type { App } from "vue";
import type { Router, RouteRecordRaw } from "vue-router";

// src/plugins/index.ts
export interface ZenLifePlugin {
  name: string;
  routes?: Array<RouteRecordRaw>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stores?: Record<string, () => any>;
  install: (app: App) => void;
}

const plugins: ZenLifePlugin[] = [];

export function registerPlugin(plugin: ZenLifePlugin) {
  plugins.push(plugin);
}

export function initializePlugins(app: App, router: Router, pinia: Pinia) {
  for (const plugin of plugins) {
    // Add routes
    if (plugin.routes) {
      plugin.routes.forEach(route => router.addRoute(route));
    }

    // Register stores
    if (plugin.stores) {
      Object.entries(plugin.stores).forEach(([name, useStore]) => {
        // Custom logic to register a store dynamically
      });
    }

    // Call plugin's install method
    plugin.install(app);
  }
}

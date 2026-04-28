import { createPinia } from "pinia";
import type { Pinia } from "pinia";

/**
 * Pinia partilhada ao nível da shell (single-spa): vários MFEs montam a mesma
 * instância para estado comum (sessão, preferências globais, etc.).
 */
let shellPinia: Pinia | undefined;

export function getSharedPinia(): Pinia {
  shellPinia ??= createPinia();
  return shellPinia;
}

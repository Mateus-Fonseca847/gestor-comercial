import { moduleNavigation } from "@/config/module-navigation";

export const navigationItems = moduleNavigation.map((item) => ({
  label: item.label,
  href: item.href,
  behavior: item.behavior,
  priority: item.priority ?? "secondary",
}));

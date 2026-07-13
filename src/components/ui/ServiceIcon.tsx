import { AlertTriangle, Building2, Filter, Flame, Search, Wrench, type LucideProps } from "lucide-react";

const ICONS = {
  "alert-triangle": AlertTriangle,
  filter: Filter,
  search: Search,
  flame: Flame,
  wrench: Wrench,
  "building-2": Building2,
} as const;

export type ServiceIconName = keyof typeof ICONS;

type Props = LucideProps & { name: ServiceIconName };

export default function ServiceIcon({ name, ...props }: Props) {
  const Icon = ICONS[name];
  return <Icon {...props} />;
}

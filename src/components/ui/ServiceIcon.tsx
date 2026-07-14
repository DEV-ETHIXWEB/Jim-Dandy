import { AlertTriangle, Building2, Filter, Flame, MoreHorizontal, Search, Wrench, type LucideProps } from "lucide-react";

const ICONS = {
  "alert-triangle": AlertTriangle,
  filter: Filter,
  search: Search,
  flame: Flame,
  wrench: Wrench,
  "building-2": Building2,
  "more-horizontal": MoreHorizontal,
} as const;

export type ServiceIconName = keyof typeof ICONS;

type Props = LucideProps & { name: ServiceIconName };

export default function ServiceIcon({ name, ...props }: Props) {
  const Icon = ICONS[name];
  return <Icon {...props} />;
}

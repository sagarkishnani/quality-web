import client from "../../../tina/__generated__/client";
import { mediaUrl } from "../../utils/mediaUrl";
import type { ServiceSummary } from "../../components/ui/ServiceCard";

export interface ServiceEntry extends ServiceSummary {
  slug: string;
  shortName: string;
  showOnHome: boolean;
  relativePath: string;
}

let cache: Promise<ServiceEntry[]> | null = null;

async function fetchServices(): Promise<ServiceEntry[]> {
  const result = await client.queries.serviceConnection({ first: 100 });
  const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
  return (result.data.serviceConnection.edges ?? [])
    .map((edge) => edge?.node)
    .filter((node): node is NonNullable<typeof node> => Boolean(node))
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
    .map((node) => ({
      slug: node._sys.filename,
      relativePath: node._sys.relativePath,
      name: node.name,
      shortName: node.shortName || node.name,
      summary: node.summary ?? "",
      image: mediaUrl(node.image),
      href: `${base}servicios/${node._sys.filename}`,
      showOnHome: Boolean(node.showOnHome),
    }));
}

export function loadServices(): Promise<ServiceEntry[]> {
  cache ??= fetchServices();
  return cache;
}

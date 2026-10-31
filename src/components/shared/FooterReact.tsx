import { useTina, tinaField } from "tinacms/dist/react";
import {
  FaLinkedinIn, FaInstagram, FaFacebookF, FaXTwitter, FaYoutube, FaTiktok, FaWhatsapp,
} from "react-icons/fa6";
import type { IconType } from "react-icons";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import type { Locale } from "../../i18n/config";

const SOCIAL_ICONS: Record<string, IconType> = {
  linkedin: FaLinkedinIn,
  instagram: FaInstagram,
  facebook: FaFacebookF,
  x: FaXTwitter,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  whatsapp: FaWhatsapp,
};

interface Props {
  query: string;
  variables: object;
  data: any;
  locale: Locale;
}

const columnTitle = "text-caption-sm font-semibold uppercase tracking-[0.14em] text-content";
const footerLink = "text-body-sm text-content-muted transition-colors hover:text-content";

export default function FooterReact({ query, variables, data: initialData, locale }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const global = data?.global;
  const footer = global?.footer;
  const contact = global?.contact;
  const nav = global?.nav;
  const columns = (footer?.columns || []).filter(Boolean);
  const social = (footer?.social || []).filter((s: any) => s?.url && SOCIAL_ICONS[s.network]);

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-xl pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            {nav?.logo && (
              <img src={mediaUrl(nav.logo)} alt={nav?.logoAlt || "Quality Sumprint"} width="180" height="32" className="h-8 w-auto" loading="lazy" />
            )}
            {footer?.tagline && (
              <p className="mt-5 max-w-xs text-body-sm text-content-muted" data-tina-field={tinaField(footer, "tagline")}>
                {tField(footer, "tagline", locale)}
              </p>
            )}
          </div>

          {columns.map((column: any, index: number) => (
            <div key={index}>
              <p className={columnTitle} data-tina-field={tinaField(column, "title")}>
                {tField(column, "title", locale)}
              </p>
              <ul className="mt-5 space-y-3">
                {(column.links || []).filter(Boolean).map((link: any, linkIndex: number) => (
                  <li key={linkIndex}>
                    <a href={localizeHref(link.url, locale)} className={footerLink}>
                      {tField(link, "label", locale)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {contact && (
            <div>
              <p className={columnTitle}>Contacto</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={localizeHref("/contacto", locale)} className={footerLink}>Contáctanos</a>
                </li>
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className={`${footerLink} break-all`} data-tina-field={tinaField(contact, "email")}>
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li>
                    <a
                      href={contact.mapsUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLink}
                      data-tina-field={tinaField(contact, "address")}
                    >
                      {contact.address}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-14 flex flex-col gap-6 border-t border-line pt-7 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-3">
            {social.map((item: any, index: number) => {
              const Icon = SOCIAL_ICONS[item.network];
              return (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.network}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-content-subtle text-white transition-colors hover:bg-ink"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 text-caption-sm text-content-subtle md:flex-row md:gap-7">
            {footer?.legal && <p data-tina-field={tinaField(footer, "legal")}>{tField(footer, "legal", locale)}</p>}
            {footer?.creditLabel && (
              <a href={footer.creditUrl || "#"} target="_blank" rel="noopener" className="hover:text-content" data-tina-field={tinaField(footer, "creditLabel")}>
                {footer.creditLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

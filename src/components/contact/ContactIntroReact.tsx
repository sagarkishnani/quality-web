import { useTina, tinaField } from "tinacms/dist/react";
import { FaArrowRight } from "react-icons/fa6";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

interface ContactDetails {
  email?: string | null;
  phone?: string | null;
  phoneHref?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
}

function ContactCard({ label, value, href, external }: { label?: string | null; value?: string | null; href: string; external?: boolean }) {
  if (!value) return null;
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between gap-6 rounded-2xl bg-surface-raised/80 px-6 py-5 transition-colors hover:bg-surface-raised"
    >
      <span>
        <span className="block text-body-sm font-semibold">{label}</span>
        <span className="mt-1 block text-body-lg">{value}</span>
      </span>
      <FaArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" aria-hidden />
    </a>
  );
}

export default function ContactIntroReact(props: TinaProps & { contact: ContactDetails }) {
  const page = useTina({ query: props.query, variables: props.variables, data: props.data }).data?.contactPage;
  const { contact } = props;
  if (!page) return <div hidden />;

  return (
    <div>
      <h1 className="text-heading-lg" data-tina-field={tinaField(page, "title")}>
        {page.title}
      </h1>
      <p className="mt-6 text-subtitle-sm font-normal text-content-muted">
        <span data-tina-field={tinaField(page, "question")}>{page.question}</span>
        <br />
        <strong className="font-semibold text-content" data-tina-field={tinaField(page, "highlight")}>
          {page.highlight}
        </strong>{" "}
        <span data-tina-field={tinaField(page, "highlightSuffix")}>{page.highlightSuffix}</span>
      </p>
      <div className="mt-10 max-w-lg space-y-3">
        <ContactCard label={page.emailLabel} value={contact.email} href={`mailto:${contact.email}`} />
        <ContactCard label={page.phoneLabel} value={contact.phone} href={`tel:${contact.phoneHref || contact.phone}`} />
        <ContactCard label={page.addressLabel} value={contact.address} href={contact.mapsUrl || "#"} external />
      </div>
    </div>
  );
}

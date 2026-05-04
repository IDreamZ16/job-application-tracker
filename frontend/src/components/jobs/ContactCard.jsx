import { Mail, Phone, Link2, Pencil, Trash2, User } from "lucide-react";

const ContactCard = ({ contact, onEdit, onDelete }) => (
  <div className="card p-5 hover:border-base-500 transition-all duration-150 group">
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3 min-w-0 flex-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 shrink-0">
          <User size={15} className="text-amber-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-100 break-words">
            {contact.name}
          </p>
          {contact.role && (
            <p className="text-xs text-slate-400 mt-0.5 break-words">
              {contact.role}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-within:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(contact)}
          className="text-slate-500 hover:text-amber-400 hover:bg-amber-400/10 p-1.5 rounded-md transition-colors"
          aria-label={`Edit ${contact.name}`}
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onDelete(contact)}
          className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-md transition-colors"
          aria-label={`Delete ${contact.name}`}
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>

    {(contact.email || contact.phone || contact.linkedin_url) && (
      <div className="mt-4 pt-4 border-t border-base-600 space-y-2">
        {contact.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors break-all"
          >
            <Mail size={12} className="shrink-0" />
            {contact.email}
          </a>
        )}
        {contact.phone && (
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors"
          >
            <Phone size={12} className="shrink-0" />
            {contact.phone}
          </a>
        )}
        {contact.linkedin_url && (
          <a
            href={contact.linkedin_url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors break-all"
          >
            <Link2 size={12} className="shrink-0" />
            LinkedIn
          </a>
        )}
      </div>
    )}

    {contact.notes && (
      <p className="text-xs text-slate-400 italic mt-3 leading-relaxed whitespace-pre-wrap">
        {contact.notes}
      </p>
    )}
  </div>
);

export default ContactCard;

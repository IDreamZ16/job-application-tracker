import { useState, useEffect } from "react";
import Modal from "../shared/Modal";
import { createContact, updateContact } from "../../services/contactsService";
import { useQueryClient } from "@tanstack/react-query";

const EMPTY = {
  name: "",
  role: "",
  email: "",
  phone: "",
  linkedin_url: "",
  notes: "",
};

const contactToForm = (contact) => ({
  name: contact.name ?? "",
  role: contact.role ?? "",
  email: contact.email ?? "",
  phone: contact.phone ?? "",
  linkedin_url: contact.linkedin_url ?? "",
  notes: contact.notes ?? "",
});

const ContactFormModal = ({ isOpen, onClose, jobId, contact = null }) => {
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const isEdit = Boolean(contact);

  useEffect(() => {
    if (isOpen) {
      setForm(contact ? contactToForm(contact) : EMPTY);
      setError("");
    }
  }, [isOpen, contact]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        role: form.role || null,
        email: form.email || null,
        phone: form.phone || null,
        linkedin_url: form.linkedin_url || null,
        notes: form.notes || null,
      };

      if (isEdit) {
        await updateContact(jobId, contact.id, payload);
      } else {
        await createContact(jobId, payload);
      }

      await queryClient.invalidateQueries({ queryKey: ["contacts", jobId] });
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `Failed to ${isEdit ? "update" : "add"} contact`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit Contact" : "Add Contact"}
      size="md"
    >
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2.5 mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            Name <span className="text-amber-400">*</span>
          </label>
          <input
            className="input"
            placeholder="Jane Doe"
            value={form.name}
            onChange={set("name")}
            required
          />
        </div>

        <div>
          <label className="label">Role</label>
          <input
            className="input"
            placeholder="Recruiter, Engineering Manager, etc."
            value={form.role}
            onChange={set("role")}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="jane@company.com"
              value={form.email}
              onChange={set("email")}
            />
          </div>
          <div>
            <label className="label">Phone</label>
            <input
              className="input"
              type="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={set("phone")}
            />
          </div>
        </div>

        <div>
          <label className="label">LinkedIn URL</label>
          <input
            className="input"
            placeholder="https://linkedin.com/in/..."
            value={form.linkedin_url}
            onChange={set("linkedin_url")}
          />
        </div>

        <div>
          <label className="label">Notes</label>
          <textarea
            className="input resize-none h-20"
            placeholder="How you met, conversation highlights, follow-up reminders..."
            value={form.notes}
            onChange={set("notes")}
          />
        </div>

        <p className="text-xs text-slate-500 pt-2">
          Fields marked with <span className="text-amber-400">*</span> are
          required
        </p>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            {loading
              ? isEdit
                ? "Saving..."
                : "Adding..."
              : isEdit
                ? "Save Changes"
                : "Add Contact"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ContactFormModal;

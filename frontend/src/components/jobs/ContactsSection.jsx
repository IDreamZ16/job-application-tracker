import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Users, AlertTriangle, Loader2 } from "lucide-react";
import { getContacts, deleteContact } from "../../services/contactsService";
import Modal from "../shared/Modal";
import LoadingSpinner from "../shared/LoadingSpinner";
import ContactCard from "./ContactCard";
import ContactFormModal from "./ContactFormModal";

const ContactsSection = ({ jobId }) => {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [contactToDelete, setContactToDelete] = useState(null);

  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts", jobId],
    queryFn: () => getContacts(jobId),
  });

  const deleteMutation = useMutation({
    mutationFn: (contactId) => deleteContact(jobId, contactId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts", jobId] });
      setContactToDelete(null);
    },
  });

  const openAdd = () => {
    setEditingContact(null);
    setFormOpen(true);
  };

  const openEdit = (contact) => {
    setEditingContact(contact);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingContact(null);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Users size={16} className="text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-200">
              Contacts
            </h2>
            <p className="text-xs text-slate-500">
              {contacts.length === 0
                ? "No contacts yet"
                : `${contacts.length} ${contacts.length === 1 ? "person" : "people"}`}
            </p>
          </div>
        </div>
        <button
          onClick={openAdd}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <Plus size={15} />
          Add Contact
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <LoadingSpinner size="md" />
        </div>
      ) : contacts.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-base-600 bg-base-800/40 p-8 text-center">
          <p className="text-sm text-slate-400">
            Track recruiters, hiring managers, and referrals you've talked to.
          </p>
          <button
            onClick={openAdd}
            className="text-sm text-amber-400 hover:text-amber-300 mt-2 transition-colors"
          >
            Add your first contact →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {contacts.map((contact) => (
            <ContactCard
              key={contact.id}
              contact={contact}
              onEdit={openEdit}
              onDelete={setContactToDelete}
            />
          ))}
        </div>
      )}

      <ContactFormModal
        isOpen={formOpen}
        onClose={closeForm}
        jobId={jobId}
        contact={editingContact}
      />

      <Modal
        isOpen={Boolean(contactToDelete)}
        onClose={() => {
          if (!deleteMutation.isPending) setContactToDelete(null);
        }}
        title="Delete this contact?"
        size="sm"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-400/10 border border-red-400/20 mb-4">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <p className="text-sm text-slate-400">
          You're about to remove{" "}
          <span className="text-slate-200">{contactToDelete?.name}</span> from
          this job's contacts. This can't be undone.
        </p>

        {deleteMutation.error && (
          <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
            {deleteMutation.error.response?.data?.error ||
              "Failed to delete. Please try again."}
          </p>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setContactToDelete(null)}
            disabled={deleteMutation.isPending}
            className="btn-ghost disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteMutation.mutate(contactToDelete.id)}
            disabled={deleteMutation.isPending}
            className="bg-red-500 hover:bg-red-400 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200 inline-flex items-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteMutation.isPending && (
              <Loader2 size={14} className="animate-spin" />
            )}
            {deleteMutation.isPending ? "Deleting..." : "Delete contact"}
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default ContactsSection;

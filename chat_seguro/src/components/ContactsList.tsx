import React from "react";
import type { Contact } from "../models/types";

interface ContactsListProps {
  contacts: Contact[];
  currentUser: string;
  onContactSelect: (contact: Contact) => void;
  selectedContact: Contact | null;
}
const ContactsList: React.FC<ContactsListProps> = ({
  contacts,
  currentUser,
  onContactSelect,
  selectedContact,
}) => {
  if (contacts.length === 0) {
    return (
      <div className="contacts-list">
        <h3>Contatos</h3>
        <div className="no-contacts">Nenhum contato disponível</div>
      </div>
    );
  }

  return (
    <div className="contacts-list">
      <h3>Contatos ({contacts.length})</h3>
      <div className="contacts">
        {contacts
          .filter((contact) => contact.email !== currentUser) // Remove o usuário atual
          .map((contact) => (
            <div
              key={contact.email}
              className={`contact ${
                selectedContact?.email === contact.email ? "selected" : ""
              }`}
              onClick={() => onContactSelect(contact)}
            >
              <div className="contact-name">{contact.nome}</div>
              <div className="contact-email">{contact.email}</div>
              <div className="contact-course">{contact.curso}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ContactsList;

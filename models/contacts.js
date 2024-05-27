const { nanoid } = require("nanoid");
const fs = require("fs/promises");
const path = require("path");

const generateUniqueId = () => nanoid(5);

const contactsFilePath = path.join(__dirname, "contacts.json");

async function listContacts() {
    const unparsedContacts = await fs.readFile(contactsFilePath, "utf8");
    const contacts = JSON.parse(unparsedContacts);
    return contacts;
}

async function getContactById(contactId) {
    const unparsedContacts = await fs.readFile(contactsFilePath, "utf8");
    const contacts = JSON.parse(unparsedContacts);
    const contactById = contacts.find(({ id }) => id === contactId);
    if (!contactById) throw new Error("User not found");
    return contactById;
}

async function addContact(body) {
    const newContact = { id: generateUniqueId(), ...body };
    const unparsedContacts = await fs.readFile(contactsFilePath, "utf8");
    const contacts = JSON.parse(unparsedContacts);
    const updatedContacts = [newContact, ...contacts];
    const unparsedUpdatedContacts = JSON.stringify(updatedContacts, "/t");
    await fs.writeFile(contactsFilePath, unparsedUpdatedContacts);
    return newContact;
}

async function removeContact(contactId) {
    const unparsedContacts = await fs.readFile(contactsFilePath, "utf8");
    const contacts = JSON.parse(unparsedContacts);
    const updatedContacts = contacts.filter(({ id }) => id !== contactId);
    if (updatedContacts.length === contacts.length)
        throw new Error("User not found");
    const unparsedUpdatedContacts = JSON.stringify(updatedContacts, "/t");
    await fs.writeFile(contactsFilePath, unparsedUpdatedContacts);
    return updatedContacts;
}

async function updateContact(contactId, body) {
    const unparsedContacts = await fs.readFile(contactsFilePath, "utf8");
    const contacts = JSON.parse(unparsedContacts);
    const contactToUpdate = contacts.find(({ id }) => id === contactId);
    if (!contactToUpdate) throw new Error("User not found");
    const updatedContact = { ...contactToUpdate, ...body };
    const contactsToUpdate = contacts.filter(({ id }) => id !== contactId);
    const updatedContacts = [...contactsToUpdate, updatedContact];
    const unparsedUpdatedContacts = JSON.stringify(updatedContacts, "/t");
    await fs.writeFile(contactsFilePath, unparsedUpdatedContacts);
    return updatedContact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
};

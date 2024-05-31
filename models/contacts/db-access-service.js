const mongoose = require("mongoose");
const Contact = require("./db-contacts-schema");

async function listContacts() {
    return Contact.find();
}

async function getContactById(contactId) {
    if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
    return Contact.findById(contactId);
}

async function addContact(newContactObj) {
    return Contact.create(newContactObj);
}

async function updateContact(contactId, newDataObj) {
    if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
    return Contact.findByIdAndUpdate(contactId, newDataObj, {
        new: true,
        runValidators: true,
    });
}

async function removeContact(contactId) {
    if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
    return Contact.findByIdAndRemove(contactId);
}

async function updateStatusContact(contactId, newDataObj) {
    if (!mongoose.Types.ObjectId.isValid(contactId)) return null;
    return Contact.findByIdAndUpdate(contactId, newDataObj, {
        new: true,
        runValidators: true,
    });
}

module.exports = {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
    updateStatusContact,
};

const { HttpError } = require("../helpers/http-error-builder");
const { ctrlWrapper } = require("../helpers/controller-error-catcher");
const { Contact } = require("../models/mongo-contact-schema");

async function getAll(req, res) {
    const { _id: owner } = req.user;
    const { page = 1, limit = 10, favorite } = req.query;

    const searchParams = { owner };
    if (favorite) searchParams.favorite = favorite;

    const total = await Contact.countDocuments(searchParams);
    if (!total) throw new HttpError(404, "Requested contacts not found");

    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const userContacts = await Contact.find(
        searchParams,
        "-createdAt -updatedAt",
        {
            skip,
            limit,
        }
    ).populate("owner", "name email");

    const resData = {
        data: userContacts,
        page,
        limit,
        total,
        pages,
    };
    res.status(200).json(resData);
}

async function getById(req, res) {
    const contactById = await Contact.findOne({
        owner: req.user._id,
        _id: req.params.id,
    });
    if (!contactById) throw new HttpError(404, "Contact not found");

    return res.status(200).json(contactById);
}

async function add(req, res) {
    const contact = await Contact.create({ ...req.body, owner: req.user._id });
    res.status(201).json(contact);
}

async function updateById(req, res) {
    const updatedContact = await Contact.findOneAndUpdate(
        {
            owner: req.user._id,
            _id: req.params.id,
        },
        { ...req.body },
        {
            new: true,
        }
    );
    if (!updatedContact) throw new HttpError(404, "Contact not found");

    return res.status(200).json(updatedContact);
}

async function updateFavorite(req, res) {
    const updatedContact = await Contact.findOneAndUpdate(
        {
            owner: req.user._id,
            _id: req.params.id,
        },
        { ...req.body },
        {
            new: true,
        }
    );
    if (!updatedContact) throw new HttpError(404, "Contact not found");

    return res.status(200).json(updatedContact);
}

async function deleteById(req, res) {
    const contact = await Contact.findOneAndDelete({
        owner: req.user._id,
        _id: req.params.id,
    });

    if (!contact) throw new HttpError(404, "Contact to delete not found");

    return res.status(204);
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    updateFavorite: ctrlWrapper(updateFavorite),
    deleteById: ctrlWrapper(deleteById),
};

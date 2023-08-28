import mongoose from 'mongoose';
import Property from '../mongodb/models/property.js';
import User from '../mongodb/models/user.js';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


const getAllProperty = async (req, res) => {
    const { _end, _order, _start, _sort, title_like = "", propertyType = "" } = req.query;
    try {

        const query = {};
        if (propertyType !== "") {
            query.propertyType = propertyType;
        }

        if (title_like) {
            query.title = { $regex: title_like, $options: "i" };
        }
        const countDocuments = await Property.countDocuments({ query });

        const property = await Property.find(query).limit(_end).skip(_start).sort({ [_sort]: _order });
        res.header('x-total-count', countDocuments);
        res.header('Access-Control-Expose-Headers', 'x-total-count');

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({ message: error })
    }
};

const getPropertyDetail = async (req, res) => {
    const { id } = req.params;

    try {
        const property = await Property.findOne({ _id: id }).populate("creator");

        if (property) {
            res.status(200).json(property);
        }
        else {
            res.status(200).json({ messgae: 'No Property found' });
        }

    } catch (error) {
        res.status(500).json({ message: error });
    }
};

const createProperty = async (req, res) => {
    try {

        const { title, description, propertyType, location, price, photo, email } = req.body;

        //Start a new Session

        const session = await mongoose.startSession(); // We take property as an transaction either create or not creation
        session.startTransaction();

        const user = await User.findOne({ email }).session(session);

        if (!user) throw new Error('User not found');

        const photoUrl = await cloudinary.uploader.upload(photo);

        const newProperty = await Property.create({
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url,
            creator: user._id
        });
        user.allProperties.push(newProperty._id);

        await user.save({ session });
        await session.commitTransaction();

        res.status(200).json({ message: 'Property Created Successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, propertyType, location, price, photo } = req.body;

        const photoUrl = await cloudinary.uploader.upload(photo);

        await Property.findByIdAndUpdate({ _id: id }, {
            title,
            description,
            propertyType,
            location,
            price,
            photo: photoUrl.url || photo
        });

        res.status(200).json({ message: "Property updated successfully" });


    } catch (error) {
        res.status(200).json({ message: error })
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const propertyToDelete = await Property.findById({ _id: id }).populate(
            "creator",
        );

        if (!propertyToDelete) throw new Error("Property not found");

        const session = await mongoose.startSession();
        session.startTransaction();
      
        propertyToDelete.creator.allProperties.pull(propertyToDelete);

        await propertyToDelete.creator.save({ session });
        await Property.deleteOne({_id:id}).session(session);

        await session.commitTransaction();

        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    getAllProperty,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty
}

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            maxlength: [15, "Username cannot exceed 15 characters."], // Maximum length constraint
            validate: {
                validator: function (value) {
                    return /^[a-zA-Z0-9]+$/.test(value);
                },
                message:
                    "Username can only contain letters and numbers, no special characters."
            }
        },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: true,
        },
        profilePicture: { type: String, default: '' },
        bio: { type: String, default: '' },
        gender: { type: String, enum: ['male', 'female'] },
        isVerified: { type: Boolean, default: false },
        verificationCode: { type: String },
        verificationExpires: { type: Date, index: {expires: 0} },
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
        bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    },
    { timestamps: true }
);



export const User = mongoose.model('User', userSchema);
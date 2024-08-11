const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const {isEmail} = require('validator')

// Function to convert values to lowercase
const lowercaseTransform = function (value) {
    return value.toLowerCase();
};

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email!'],
        unique: true,
        lowercase: true,
        validator: [isEmail, 'Please enter a valid email!']
    },
    name: {
        type: String,
        required: [true, "Please enter a valid name!"],
    },
    age:{
        type: Number,
        required: [true, "Please enter a valid age!"],
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter password!'],
        minlength: [6, 'Min length of password is 6']
    },
    roleId: {
        type: String,
        enum: ['nurse', 'patient'],
        transform: lowercaseTransform,
        required: true
    }
})

// salting and hashing the password
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login =  async function(email, password)
{
    const user = await this.findOne({email});
    if(user)
    {
       const isAuth = await bcrypt.compare(password, user.password);
       if(isAuth)
       {
        return user;
       }
       throw Error('Incorrect password')
    }
    else{
        throw Error('Incorrect email')
    }
}

const User = mongoose.model('user', userSchema);

module.exports = User;
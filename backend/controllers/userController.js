import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
// import bcrypt from 'bcrypt'
import bcryptjs from 'bcryptjs'
import validator from 'validator'

//Login User
const loginUser = async(req, res) =>{
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email})
        if (!user) {
            return res.json({success:false, message:"This user does not exist"})
        }
        // const isMatch = await bcrypt.compare(password, user.password)
        const isMatch = await bcryptjs.compare(password, user.password)


        if (!isMatch) {
            return res.json({success:false, message:"Invalid Credentials"})
        }

        const token = createToken(user._id);
        res.json({success:true, token})
    } catch (error) {
        console.log(error)
        res.json({succes:false, message:"Error"})
    }
}


const createToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}
//Register User

const registerUser = async (req, res) => {
    const {name, password, email} = req.body;
    try {
        //Checking if user exists
        const exists = await userModel.findOne({email})
        if (exists){
            return res.json({success:false, message:"User already exists"})
        }
        //Validating email and password
        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }

        //Validate password length
        if (password.length<8) {
            return res.json({success:false, message:"Please enter a strong password"})
        }

        //Hashing User Password
        const salt = await bcryptjs.genSalt(10)
        const hashedPassword = await bcryptjs.hash(password, salt)

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        const user = await newUser.save()
        const token = createToken(user._id)
        res.json({success:true, token})

    } catch (error) {
        console.log(error)
        res.json({success:false})
    }
}

export {loginUser, registerUser}
import { generateToken } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
export const signup = async (req,res) =>{
    try{
        const {fullname, username, email, password} = req.body;
        console.log(req.body)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)){
            return res.status(400).json({error:'Invalid email format'});
        }
        const existUser = await User.findOne({username});
        if(existUser){
            return res.status(400).json({error: "Username is already taken"});
        }
        const existEmail = await User.findOne({email});
        if(existEmail){
            return res.status(400).json({error: "Email is already taken"});
        }
        
        if(password.length < 6){
            return res.status(400).json({error: "Password length is less than 6 characters"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashpw= await bcrypt.hash(password, salt);
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashpw
        });
        if(newUser){
            generateToken(newUser._id, res);
            await newUser.save();
            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                email: newUser.email,
                followers: newUser.followers,
                following: newUser.following,
                profileImg: newUser.profileImg,
                coverImg: newUser.coverImg    
            });
        }
        else {
           
            return res.status(400).json({error: "Invalid user data"});
        }
    }
    catch (error){ 
        console.log("Error in signup controller", error.message);
        return res.status(500).json({error: 'Internal Server Error'})
    }
};

export const login = async (req,res) =>{
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username})
        const isPasswordValid =  await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordValid){
           return res.status(400).json({error: "Invalid username or password"})
        }
        generateToken(user._id, res)
        return res.status(200).json(
            {
                _id: user._id,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                followers: user.followers,
                following: user.following,
                profileImg: user.profileImg,
                coverImg: user.coverImg,
            }
        );
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({error: 'Internal Server Error'})
    }
};

export const logout = async (req,res) =>{
  try {
    res.cookie('token', '', {maxAge: 0})
    res.status(200).json({message: "Logout successfully"})
  } catch (error) {
    console.log("Error in logout controller", error.message);
        res.status(500).json({error: 'Internal Server Error'})
  }
};

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
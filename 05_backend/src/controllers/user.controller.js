import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.Model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'



const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToke = user.generateRefreshToken()
        
        user.refreshToke = refreshToke
        await user.save({ validateBeforeSave: false })
        
        return {accessToken, refreshToke}


    } catch (error) {
        throw new ApiError(500,"something went wrong while generation refresh and access token")
    }
}

//registeruser

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend
    //validation - not empty
    //check if user already exists : username, email
    //check for images, check for avatar'
    //upload them to cloudinary, avatar
    //create user object - create entry in db
    //remove password and refresh token field  from response
    //check for user creation 
    //return res
    
    const {fullName, email, username, password} = req.body
    
    //console.log("BODY:", req.body);

    
    // if (fullName === "") {
    //     throw new ApiError(400, "fullname is required")
    // }

    if (
        [fullName, email, username, password].some((field) => 
            field?.trim() ===""
        )
    ) {
        throw new ApiError(400, "All fields are required")
    }

  const existedUser =await  User.findOne({
        $or: [{username},{email}]
  })
    
    if (existedUser) {
        throw new ApiError(409, "User with email or username is already exists")
    }
    //console.log(req.files);

    const avatarLocalPath = req.files?.avatar[0]?.path;

    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400,"Avatar file is required")
    }
    
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    
    if (!createdUser) {
        throw new ApiError(500,"Something went wrong while registering the user")
    }


    return res.status(201).json(
        new ApiResponse(200,createdUser,"User registered Successfully")
    )

})



const loginUser = asyncHandler(async (req, res) => {
    //req body -> data
    //username or email
    //find the user
    //password check
    //access and refresh token
    //send cookie
    //send response successfully 

    const { email, username, password } = req.body;
    console.log("emial: ",email)

    if (!(username || email)) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or :[ {username},{email}]
    })

    if (!user) {
        throw new ApiError(400,"User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

     if (!isPasswordValid) {
        throw new ApiError(401,"Invalid user credentials")
    }

   const {accessToken, refreshToke} =  await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).
        select("-password -refreshToken")
    
    
    const options = {
        httpOnly: true,
        secure:true
    }
 
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToke, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken,
                    refreshToke
                },
                "User logged In successfully"
            )
        )

})


const logoutUser = asyncHandler(async (req, res) => {
   await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,{},"User logged Out"))
})



export {
    registerUser,
    loginUser,
    logoutUser
}
// @desc    Register User
// @route   POST /api/users
// @access  Private
const registerUser = (req,res) => {
    res.json({message:'register User'})
}

// @desc    Get User
// @route   GET /api/users/:id
// @access  Private
const getUser = (req,res) => {
    res.json({message:'register User'})
}

// @desc    Get Users
// @route   GET /api/users
// @access  Private
const getUsers = (req,res) => {
    res.json({message:'register User'})
}

// @desc    Update User
// @route   PUT /api/users/:id
// @access  Private
const updateUser = (req,res) => {
    res.json({message:'register User'})
}

// @desc    Delete User
// @route   DELETE /api/users/:id
// @access  Private
const deleteUser = (req,res) => {
    res.json({message:'register User'})
}

// @desc    Authenticate User
// @route   POST /api/users/login
// @access  Public
const loginUser = (req,res) => {
    res.json({message:'register User'})
}

module.exports = { registerUser, getUser, getUsers, updateUser, deleteUser, loginUser }
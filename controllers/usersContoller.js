const mongoose = require('mongoose')
const User = require('../models/users')


const addNewUser = async({ name, email, address, file, fileName }) => {
  console.log(file)
    let emailCheck = /.*@.*\..*/
    if (!emailCheck.test(email)) {
        return { status: false, result: 'Invalid Email Id' }
    }
    if (!file) {
        file = 'N/A',
        fileName = 'N/A'
    }
    try {
        let user = new User({ name, email, address, file, fileName })
        let savedUser = await user.save()
        return { status: true, result: savedUser }
    } catch (err) {
        return { status: false, result: 'Error' + err.message }
    }
}

module.exports = {
  addNewUser
}
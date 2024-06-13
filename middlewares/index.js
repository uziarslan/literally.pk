const mongoose = require('mongoose');
// const Teacher = mongoose.model('Teacher');
// const Student = mongoose.model('Student');
const Admin = mongoose.model('Admin');

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to login first!')
    res.redirect('/admin/login');
}

// module.exports.isTeacher = (req, res, next) => {
//     if (req.user instanceof Teacher) {
//         return next();
//     }
//     res.redirect('/login');
// }

// module.exports.isStudent = (req, res, next) => {
//     if (req.user instanceof Student) {
//         return next();
//     }
//     res.redirect('/login');
// }

module.exports.isAdmin = (req, res, next) => {
    if (req.user instanceof Admin) {
        return next();
    }
    req.flash('error', "You are not allowed to view these pages")
    res.redirect('/admin/login');
}

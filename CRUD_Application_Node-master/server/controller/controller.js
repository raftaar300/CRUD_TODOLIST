var Userdb = require('../model/model');


if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}


exports.create = (req, res) => {

    if (!req.body) {
        res.status(400).send({ message: "Content can not be emtpy!" });
        return;
    }
    var pas = localStorage.getItem('password');
    var em = localStorage.getItem('email');

    console.log("password", pas);
    console.log("em", em);

    const user = new Userdb({
        email: em,
        password: pas,
        gender: req.body.gender,

    })


    user
        .save(user)
        .then(data => {

            res.redirect('/');
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating a create operation"
            });
        });

}

exports.find = (req, res) => {

    if (req.query.id) {
        const id = req.query.id;
        var pas = localStorage.getItem('password');
        var em = localStorage.getItem('email');

        console.log("password", pas);
        console.log("em", em);


        Userdb.find({ email: em, password: pas })
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Not found user with id " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Erro retrieving user with id " + id })
            })

    } else {
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "Error Occurred while retriving user information" })
            })
    }


}

exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Data to update can not be empty" })
    }

    const id = req.body.id;
    console.log("id : ", id);
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Update user with ${id}. Maybe user not found!` })
            } else {
                res.send(data)
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error Update user information" })
        })
}


exports.delete = (req, res) => {
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete with id ${id}. Maybe id is wrong` })
            } else {
                res.send({
                    message: "User was deleted successfully!"
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}
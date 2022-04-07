const express = require('express');

const router = express.Router();

const look=require('../logger/logger')

const a=require('../util/helper')
const b=require('../util/helper')
const c=require('../util/helper')

const word=require('../validator/formatter')


router.get('/test-me', function (req, res) {

    console.log('Calling log function')
    look.wlcm()

    a.pD()
    b.pM()
    c.batch()

    word.lowerupper()

    res.send('assignment complete!')
});


router.get('/hello', function (req, res) {
    let month = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    let _ = require("lodash");
    console.log(_.chunk(month, month.length / 4));

    let odd = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
    console.log(_.tail(odd))

    let union1 = function (...a) {
        return _.union(...a);
    }
    let a = [1, 2, 3, 4];
    let b = [3, 4, 5, 6];
    let c = [7, 8, 6, 7];
    let d = [9, 8, 5, 4];
    let e = [15, 6, 9, 28];
    console.log(union1(a, b, c, d, e));

    let moviesArr = [["horror", "The Shining"], ["drama", "Titanic"], ["thriller", "Shutter Island"], ["fantasy", "Pans Labyrinth"]]
    console.log(_.fromPairs(moviesArr));
    res.send('This assignment complete also');
});

module.exports = router;
// adding this comment for no reason
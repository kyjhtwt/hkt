const express = require('express');
const router = express.Router();
const db = require("../module/MysqlConnect.js")
const getMultipleRandom = require('../module/getMultipleRandom');

router.post('/register', (req, res) => {
    let body = req.body;
    let user_id = body.user_id;
    let user_password = body.user_password;
    let name = body.nickname;
    let description = body.description;
    let student_number = body.student_number;
    let university = body.university;
    let mbti = body.mbti;
    let gender = body.gender;
    db.query(`INSERT INTO pending_user(user_id, user_password, MBTI, name, description, university, student_number, gender) VALUES ("${user_id}", "${user_password}", "${mbti}", "${name}", "${description}", "${university}", "${student_number}", "${gender}")`, (err) => {
        if(err) throw err;
        res.end()
    });
})

router.post('/publish_user', (req, res) => {
    user_id = req.query.user_id;
    db.query(`INSERT INTO user (user_id, user_password, MBTI, name, description, university, student_number, gender) SELECT user_id, user_password, MBTI, name, description, university, student_number, gender FROM pending_user WHERE user_id='${user_id}'`, (err) =>{
        if(err) throw err;
        res.end();
    })
})

router.get('/', (req, res) => {
    db.query(`SELECT * FROM user`, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

// router.get('/:user_id', (req, res) => {
//     user_id = req.params.user_id
//     db.query(`SELECT * FROM user WHERE user_id=${user_id}`, (err, result) => {
//         if(err) throw err;
//         res.send(result[0]);
//     })
// })

router.get('/pending_user', (req, res) => {
    db.query(`SELECT * FROM pending_user`, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})

router.get('/login', (req, res) => {
    user_id = req.query.user_id;
    user_password = req.query.user_password;
    console.log("login start")
    db.query(`SELECT * FROM user WHERE user_id="${user_id}" AND user_password="${user_password}"`, (err, result) => {
        if(err) throw err;
        if(result.length == 0){
            res.send('Failed');
            console.log("login failed")
        }
        else{
            console.log("!!!!! login login")
            res.cookie('login', '1', 'localhost:3000');
            res.cookie('user_id', result[0].user_id, 'localhost:3000');
            res.send('login')
        }
    })
})

router.delete('/all', (req, res) => {
    db.query('DELETE FROM user', (err) => {
        if(err) throw err;
        res.end();
    })
})

router.delete('/pending_delete_all', (req, res) => {
    db.query('DELETE FROM pending_user', (err) => {
        if(err) throw err;
        res.end();
    })
})

router.post('/default_case', (req, res) => {
    let mbtis = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']
    let univs = ['Seoul University', 'POSTECH', 'KAIST', 'Korea University', 'Kookmin University'];
    let genders = ['Male', 'Female'];
    let student_numbers = [2016, 2017, 2018, 2019, 2020, 2021, 2022];
    for(let i = 0; i < 100; i++){
        user_id = Math.random().toString(32).substr(2,11)
        name = Math.random().toString(32).substr(2,11)
        MBTI = getMultipleRandom(mbtis, 1);
        university = getMultipleRandom(univs, 1);
        gender = getMultipleRandom(genders, 1);
        student_number = getMultipleRandom(student_numbers, 1);
        user_password = 111;
        db.query(`INSERT INTO user (user_id, user_password, MBTI, name, description, university, student_number, gender) VALUES ('${user_id}', '${user_password}', '${MBTI}', '${name}', 'ddeessccrriippttiioonn', '${university}', '${student_number}', '${gender}')`)
        if(i == 99) res.send('Done')
    }
   
})

/**
*  @swagger
*  tags:
*    name: user
*    description: API to manage user.
*/

/**
*   @swagger
*  paths:
*   /user:
*     get:
*         summary: get pending user
*         tags: [user]
*         responses:
*           "200":
*             description: The list of users.
*/

/**
*   @swagger
*  paths:
*   /user/default_case:
*     post:
*         summary: get pending user
*         tags: [user]
*         responses:
*           "200":
*             description: The list of users.
*/

/**
*   @swagger
*  paths:
*   /user/{user_id}:
*     get:
*         summary: get pending user
*         tags: [user]
*         parameters:
*           - in: path
*             name: user_id
*             description: id of user trying to find
*             required: true
*             schema:
*               type: integer
*         responses:
*           "200":
*             description: details of user
*/

/**
*   @swagger
*  paths:
*   /user/all:
*     delete:
*         summary: Delete pending user
*         tags: [user]
*         responses:
*           "200":
*             description: The list of users.
*/

/**
*   @swagger
*  paths:
*   /user/pending_delete_all:
*     delete:
*         summary: Delete pending user
*         tags: [user]
*         responses:
*           "200":
*             description: The list of users.
*/

/**
*   @swagger
*  paths:
*   /user/register:
*     post:
*         summary: regist user in unaccepted state
*         tags: [user]
*         requestBody:
*             required: true
*             content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/user'
*/

/**
*   @swagger
*  paths:
*   /user/pending_user:
*     get:
*         summary: get pending user
*         tags: [user]
*         responses:
*           "200":
*             description: The list of teams.
*/



/**
*   @swagger
*  paths:
*   /user/publish_user:
*     post:
*         summary: publish user in accepted state -- admin usage
*         tags: [user]
*         parameters:
*           - in: query
*             name: user_id
*             required: true
*             schema:
*               type: string
*         responses:
*           "200":
*             description: publish user
*/

/**
*   @swagger
*  paths:
*   /user/login:
*     get:
*         summary: login
*         tags: [user]
*         parameters:
*           - in: query
*             name: user_id
*             required: true
*             schema:
*               type: string
*           - in: query
*             name: password
*             required: true
*             schema:
*               type: string
*/






module.exports = router;
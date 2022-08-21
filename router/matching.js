const express = require('express');
const router = express.Router();
const db = require("../module/MysqlConnect.js")
const getMultipleRandom = require("../module/getMultipleRandom.js")

router.post('/well_fit', (req, res) => {
    min_n = req.query.min_n;
    max_n = req.query.max_n;
    min_n = 2016;
    max_n = 2022;
    gender = req.query.gender;
    university = req.query.university;

    // applicant_id = req.cookies.user_id
    applicant_id = 'tjd7n01op6g' /////////////////////////////////////////////////////////////
    let target_mbti = [];
    let selected_user;
    let state = 0;
    async function select_logic(){
        let applicant_mbti;
        await new Promise((resolve, reject) => {
            db.query(`SELECT MBTI From user WHERE user_id='${applicant_id}'`, (err, result) => {
                if(err) throw err;
                applicant_mbti = result[0];
                resolve(applicant_mbti)
            })
        })
        await new Promise((resolve, reject) => {
            db.query(`SELECT best, good From mbti WHERE applicant='${applicant_mbti.MBTI}'`, (err, result) => {
                if(err) throw err;
                target_mbti.push(result[0].best);
                target_mbti.push(result[0].good);
                resolve(target_mbti);
            })
        })
        await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user WHERE MBTI='${target_mbti[0]}' and ${min_n} <= student_number and ${max_n} >= student_number`, (err, result) => {
                if(err) throw err;
                selected_list = []
                for(let i = 0; i<result.length; i++){ 
                    if(result[i].gender == gender && (university.includes(result[i].university))){
                        selected_list.push(result[i]);
                    }
                    if(i == result.length -1){
                        const rand = Math.floor(Math.random()*selected_list.length);
                        if(selected_list.length >= 4) selected_user =getMultipleRandom(selected_list, 4);
                        else {
                            selected_user = selected_list
                            state = 1;
                        }
                        resolve(selected_user);
                        break;
                    }
                }
                if(result.length == 0){
                    resolve(selected_user);
                    state = 1;
                }
            })
        })
        if(state == 1){
            await new Promise((resolve, reject) => {
                db.query(`SELECT * FROM user WHERE MBTI='${target_mbti[1]}' and ${min_n} <= student_number and ${max_n} >= student_number`, (err, result) => {
                    if(err) throw err;
                    selected_list = []
                    for(let i = 0; i<result.length; i++){ 
                        if(result[i].gender == gender && (university.includes(result[i].university))){
                            selected_list.push(result[i]);
                        }
                        if(i == result.length -1){
                            const rand = Math.floor(Math.random()*selected_list.length);
                            if(4 - selected_user.length > 0){
                                if(selected_list.length + selected_user >= 4) selected_user.concat(getMultipleRandom(selected_list, 4 - selected_user.length));
                                else selected_user.concat(getMultipleRandom(selected_list, 4 - selected_user.length));
                            }
                            resolve(selected_user);
                            break;
                        }
                    }
                    if(result.length == 0) resolve(selected_user)
                })
            })
        }
        await new Promise((resolve, reject) => {
            db.query(`INSERT INTO not_match_info (applicant, not1, not2, not3, not4) VALUES ('${applicant_id}', '${selected_user[0]}', '${selected_user[1]}' , '${selected_user[2]}', '${selected_user[3]}')`, (err) => {
                if(err) throw err;
                resolve(1)
            })
        })
        res.send({"people" : selected_user});
    }
    select_logic()
})

router.post('/not_fit', (req, res) => {
    min_n = req.query.min_n;
    max_n = req.query.max_n;
    gender = req.query.gender;
    university = req.query.university;
    // applicant_id = req.cookies.user_id
    applicant_id = 'tjd7n01op6g' /////////////////////////////////////////////////////////////
    let target_mbti = [];
    let selected_user;
    let state = 0;
    async function not_fit_select_logic(){
        let applicant_mbti;
        await new Promise((resolve, reject) => {
            db.query(`SELECT MBTI From user WHERE user_id='${applicant_id}'`, (err, result) => {
                if(err) throw err;
                applicant_mbti = result[0];
                resolve(applicant_mbti)
            })
        })
        console.log(applicant_mbti)
        await new Promise((resolve, reject) => {
            db.query(`SELECT worst, not_good From mbti WHERE applicant='${applicant_mbti.MBTI}'`, (err, result) => {
                if(err) throw err;
                target_mbti.push(result[0].worst);
                target_mbti.push(result[0].not_good);
                resolve(target_mbti);
            })
        })
        console.log(target_mbti)
        await new Promise((resolve, reject) => {
            db.query(`SELECT * FROM user WHERE MBTI='${target_mbti[0]}' and ${min_n} <= student_number and ${max_n} >= student_number`, (err, result) => {
                if(err) throw err;
                selected_list = []
                for(let i = 0; i<result.length; i++){ 
                    if(result[i].gender == gender && (university.includes(result[i].university))){
                        selected_list.push(result[i]);
                    }
                    if(i == result.length -1){
                        if(selected_list.length >= 4) selected_user =getMultipleRandom(selected_list, 4);
                        else {
                            selected_user = selected_list
                            state = 1;
                        }
                        resolve(selected_user);
                        break;
                    }
                }
                if(result.length == 0){
                    resolve(selected_user);
                    state = 1;
                }
            })
        })
        if(state == 1){
            await new Promise((resolve, reject) => {
                db.query(`SELECT * FROM user WHERE MBTI='${target_mbti[1]}' and ${min_n} <= student_number and ${max_n} >= student_number`, (err, result) => {
                    if(err) throw err;
                    selected_list = []
                    for(let i = 0; i<result.length; i++){ 
                        if(result[i].gender == gender && (university.includes(result[i].university))){
                            selected_list.push(result[i]);
                        }
                        console.log(selected_list)
                        if(i == result.length -1){
                            const rand = Math.floor(Math.random()*selected_list.length);
                            if(4 - selected_user.length > 0){
                                if(selected_list.length + selected_user >= 4) selected_user.concat(getMultipleRandom(selected_list, 4 - selected_user.length));
                                else selected_user.concat(getMultipleRandom(selected_list, 4 - selected_user.length));
                            }
                            resolve(selected_user);
                            break;
                        }
                    }
                    if(result.length == 0) resolve(selected_user)
                })
            })
        }
        await new Promise((resolve, reject) => {
            db.query(`INSERT INTO not_match_info (applicant, not1, not2, not3, not4) VALUES ('${applicant_id}', '${selected_user[0]}', '${selected_user[1]}' , '${selected_user[2]}', '${selected_user[3]}')`, (err) => {
                if(err) throw err;
                resolve(1)
            })
        })
        res.send({"people" : selected_user});

    }
    not_fit_select_logic()
})

router.get('/well_fit', (req, res) => {
    applicant_id = 'tjd7n01op6g'
    db.query(`SELECT * FROM match_info`, (err, result) => {
        if(err) throw err;
        a = [result[0].well1, result[0].well2, result[0].well3, result[0].well4]
        res.send({people: a})
    })
})

router.get('/not_fit', (req, res) => {
    applicant_id = 'tjd7n01op6g'
    db.query(`SELECT * FROM not_match_info`, (err, result) => {
        if(err) throw err;
        a = [result[0].not1, result[0].not2, result[0].not3, result[0].not4]
        res.send({people: a})
    })
})


router.get('/match_start', (req, res) => {
    opponent_id = req.query.opponent_id;
    applicant_id = req.cookies.user_id;
    async function log_history(){
        await new Promise((resolve, reject) => {
            db.query(`SELECT MBTI From user WHERE user_id='${applicant_id}'`, (err, result) => {
                if(err) throw err;
                applier_mbti = result[0];
                resolve(applier_mbti)
            })
        })
        await new Promise((resolve, reject) => {
            db.query(`SELECT MBTI From user WHERE user_id='${opponent_id}'`, (err, result) => {
                if(err) throw err;
                target_mbti = result[0];
                resolve(applier_mbti)
            })
        })
        await new Promise((resolve, reject) => {
            match_id = Math.random().toString(10).substr(2,11)
            db.query(`INSERT INTO match_info (match_id, clientA, clientB, A_type, B_type) VALUES ('${match_id}', '${applicant_id}', '${opponent_id}', '${applier_mbti.MBTI}', '${target_mbti}')`, (err) => {
                if(err) throw err;
                // res.redirect('/chat');
                res.end()
                resolve(1)
            })
        })
    }
    log_history()
})


/**
*  @swagger
*  tags:
*    name: matching
*    description: API to manage matching.
*/
/**
*   @swagger
*  paths:
*   /matching/well_fit:
*     post:
*         summary: get matching
*         tags: [matching]
*         responses:
*           "200":
*             description: info of matched user.
*         parameters:
*           - in: query
*             name: min_n
*             required: false
*             schema:
*               type: int
*           - in: query
*             name: max_n
*             required: false
*             schema:
*               type: int
*           - in: query
*             name: gender
*             required: true
*             schema:
*               type: string
*           - in: query
*             name: university
*             required: true
*             schema:
*               type: array
*               item: string
*     get:
*         summary: get matching
*         tags: [matching]
*         responses:
*           "200":
*             description: info of matched user.
*/
/**
*   @swagger
*  paths:
*   /matching/not_fit:
*     post:
*         summary: get matching
*         tags: [matching]
*         responses:
*           "200":
*             description: info of matched user.
*         parameters:
*           - in: query
*             name: min_n
*             required: false
*             schema:
*               type: int
*           - in: query
*             name: max_n
*             required: false
*             schema:
*               type: int
*           - in: query
*             name: gender
*             required: true
*             schema:
*               type: string
*           - in: query
*             name: university
*             required: true
*             schema:
*               type: array
*               item: string
*     get:
*         summary: get matching
*         tags: [matching]
*         responses:
*           "200":
*             description: info of matched user.
*/
/**
*   @swagger
*  paths:
*   /matching/match_start:
*     get:
*         summary: get matching
*         tags: [matching]
*         responses:
*           "200":
*             description: info of matched user.
*         parameters:
*           - in: query
*             name: opponent_id
*             required: false
*             schema:
*               type: string
*/


module.exports = router
const db = require("./module/MysqlConnect.js")
const getMultipleRandom = require("./module/getMultipleRandom")
let mbtis = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']
for(let i = 0; i<mbtis.length; i++){
    applicant = mbtis[i];
    a = getMultipleRandom(mbtis, 5);
    db.query(`INSERT INTO mbti (applicant, best, good, soso, not_good, worst) VALUES ('${applicant}', '${a[0]}', '${a[1]}', '${a[2]}', '${a[3]}', '${a[4]}')`)
}

  

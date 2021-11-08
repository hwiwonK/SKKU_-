var express = require('express');
var router = express.Router();
const Multer = require('multer');
const { format, callbackify } = require("util");

const {folder, file, keyword} = require('../models');
const {Storage} = require('@google-cloud/storage');
const path = require("path");
const {spawn} = require('child_process');
const { PythonShell } = require('python-shell');


// function callback(cb){
//   cb();
// }

var multer = Multer({
  storage: Multer.memoryStorage()
});

// var spawn = require('child_process').spawn;


/* GET upload page. */
// user google id, folder id - folder name
router.get('/', async function(req, res, next) {

  console.log(req.session.passport.user);
  // userId = req.session.passport.user;
  
  //폴더 목록 조회
  var folderList = await folder.findAll({
    where: {userId: req.session.passport.user}
  });

  // 폴더 목록도 넘겨줘야 함.
  res.render('upload', { 
    'userId':  req.session.passport.user,
    'folders': folderList
  });
});


// upload process 진행
// 파일 gcs 에 업로드
//  - 파일 url, user google id, folder id 포함하여 file table에 저장
// 파일 확장자 파악하여 ocr, 키워드 추출 진행
//  - 파일 id, user google id 포함하여 keyword table에 저장
// 성공시 '/file', 실패시 '/upload'
router.post('/process', multer.single('file'), async function(req, res, next){
  if (!req.file) {
    res.status(400).send('No file uploaded.');
    return;
  }

  // console.log(req.file); //파일 잘 넘어옴

  const storage = new Storage();
  const bucket = storage.bucket('graduation_bucket');

  // 앞으로 사용할 전역변수
  var uploadedFileId;
  var extension;
  var uploadedFilename;
  var curUserid;
  var keywordArr;
  
  console.log('1번 완료');

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);

  // const blob = bucket.file(`/files/${req.session.passport.user}/${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  // console.log(blobStream);

  console.log('blob 정보'); //blob 확인 완료

  blobStream.on('error', err => {
    console.log(err);
  });


  async function keywordExtract() {
    console.log("키워드 추출 시작");
    return new Promise((resolve, reject) => {
      let results;
      let options = {
        mode : 'text',
        pythonPath : '/Library/Frameworks/Python.framework/Versions/3.9/bin/python3',
        pythonOptions : ['-u'],
        scriptPath : '',
        args : [uploadedFilename, extension, curUserid],
      };

      PythonShell.run('main.py', options, function(err, results) {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(results);
        keywordArr = results;
        console.log(results[0]);
        resolve(results);
        keywordToTable();
      });

    });
  }

  //키워드 추출 끝난 후에 디비 저장 시작



  //키워드 테이블에 저장하는 함수
  function keywordToTable(){

    console.log("테이블 저장 시작");

    arrLen = keywordArr.length;

    for (var i=0; i < arrLen; i++){
      keyword.create({
        keywordname : keywordArr[i],
        fileId : uploadedFileId,
        userId : req.session.passport.user
      });
    }

  }


  //함수 바로 실행
  blobStream.on('finish', async (data) => {
    // The public URL can be used to directly access the file via HTTP.
    
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    //file table에 자료 저장 - 저장하면서 file id 기록하기
    
    console.log(req.file.originalname);
    console.log(req.body.selectFolder);
    console.log(publicUrl);

    const [user_result, created] = await file.findOrCreate({
      where : {
        filename: req.file.originalname,
        fileurl: publicUrl,
        userId: req.session.passport.user,
        folderId: req.body.selectFolder}
      }
    );
    // console.log(user_result);
    
    uploadedFileId = user_result.id;
    extension = path.extname(req.file.originalname);
    uploadedFilename = req.file.originalname;
    curUserid = req.session.passport.user;
    
    console.log("파일 올리기 함수에서 진행 완료")
    console.log(uploadedFileId);
    console.log(extension);
    
    keywordExtract();
  
  });

  //앞선 함수 다 끝날 때까지 여기는 실행 안됨
  blobStream.end(req.file.buffer);
  
  
  //메인 페이지로 이동
  res.render('file', {title : 'Express'});
})




module.exports = router;

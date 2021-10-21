var express = require('express');
var router = express.Router();
const Multer = require('multer');
const { format, callbackify } = require("util");

const {folder, file, keyword} = require('../models');
const {Storage} = require('@google-cloud/storage');
const path = require("path");

function callback(cb){
  cb();
}

var multer = Multer({
  storage: Multer.memoryStorage()
});



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

  var uploadedFileId;
  var extension;
  
  console.log('1번 완료');

  // Create a new blob in the bucket and upload the file data.
  const blob = bucket.file(req.file.originalname);

  // const blob = bucket.file(`/files/${req.session.passport.user}/${req.file.originalname}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });

  console.log(blobStream);

  console.log('blob 정보'); //blob 확인 완료

  blobStream.on('error', err => {
    console.log(err);
  });

  blobStream.on('finish', async (data) => {
    // The public URL can be used to directly access the file via HTTP.
    
    const publicUrl = format(
      `https://storage.googleapis.com/${bucket.name}/${blob.name}`
    );

    //file table에 자료 저장 - 저장하면서 file id 기록하기
    
    console.log(req.file.originalname);
    console.log(req.body.selectFolder);
    console.log(publicUrl);

    // var uploadedFile = await file.create({
    //   filename: req.file.originalname,
    //   fileurl: publicUrl,
    //   userId: req.session.passport.user,
    //   folderId: req.body.selectFolder
    // });

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

    // console.log(uploadedFileId);
    // console.log(extension);

    callback(keywordTable);
  
  });


  //저장된 파일에 대해 ocr, 키워드 추출 진행
  //python 실행


  function keywordTable(){
    console.log(uploadedFileId);
    console.log(extension);

    keyword.create({
      keywordname : 'hello',
      fileId : uploadedFileId,
      userId : req.session.passport.user
    });

    keyword.create({
      keywordname : 'hello2',
      fileId : uploadedFileId,
      userId : req.session.passport.user
    });

    keyword.create({
      keywordname : 'hello3',
      fileId : uploadedFileId,
      userId : req.session.passport.user
    });

    keyword.create({
      keywordname : 'hello4',
      fileId : uploadedFileId,
      userId : req.session.passport.user
    });

    keyword.create({
      keywordname : 'hello5',
      fileId : uploadedFileId,
      userId : req.session.passport.user
    });
  }


  //추출된 키워드 테이블에 저장(req.), file id, user id 정보 활용



  blobStream.end(req.file.buffer);
  //메인 페이지로 이동
  res.render('file', {title : 'Express'});
})




module.exports = router;

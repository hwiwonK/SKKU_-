var express = require('express');
var router = express.Router();

const {file, folder, keyword} = require('../models');


/* GET home page. */
//모든 파일 정보
router.get('/', async function(req, res, next) {

  console.log(req.query.folderId);

  //전체 파일 목록 가져오기(userId) - 키워드도 함께
  if (req.query.folderId == undefined || req.query.folderId == ""){

    var fileList = await file.findAll({
      where: {
        userId: req.session.passport.user
      },
      include: keyword
    });


  } else { //해당 폴더 파일 목록 가져오기(userId, folderId) - 키워드도 함께
    var selectedFolder = req.query.folderId; //선택한 폴더의 folderId

    var fileList = await file.findAll({
      where: {
        userId: req.session.passport.user,
        folderId: selectedFolder
      },
      include: keyword
    });
  }

  //폴더 목록 가져오기
  var folderList = await folder.findAll({
    where: {userId: req.session.passport.user}
  });

  // console.log("유저 정보");
  // console.log(req.session.passport.user);
  // console.log("폴더 정보");
  // console.log(folderList);
  console.log("파일 정보");
  console.log(fileList);

  res.render('file', { 
    title: 'Express',
    folders: folderList,
    files: fileList //키워드 정보도 함께
  });
});


//파일 삭제
router.get('/delete', async function(req, res, next) {
  console.log(req.query.fileId);
  console.log("파일 삭제");

  var deletedFile = await file.destroy({
    where: {
      id: req.query.fileId
    }
  });

  console.log(deletedFile);

  res.redirect('/file');

})



//키워드 검색
router.post('/search', async function(req, res, next) {
  console.log("키워드 검색");

  console.log(req.body.query);

  var fileList = await file.findAll({
    where: {
      userId: req.session.passport.user
    },
    include: [{
      model: keyword, 
      where: {
        keywordname: req.body.query
      }
    }]
  });


  //폴더 목록 가져오기
  var folderList = await folder.findAll({
    where: {userId: req.session.passport.user}
  });


  res.render('file', { 
    title: 'Express',
    folders: folderList,
    files: fileList //키워드 정보도 함께
  });
})

module.exports = router;

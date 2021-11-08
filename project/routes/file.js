var express = require('express');
var router = express.Router();

const {file, folder, keyword} = require('../models');


/* GET home page. */
//모든 파일 정보
router.get('/', async function(req, res, next) {

  //전체 파일 목록 가져오기(userId) - 키워드도 함께
  // if (req.body.selectFolder == undefined || req.body.selectFolder == ""){

  //   var fileList = await file.findAll({
  //     where: {
  //       userId: req.session.passport.user
  //     }
  //   });

  //   if (fileList) {
  //     for(let file of fileList){
  //       let result = await file.findOne({
  //         include: {
  //           model : keyword,
  //           where : {
  //             fileId : file.id
  //           }
  //         }
  //       });
  //       //키워드 같이 묶어주기
  //       file.keywords = result.keywords;
  //     }
  //   }


  // } else { //해당 폴더 파일 목록 가져오기(userId, folderId) - 키워드도 함께
  //   var selectedFolder = req.body.selectFolder; //선택한 폴더의 folderId

  //   var fileList = await folder.findAll({
  //     where: {
  //       userId: req.session.passport.user,
  //       folderId: selectedFolder
  //     }
  //   });

  //   if (fileList) {
  //     for(let files of fileList){
  //       let result = await file.findOne({
  //         include: {
  //           model : keyword,
  //           where : {
  //             fileId : files.id
  //           }
  //         }
  //       })
  //       //키워드 같이 묶어주기
  //       file.keywords = result.keywords;
  //     }
  //   }
  // }

  //폴더 목록 가져오기
  var folderList = await folder.findAll({
    where: {userId: req.session.passport.user}
  });

  console.log(req.session.passport.user);
  res.render('file', { 
    title: 'Express',
    folders: folderList,
    // files: fileList //키워드 정보도 함께
  });
});



//키워드 검색
router.get('/search', function(req, res, next) {
  console.log("키워드 검색");

  res.render('file', {
    title: 'Express',
  })
})

module.exports = router;

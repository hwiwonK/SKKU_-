const {folder} = require('../../models');
import {prompt} from 'node-popup';
// const $ = require('jquery');

const folder = document.getElementById("btn_folder_new");

folder.addEventListener("click", async function(){
    // var folderName = await prompt("폴더의 이름을 입력해주세요", "무제");

    // const [folder_result, created] = await folder.findOrCreate({
    //     where : {
    //       foldername: folderName,
    //     }
    // });
    // console.log(folder_result);

    // if (created) {
    //     alert("폴더 생성이 완료되었습니다.");
    // } else {
    //     alert("이미 존재하는 폴더입니다.");
    // }
    // window.location.replace("/board/register");
    console.log("hello");
});

// $('#btn_folder_new').on('click', async function() {

//     //prompt 창 뜬다
//     var folderName = prompt("폴더의 이름을 입력해주세요", "무제");

//     const [folder_result, created] = await folder.findOrCreate({
//         where : {
//           foldername: folderName,
//         }
//     });
//     console.log(folder_result);

//     if (created) {
//         alert("폴더 생성이 완료되었습니다.");
//     } else {
//         alert("이미 존재하는 폴더입니다.");
//     }
//     window.location.replace("/board/register");
// });


const fs = require("fs");
const path = require('path');


/////////////////////////
const scanner = (fileList, dirList, dirName, opt) => {

    opt.limitCnt = opt.limitCnt || 0;
    opt.exts = opt.exts || [];
    opt.sizeFlag = opt.sizeFlag || false;

    let dirPath = (dirName).replace(/\\/g,'/');
    let dirExist = false;
    try{dirExist = fs.existsSync(dirPath);}catch{}
    let fncFlag = false;
    if(typeof opt.fnc === 'function') fncFlag = true;

    if(
        dirExist
        && (
            !opt.limitCnt
            || (
                opt.limitCnt
                && (fileList.length < opt.limitCnt)
            )
        )
    ){

        if(dirPath.slice(-1) != '/') dirPath += '/';

        dirList.push(dirPath);

        let isDir = false;
        try{isDir = fs.statSync(dirPath)?.isDirectory();}catch{}

        if(
            isDir
            && Array.isArray(fileList)
        ){            
            let scanList = [];
            try{scanList = fs.readdirSync(dirPath, {withFileTypes: true});}catch{}

            scanList.forEach((it) => {
                if(it.isDirectory()){
                    let dirNameChild = dirPath + it.name + '/';
                    scanner(fileList, dirList, dirNameChild, opt);
                }
                else{
                    const fileExt = path.extname(it.name)?.substring(1)?.toLowerCase();

                    if(
                        !opt.limitCnt
                        || (
                            opt.limitCnt
                            && (fileList.length < opt.limitCnt)
                        )
                    ){
                        let pushFlag = false;
                        let fileData = {
                            fileName: it.name,
                            fileExt: fileExt,
                            dirPath: dirPath,
                        }

                        if(opt.sizeFlag) {
                            try{fileData.fileSize = fs.statSync(dirPath + it.name)?.size;}catch{}
                        }

                        if(
                            Array.isArray(opt.regExp)
                            && opt.regExp[0]
                        ){
                            for(let i in opt.regExp){
                                let regExp = opt.regExp[i];
                                try{if(
                                    regExp.test(dirPath + it.name)
                                    && !pushFlag
                                ){
                                    fileList.push(fileData);
                                    pushFlag = true;
                                    if(fncFlag) opt.fnc(fileData);
                                }}catch{}
                            }
                        }
                        if(
                            Array.isArray(opt.exts)
                            && opt.exts.indexOf(fileExt) >= 0
                            && !pushFlag
                        ){
                            fileList.push(fileData);
                            pushFlag = true;
                            if(fncFlag) opt.fnc(fileData);
                        }
                    }
                }
            });
        }
    }
}


/////////////////////////
const toNumber = (numStr) => {
    return Number(String(numStr).replace(/[^0-9]/g,''));
}


/////////////////////////
const sumAll = (obj, key) => {
    let sum = 0;
    for(let n in obj){
        if(obj[n]){
            sum += toNumber(obj[n][key]);
        }
    }
    return sum;
}


/////////////////////////
const search = (dirName, opt) => {
    let fileList = [];
    let dirList = [];

    scanner(fileList, dirList, dirName, opt);
    const dirCount = dirList.length;
    const fileCount = fileList.length;

    if(opt.sizeFlag){
        const totalSize = sumAll(fileList, 'fileSize');
        return {fileList, fileCount, dirList, dirCount, totalSize};
    }
    else{
        return {fileList, fileCount, dirList, dirCount};
    }
    
}


/////////////////////////
//const lg = console.log;
//lg(search('/', 100));
//lg(search('C:\\', 100));
/*lg(
    search('C:/Users/Public/', {//검색대상디렉토리
        limitCnt: 0,//검색파일제한수
        sizeFlag: true,//파읽크기 정보추출 여부//속도가 느려짐
        regExp: [/\.ini$/],//검색경로정규식 배열
        exts: ['lnk'],//검색확장자 배열
        fnc: (fileData) => {//파일별 콜백함수
            lg(fileData.fileName);
        }
    })
);*/


/////////////////////////
module.exports = search;
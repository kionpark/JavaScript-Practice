const fScan = require('./fileScanner.js');

console.log(
    fScan('C:/Users/Public/', {//검색대상디렉토리
        limitCnt: 0,//검색파일제한수
        sizeFlag: true,//파읽크기 정보추출 여부//속도가 느려짐
        regExp: [/\.ini$/],//검색경로정규식 배열
        exts: ['lnk'],//검색확장자 배열
        /*fnc: (fileData) => {//파일별 콜백함수
            lg(fileData.fileName);
        }*/
    })
);
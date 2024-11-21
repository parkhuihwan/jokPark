const fs = require('fs');

class jok {
    constructor() {
        /*
        this.playerList = ['바키', '커두', '강산', '서재', '영쿠', '푸름', '빵길', '광해', '영호', '성현', '승민'];
        this.dayPlayerList = {
        };
        this.dayMatches = {
        }*/
        
        this.readFile("PlayerList.txt", (data)=>{
            this.playerList = JSON.parse(data);
        });
        this.readFile("DayPlayerList.txt", (data)=>{
            this.dayPlayerList = JSON.parse(data);
        });
        this.readFile(this.getTodayYYMMDD()+'_Matches.txt', (data)=>{
            this.dayMatches = {}
            this.dayMatches[this.getTodayYYMMDD()] = JSON.parse(data);
        });
    }

    getPlayerList() {
        return this.playerList;
    }
    setPlayers(pl) {
        this.playerList = pl;
    }
    getMakeDay() {
        return this.dayPlayerList[this.getTodayYYMMDD()]
    }
    setMakeDay(dpl) {
        this.dayPlayerList[this.getTodayYYMMDD()] = dpl;
    }
    makeMatch(winningPlayers, losingPlayers) {
        if (!this.dayMatches[this.getTodayYYMMDD()]) this.dayMatches[this.getTodayYYMMDD()] = [];
        const length = this.dayMatches[this.getTodayYYMMDD()].length;
        this.dayMatches[this.getTodayYYMMDD()][length] = {
            winningPlayers: winningPlayers,
            losingPlayers: losingPlayers,
        }
    }
    getMatches() {
        if (!this.dayMatches[this.getTodayYYMMDD()])
            return "[]";
        else
            return this.dayMatches[this.getTodayYYMMDD()];
    }
    saveMatches() {
        this.writeFile('PlayerList.txt', JSON.stringify(this.playerList));
        this.writeFile('DayPlayerList.txt', JSON.stringify(this.dayPlayerList));
        this.writeFile(this.getTodayYYMMDD()+'_Matches.txt', JSON.stringify(this.getMatches()));
    }
    writeFile(fileName, content){
        fs.writeFile("./data/"+fileName, content, 'utf8', (err) => {
            if (err) {
                console.error('Error writing to file:', err);
            } else {
                console.log('File written successfully!');
            }
        });
    }
    readFile(fileName, cb){
        fs.readFile("./data/"+fileName, 'utf8', (err, data) => {
            if (err) {
                cb('{}');
            } else {
                cb(data);
            }
        });
    }

    getTodayYYMMDD() {
        // 현재 날짜 가져오기
        const now = new Date();
        // YYYYMMDD 형식으로 포맷팅
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    }
};

module.exports = jok;
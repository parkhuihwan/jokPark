class jok {
    constructor() {
        this.playerList = ['바키','커두','강산','서재','영쿠','푸름','빵길','광해','영호','성현','승민'];
        this.dayPlayerList = {
            '241121': [''],
        };
        this.dayMatches = {
            '241121': {
                
            }
        }
    }

    getPlayerList() {
        return this.playerList;
    }
    setPlayerList(pl) {
        this.playerList = pl;
    }
    getMakeDay() {
        return this.dayPlayerList[this.getTodayYYMMDD()]
    }
    setMakeDay(dpl) {
        this.dayPlayerList[this.getTodayYYMMDD()] = dpl;
    }
    makeMatch(winningPlayers, losingPlayers) {
        if(!this.dayMatches[this.getTodayYYMMDD]) this.dayMatches[this.getTodayYYMMDD] = [];
        const length = this.dayMatches[this.getTodayYYMMDD].length;
        this.dayMatches[this.getTodayYYMMDD][length].winningPlayers = winningPlayers;
        this.dayMatches[this.getTodayYYMMDD][length].losingPlayers = losingPlayers;
    }
    getMatches() {
        return JSON.stringify(this.dayMatches[this.getTodayYYMMDD]);
    }

    getTodayYYMMDD() {
        // 현재 날짜 가져오기
        const now = new Date();
        // YYYYMMDD 형식으로 포맷팅
        return `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    }
};

module.exports = jok;
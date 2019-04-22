angular.module('workingHoursTrello').service('bonuseS', function(weekS, monthS, winS) {
    this.employeesFilter = (boardMembers, notEmployee) => { /** Filter members to get only employee */
        for (let i = 0; i < notEmployee.length; i++) {
            const notEmp = notEmployee[i];
            let employees = [];
            for (let x = 0; x < boardMembers.length; x++) {
                const member = boardMembers[x];
                if (member.id != notEmp) {
                    employees.push(member);
                }
            }
            return employees
        }
    }
    this.getLeader = (boardCards, members) => {
        for (let y = 0; y < boardCards.length; y++) {
            const card = boardCards[y];
            for (let z = 0; z < members.length; z++) {
                const member = members[z];
                if (card.idMembers == member.id && card.labels[0].name == 'leader') {
                    return member.id
                }
            }
        }
    }
    this.winner = (boardCards, members) => {
        let leader = this.getLeader(boardCards, members);
        let winTask = {id:'0', tasks: 0};
        let winTime = {id:'0', time: 0};
        for (let i = 0; i < members.length; i++) {
            const member = members[i];
            if (member.id != leader) {
                if (winTask.tasks < member.tasks) {
                    winTask.tasks = member.tasks;
                    winTask.id = member.id;
                    }
            }
        }
        for (let x = 0; x < members.length; x++) {
            const member = members[x];
            if (member.id != winTask.id && member.id != leader) {
                if (winTime.time < member.time) {
                    winTime.time = member.time;
                    winTime.id = member.id;
                    }
            }
        }
        return winner = {winTask: winTask.tasks, winTime: winTime.time, leader: leader};
      }
    this.bonuseTime = (year, month, boardMembers, boardLists, boardCards, calendarCards, notEmployees) => {
        let monthDateByDay = monthS.monthDaysDate(year, month); 
        let listsId = weekS.arrayListsID(monthDateByDay, boardLists); 
        let listsCards = winS.listsCards(boardCards, listsId);
        let employees = this.employeesFilter(boardMembers, notEmployees);
        let memberCards = winS.membersCards(employees, listsCards);
        let memberTotal = winS.MonthTotal(memberCards);
        let winnerTask = this.winner(calendarCards, memberTotal);
        return winnerTask;
    }
  });
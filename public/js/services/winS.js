angular.module('workingHoursTrello').service('winS', function(monthS, weekS) {
    this.listsCards = (boardCards, listsId) => { /** We get the cards of the given lists */
      let cards = [];
      for (let i = 0; i < listsId.length; i++) {
        const list = listsId[i];
        for (let x = 0; x < boardCards.length; x++) {
          const card = boardCards[x];
          if (card.idList == list) {
            if (!card.name.match(/[a-z]/i)) { /** we check if card contain letters */
              try {
                let cardname = Math.abs(eval(card.name))
                cards.push({name:cardname, memberId: card.idMembers, completed:card.badges.checkItemsChecked})
              } catch (error) {}
            }
          }
        }
      }
      return cards;
    }
    this.membersCards = (boardMembers, listsCards) => { /** we get the cards of each members */
      let memberCards = [];
      for (let i = 0; i < boardMembers.length; i++) {
        const member = boardMembers[i];
        let members = [];
        for (let x = 0; x < listsCards.length; x++) {
          const card = listsCards[x];
          if (member.id == card.memberId) {
            members.push({id:member.id, time:card.name, tasks:card.completed})
          }
        }
        memberCards.push(members)
      }
      return memberCards
    }
    this.MonthTotal = (memberCards) => {
      let memberTotalTime = []
      for (let i = 0; i < memberCards.length; i++) {
        const members = memberCards[i];
        let memberTime = {id:0, time:0, tasks:0};
        for (let i = 0; i < members.length; i++) {
          const member = members[i];
          memberTime.time = memberTime.time + member.time;
          memberTime.tasks = memberTime.tasks + member.tasks;
          memberTime.id = member.id
        }  
        memberTotalTime.push(memberTime)
      }
      return memberTotalTime
    }
    this.timeWinner = (members) => {
      let highest = 0;
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        if (highest < member.time) {
          highest = member.time
        }
      }
      return highest;
    }
    this.taskWinner = (members) => {
      let highest = 0;
      for (let i = 0; i < members.length; i++) {
        const member = members[i];
        if (highest < member.tasks) {
          highest = member.tasks;
        }
      }
      return highest;
    }
    this.monthWinner = (year, month, boardMembers, boardLists, boardCards, rewardOf = 'time') => {
      try {
        let monthDateByDay = monthS.monthDaysDate(year, month); 
        let listsId = weekS.arrayListsID(monthDateByDay, boardLists); 
        let listsCards = this.listsCards(boardCards, listsId);
        let memberCards = this.membersCards(boardMembers, listsCards);
        let memberTotal = this.MonthTotal(memberCards);
        if (rewardOf == 'task') {
          let winnerTask = this.taskWinner(memberTotal);
          return winnerTask;
        }
        let winnerTime = this.timeWinner(memberTotal);
        return winnerTime;
      } catch (error) {}
    }
    this.leader = (boardCards, memberId) => {
      try {
        let foundCard = boardCards.find((card) => card.idMembers == memberId && card.labels[0].name == 'leader')
        return foundCard.idMembers
      } catch (error) {}
    }
  });
$(function () {

  // deckOfCards looks like this and is stored as an object on the window.
  //   {name: 'two of clubs', value: 2, suit: 1, suitName: clubs, image: '2clubs.png'},
  var handTurn = 0;
  var humanStack = 5000;
  var computerStack = 5000;

  // THE HANDS ARE PLAYED BELOW THIS LINE

  var newHand = function () {

    //Ensure that the cards are not deployed
    $('#humanCardOne').html('');
    $('#humanCardTwo').html('');

    $('#humanCardOne').append('<img height=100% src="images/backOfCard.jpg" />');
    $('#humanCardTwo').append('<img height=100% src="images/backOfCard.jpg" />');

    // let's create a variable to hold all the cards that will be used in the hand.
    var cardsSelectedForPlay = [];

    //define a function that selects 9 random UNIQUE cards from the deck.
    var dealCards = function () {
      for (var i=0; i<9; i++) {
        var newCard = ((Math.floor(Math.random()*deckOfCards.length)));
        if ($.inArray(newCard, cardsSelectedForPlay) == -1) {
          cardsSelectedForPlay.push(newCard);
        } else {
          i--;
        }
      }
    };

    //Use this to test card values
    // cardsSelectedForPlay = [0,13,45,37,26,6,7,8,9];

    // deal the cards to be used in the hand
    dealCards();
    console.log(cardsSelectedForPlay);

    var humanCard1 = cardsSelectedForPlay[0];
    var humanCard2 = cardsSelectedForPlay[1];
    var computerCard1 = cardsSelectedForPlay[2];
    var computerCard2 = cardsSelectedForPlay[3];
    var flopCard1 = cardsSelectedForPlay[4];
    var flopCard2 = cardsSelectedForPlay[5];
    var flopCard3 = cardsSelectedForPlay[6];
    var turnCard = cardsSelectedForPlay[7];
    var riverCard = cardsSelectedForPlay[8];

    var humanCardArrayValues = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value];
    var humanSortedCardsArray = humanCardArrayValues.sort(function(a, b) {return b-a;});

    var computerCardArrayValues = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value];
    var computerSortedCardArrayValues = computerCardArrayValues.sort(function(a, b) {return b-a;});

    var humanFourOfAKindHands = [];
    var humanStraightFlushHands = [];
    var humanFullHouseHands = [];
    var humanFlushHands = [];
    var humanStraightHands = [];
    var humanThreeOfAKindHands = [];
    var humanTwoPairHands = [];
    var humanPairedHands = [];
    var humanHighestCard = "";
    var humanHasRoyalFlush = 0;

    //Sub-Hand Value Criteria Variables
    var humanHighestCardValueInAStraightFlush = 0;
    var humanHighestCardValueInAFourOfAKind = 0;
    var humanHighestCardValueInAFullHouse = 0;
    var humanHighestCardValueInThreeOfAKind = 0;
    var humanHighestCardValueInAStraight = 0;
    var humanHighestCardValueInFirstPairInTwoPair = 0;
    var humanHighestCardValueInSecondPairInTwoPair = 0;
    var humanHighestCardValueInPair = 0;
    var humanFlushCardValues = [];

    var computerFlushHands = [];
    var computerFullHouseHands = [];
    var computerFourOfAKindHands = [];
    var computerStraightHands = [];
    var computerThreeOfAKindHands = [];
    var computerTwoPairHands = [];
    var computerPairedHands = [];
    var computerHighestCard = "";
    var computerStraightFlushHands = [];
    var computerHasRoyalFlush = 0;

    //Sub-Hand Value Criteria Variables
    var computerHighestCardValueInAStraightFlush = 0;
    var computerHighestCardValueInAFourOfAKind = 0;
    var computerHighestCardValueInAFullHouse = 0;
    var computerHighestCardValueInThreeOfAKind = 0;
    var computerHighestCardValueInAStraight = 0;
    var computerHighestCardValueInFirstPairInTwoPair = 0;
    var computerHighestCardValueInSecondPairInTwoPair = 0;
    var computerHighestCardValueInPair = 0;
    var computerFlushCardValues = [];

    var humanHandScore = 0;
    var computerHandScore = 0;
    var handWinner = '';
    var computerHandBetterThanFiftyPercent = false;
    var computerBetRatio = 0;
    var computerShall = '';
    var potValue = 0;


    // This logs the full set of cards dealt but isn't required once the UI contains the cards.
    // console.log(deckOfCards[humanCard1].value, deckOfCards[humanCard1].suitName, deckOfCards[humanCard2].value, deckOfCards[humanCard2].suitName, deckOfCards[computerCard1].value, deckOfCards[computerCard1].suitName, deckOfCards[computerCard2].value, deckOfCards[computerCard2].suitName, deckOfCards[flopCard1].value, deckOfCards[flopCard1].suitName, deckOfCards[flopCard2].value, deckOfCards[flopCard2].suitName, deckOfCards[flopCard3].value, deckOfCards[flopCard3].suitName, deckOfCards[turnCard].value, deckOfCards[turnCard].suitName, deckOfCards[riverCard].value, deckOfCards[riverCard].suitName);

    //The image address of each card is a value on the deckOfCards object.

    // This format is used for the card images - deckOfCards[humanCard1].image
    //Update the UI with the all the cards in view initially so that we can test more easily whilst developing the game
    $('#humanCardOne').html('');
    $('#humanCardTwo').html('');

    $('#humanCardOne').append('<img height=100% src="images/'+deckOfCards[humanCard1].image+'" />');
    $('#humanCardTwo').append('<img height=100% src="images/'+deckOfCards[humanCard2].image+'" />');

    // BUT Let's break play here for the betting before playing the other cards...

    //First determine if the Computer has a hand better than 50% of hands...

    if (handTurn %2 === 0) {

      humanStack = humanStack - 100;
      potValue = potValue + 100;
      $('.statusArea').append('Your blind of $100 was added to the pot.<br>The pot is now worth $'+potValue);

      var isComputerHandBetterThanFiftyPercent = function () {
        if (((deckOfCards[computerCard1].value > 11) && deckOfCards[computerCard2].value > 8) || ((deckOfCards[computerCard1].value === deckOfCards[computerCard2].value))) {
          computerHandBetterThanFiftyPercent = true;
        }
      };
      isComputerHandBetterThanFiftyPercent();

      var setComputerBettingRatio = function () {
        if (computerHandBetterThanFiftyPercent === true) {
          computerBetRatio = Math.random()*1.5;
        }
        else {
          computerBetRatio = Math.random();
        }
      };
      setComputerBettingRatio();

      var computerFoldCallOrRaise = function () {
        if (computerBetRatio > 0.7) {
          computerShall = 'bet';
          potValue = potValue + 200;
          computerStack = computerStack - 200;
        } else if (computerBetRatio > 0.4) {
          computerShall = 'call';
          potValue = potValue + 100;
          computerStack = computerStack - 100;
        } else {
          computerShall = 'fold';
        }
      };
      computerFoldCallOrRaise();
      console.log(computerShall);

      //Computer makes its play

      if (computerShall == 'bet') {
        $('.statusArea').append('<br>Computer decided to bet $200. <br>The pot is now worth $'+potValue);
      } else if (computerShall == 'call') {
        $('.statusArea').append('<br>Computer decided to call $100.<br> Pot is now worth $'+potValue);
      } else if (computerShall == 'fold') {
        $('.statusArea').append('<br>Computer decided to fold.<br> You win the hand and take pot of $'+potValue+'<br>Click Next Hand to proceed');
        $('#nextHandButton').on('Click', function () {
          //I want the computer to wait until the click before proceeding any further.

        });
      }
      if (computerShall == 'fold') {
        //  newHand();
      }

      //Human needs to respond to play
      if (computerShall == 'bet') {
        $('.statusArea').append('<br>Would you like to call for an extra $100?');
      // Human needs to respond to continue

      } else if (computerShall === 'call') {
        $('.statusArea').append('<br>Would you like to check or bet and extra $100?');
      //Human needs to respond to continue.
      }

    }




    $('#computerCardOne').append('<img height=100% src="images/'+deckOfCards[computerCard1].image+'" />');
    $('#computerCardTwo').append('<img height=100% src="images/'+deckOfCards[computerCard2].image+'" />');
    $('#flopCard1').append('<img height=100px src="images/'+deckOfCards[flopCard1].image+'" />');
    $('#flopCard2').append('<img height=100px src="images/'+deckOfCards[flopCard2].image+'" />');
    $('#flopCard3').append('<img height=100px src="images/'+deckOfCards[flopCard3].image+'" />');
    $('#turnCard').append('<img height=100px src="images/'+deckOfCards[turnCard].image+'" />');
    $('#riverCard').append('<img height=100px src="images/'+deckOfCards[riverCard].image+'" />');


    // A hunman's 'hand' will be determined by finding the highest value of possible hands that s/he could have by looking at a combination of cards from the array and scoring it against criteria for each hand type.
    // Possible arrays of cards values that we need to consider are sorted by descending value to make their analysis easier:-
    var humanSortedCombinationCardValues1 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues2 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues3 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues4 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues5 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues6 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues7 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues8 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues9 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues10 = [deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues11 = [deckOfCards[humanCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues12 = [deckOfCards[humanCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues13 = [deckOfCards[humanCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues14 = [deckOfCards[humanCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues15 = [deckOfCards[humanCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues16 = [deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues17 = [deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues18 = [deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues19 = [deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues20 = [deckOfCards[humanCard2].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardValues21 = [deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});

    //This is a useful log which shows all the card values in all the combinaiton arrays
    //console.log(humanSortedCombinationCardValues1, humanSortedCombinationCardValues2, humanSortedCombinationCardValues3, humanSortedCombinationCardValues4, humanSortedCombinationCardValues5, humanSortedCombinationCardValues6, humanSortedCombinationCardValues7, humanSortedCombinationCardValues8, humanSortedCombinationCardValues9, humanSortedCombinationCardValues10, humanSortedCombinationCardValues11, humanSortedCombinationCardValues12, humanSortedCombinationCardValues13, humanSortedCombinationCardValues14, humanSortedCombinationCardValues15, humanSortedCombinationCardValues16, humanSortedCombinationCardValues17, humanSortedCombinationCardValues18, humanSortedCombinationCardValues19, humanSortedCombinationCardValues20, humanSortedCombinationCardValues21);

    // Similarly, we need to know the suited values of the cards so that we can check for a flush, a stright flush and a Royal Flush:-
    var humanSortedCombinationCardSuits1 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits2 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits3 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits4 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits5 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits6 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits7 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits8 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits9 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits10 = [deckOfCards[humanCard1].suit, deckOfCards[humanCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits11 = [deckOfCards[humanCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits12 = [deckOfCards[humanCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits13 = [deckOfCards[humanCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits14 = [deckOfCards[humanCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits15 = [deckOfCards[humanCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits16 = [deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits17 = [deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits18 = [deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits19 = [deckOfCards[humanCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits20 = [deckOfCards[humanCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var humanSortedCombinationCardSuits21 = [deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});

    //This is a useful log which shows all the card suits in all the human combinaiton arrays
    //console.log(humanSortedCombinationCardSuits1, humanSortedCombinationCardSuits2, humanSortedCombinationCardSuits3, humanSortedCombinationCardSuits4, humanSortedCombinationCardSuits5, humanSortedCombinationCardSuits6, humanSortedCombinationCardSuits7, humanSortedCombinationCardSuits8, humanSortedCombinationCardSuits9, humanSortedCombinationCardSuits10, humanSortedCombinationCardSuits11, humanSortedCombinationCardSuits12, humanSortedCombinationCardSuits13, humanSortedCombinationCardSuits14, humanSortedCombinationCardSuits15, humanSortedCombinationCardSuits16, humanSortedCombinationCardSuits17, humanSortedCombinationCardSuits18, humanSortedCombinationCardSuits19, humanSortedCombinationCardSuits20, humanSortedCombinationCardSuits21);

    //Use these two arrays for testing... they overwrite the arrays above...
    // humanSortedCombinationCardValues1 = [13,13,13,13,9];
    // humanSortedCombinationCardValues2 = [4,4,4,2,2];
    // humanSortedCombinationCardSuits1 = [1,1,1,1,1];
    //humanSortedCombinationCardSuits2 = [2,2,2,2,2];

    //This is a variable containing the arrays of all the sorted card values (above) for all permutations for the human
    var allHumanSortedCombinationCardValues = [humanSortedCombinationCardValues1, humanSortedCombinationCardValues2, humanSortedCombinationCardValues3, humanSortedCombinationCardValues4, humanSortedCombinationCardValues5, humanSortedCombinationCardValues6, humanSortedCombinationCardValues7, humanSortedCombinationCardValues8, humanSortedCombinationCardValues9, humanSortedCombinationCardValues10, humanSortedCombinationCardValues11, humanSortedCombinationCardValues12, humanSortedCombinationCardValues13, humanSortedCombinationCardValues14, humanSortedCombinationCardValues15, humanSortedCombinationCardValues16, humanSortedCombinationCardValues17, humanSortedCombinationCardValues18, humanSortedCombinationCardValues19, humanSortedCombinationCardValues20, humanSortedCombinationCardValues21];

    //This is a variable containing the arrays of all the sorted suit values (above) for all permutations for the human
    var allHumanSortedCombinationCardSuits = [humanSortedCombinationCardSuits1, humanSortedCombinationCardSuits2, humanSortedCombinationCardSuits3, humanSortedCombinationCardSuits4, humanSortedCombinationCardSuits5, humanSortedCombinationCardSuits6, humanSortedCombinationCardSuits7, humanSortedCombinationCardSuits8, humanSortedCombinationCardSuits9, humanSortedCombinationCardSuits10, humanSortedCombinationCardSuits11, humanSortedCombinationCardSuits12, humanSortedCombinationCardSuits13, humanSortedCombinationCardSuits14, humanSortedCombinationCardSuits15, humanSortedCombinationCardSuits16, humanSortedCombinationCardSuits17, humanSortedCombinationCardSuits18, humanSortedCombinationCardSuits19, humanSortedCombinationCardSuits20, humanSortedCombinationCardSuits21];

    //We can now write functions that will check for the various hands and run the combinations through them to check if they are true.
    //
    //FUNCTIONS THAT CHECK FOR INDIVIDUAL HANDS WITHIN ARRAYS
    //
    //
    //Function to see if a hand is Four of a Kind. Uses SortedCombinationCardValues arrays.
    var fourOfAKindChecker = function(array) {
      if ((array[0] === array[3]) || (array[1] === array[4])) {
        return true;
      }
    };

    //Function to see if a hand is a full house. Uses SortedCombinationCardValues arrays and compares the first three cards and the last two cards (and vice versa) to see if the cards within those ranges are the same.
    var fullHouseChecker = function(array) {
      if ((array[0] === array[2] && array[3] === array[4]) || (array[0] === array[1] && array[2] === array[4])) {
        return true;
      }
    };

    //Function to see if a hand is a flush (uses SortedCombinationCardSuits arrays)
    var flushChecker = function(array) {
      if (array[0] === array[4]) {
        return true;
      }
    };

    //Function to see if a hand is a straight (uses SortedCombinationCardValues) and simply checks to see if the numbers within the array are sequentially decreasing
    var straightChecker = function(array) {
      if ((array[1] === array[0]-1) && (array[2] === (array[1]-1)) && (array[3] === (array[2]-1)) && (array[4] === array[3]-1)) {
        return true;
      }
    };

    //Function to see if a hand is a Striaght Flush
    var straightFlushChecker = function(array1, array2) {
      if (((array1[1] === array1[0]-1) && (array1[2] === (array1[1]-1)) && (array1[3] === (array1[2]-1)) && (array1[4] === array1[3]-1)) && (array2[0] === array2[4])) {
        return true;
      }
    };

    // Function to see if a hand is Three Of A Kind. Uses SortedCombinationCardValues and looks to see if there are three equal values within the array which will always be consecutive as they are sorted by order.
    var threeOfAKindChecker = function(array) {
      if (array[0] === array[2] || array[1] === array[3] || array[2] === array[4]) {
        return true;
      }
    };

    //Function to see if a hand is Two Pairs. Uses SortedCombinationCardValues to see if there are two lots of two cards within the array that have the same value (i.e. two values next to each other are equal, as they are already sorted by value).
    var twoPairChecker = function(array) {
      if ((array[0] === array[1]) && (array[2] === array[3]) || (array[0] === array[1]) && (array[3] === array[4]) || (array[1] === array[2]) && (array[3] === array[4])) {
        return true;
      }
    };

    //Function to see if a hand contains any pairs. Uses SortedCombinationCardValues to see if there are two cards within the array that have the same value.
    var pairChecker = function(array) {
      if (array[0] === array[1] || array[1] === array[2] || array[2] === array[3] || array[3] === array[4]) {
        return true;
      }
    };

    //highCardChecker. Checks for the highest value card in the array of all cards. Uses the cardsSelected outcome.
    var humanHighCardChecker = function() {
      humanHighestCard = Math.max(deckOfCards[humanCard1].value, deckOfCards[humanCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value);
    };

    //FUNCTIONS THAT TAKE THE ARRAYS AND EVALUATE THEM FOR THE MADE HANDS
    //
    //

    //Function to see if there are Four Of A Kind arrays when called with the allHumanSortedCombinationCardValues array. Uses the fourOfAKindChecker function.
    var isFourOfAKindHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(fourOfAKindChecker(array[i])) {
          humanFourOfAKindHands.push(array[i]);
          // console.log(array[i]+' is a Four Of A Kind');
        }
      }
    };
    isFourOfAKindHuman(allHumanSortedCombinationCardValues);
    console.log('Human has '+humanFourOfAKindHands.length+' Four Of A Kind arrays');
    console.log(humanFourOfAKindHands);

    //Function to see if there are Full House arrays when called with the allHumanSortedCombinationCardValues array. Uses the fullHouseChecker function.
    var isFullHouseHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(fullHouseChecker(array[i])) {
          humanFullHouseHands.push(array[i]);
          // console.log(array[i]+' is a Full House');
        }
      }
    };
    isFullHouseHuman(allHumanSortedCombinationCardValues);
    console.log('Human has '+humanFullHouseHands.length+' Full House arrays');
    console.log(humanFullHouseHands);

    //Function to see if there are Flush arrays when called with the allHumanSortedCombinationCardSuits array. Uses the flushChecker function.
    var isFlushHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(flushChecker(array[i])) {
          humanFlushHands.push(array[i]);
          console.log(array[i]+' human has a flush');
        }
      }
    };
    isFlushHuman(allHumanSortedCombinationCardSuits);
    console.log('Human has '+humanFlushHands.length+' Flush arrays');
    console.log(humanFlushHands);

    //Function to see if there are Straight arrays when called with the allHumanSortedCombinationCardValues array. Uses the straightChecker function.
    var isStraightHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(straightChecker(array[i])) {
          humanStraightHands.push(array[i]);
          // console.log(array[i]+' is a Four Of A Kind');
        }
      }
    };
    isStraightHuman(allHumanSortedCombinationCardValues);
    console.log('Human has '+humanStraightHands.length+' Straight arrays');
    console.log(humanStraightHands);

    //Function to see if there are Striaght Flush arrays when called with BOTH allHumanSortedCombinationCardValues and allHumanSortedCombinationCardSuits
    var isStraightFlushHuman = function(array1, array2) {
      for (var i=0;i<array1.length;i++) {
        if(straightFlushChecker(array1[i], array2[i])) {
          humanStraightFlushHands.push(array1[i], array2[i]);
          // console.log(array[i]+' is a Four Of A Kind');
        }
      }
    };
    //And a Royal Flush can therefore be established if any of those humanStraightFlushHands contain an Ace. Can be done seperately.

    isStraightFlushHuman(allHumanSortedCombinationCardValues, allHumanSortedCombinationCardSuits);
    console.log('Human has '+humanStraightFlushHands.length+' Straight Flush arrays');
    console.log(humanStraightFlushHands);


    //Function to see if there are Three Of A Kind arrays when called with the allHumanSortedCombinationCardValues array. Uses the threeOfAKindChecker function.
    var isThreeOfAKindHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(threeOfAKindChecker(array[i])) {
          humanThreeOfAKindHands.push(array[i]);
          // console.log(array[i]+' is a Three Of A Kind');
        }
      }
    };
    isThreeOfAKindHuman(allHumanSortedCombinationCardValues);
    console.log('Human has '+humanThreeOfAKindHands.length+' Three Of A Kind arrays');
    console.log(humanThreeOfAKindHands);

    //Function to see if there are Two Pairs in an array when called with the allHumanSortedCombinationCardValues array. Uses the twoPairChecker function.
    var istwoPairHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(twoPairChecker(array[i])) {
          humanTwoPairHands.push(array[i]);
          // console.log(array[i]+' is Two Pairs');
        }
      }
    };
    istwoPairHuman(allHumanSortedCombinationCardValues);
    console.log('Human has '+humanTwoPairHands.length+' Two Pair arrays');
    console.log(humanTwoPairHands);

    //Function to see if there is a Pair in an array when called with the allHumanSortedCombinationCardValues array. Uses the pairChecker function.
    var isPairHuman = function(array) {
      for (var i=0;i<array.length;i++) {
        if(pairChecker(array[i])) {
          humanPairedHands.push(array[i]);
          // console.log(array[i]+' is Two Pairs');
        }
      }
    };
    isPairHuman(allHumanSortedCombinationCardValues);
    console.log('Human has '+humanPairedHands.length+' Paired arrays');
    console.log(humanPairedHands);

    //Function to see what the highest card is within an array. Called with the allHumanSortedCombinationCardValues array. Uses the highCardChecker function
    humanHighCardChecker();
    console.log("Human's Highest Card is: "+humanHighestCard);
    // console.log('High Card is 'Math.max(humanCard1));



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //So what if two players both had the same hand type? We will need to compare a secondary value to determine the winner. We need to look into
    //the values of the hands arrays to find the highest value of whatever and give them a secondary scoring value...

    // First Case - both players have a Straight Flush but one has a higher Straight Flush
    humanHighestCardOfAStraightFlush = function() {
      for (var i=0;i<humanStraightFlushHands.length;i++) {
        if (humanStraightFlushHands[i][0] > humanHighestCardValueInAStraightFlush) {
          humanHighestCardValueInAStraightFlush = humanStraightFlushHands[i][0];
          console.log('Human has high card value of '+humanHighestCardValueInAStraightFlush+' in a Straight Flush');
        }
      }
    };
    humanHighestCardOfAStraightFlush();

    // Second Case - both players have Four Of A Kind but one has a higher Four Of A Kind
    humanCardValueOfFourOfAKind = function() {
      for (var i=0;i<humanFourOfAKindHands.length;i++) {
        if (humanFourOfAKindHands[i][2] > humanHighestCardValueInAFourOfAKind) {
          humanHighestCardValueInAFourOfAKind = humanFourOfAKindHands[i][2];
          console.log('Human has high card value of '+humanHighestCardValueInAFourOfAKind+' in Four Of A Kind');
        }
      }
    };
    humanCardValueOfFourOfAKind();

    //Third Case - both players have a Full house
    humanCardValueOfFullHouse = function() {
      for (var i=0;i<humanFullHouseHands.length;i++) {
        if (humanFullHouseHands[i][2] > humanHighestCardValueInAFullHouse) {
          humanHighestCardValueInAFullHouse = humanFullHouseHands[i][2];
          console.log('Human has high card value of '+humanHighestCardValueInAFullHouse+' in a Full House');
        }
      }
    };
    humanCardValueOfFullHouse();

    //Fourth Case - both players have a Flush - needs some thinking... Need to look at the suit value of the flush and then filter all cards within the array humanCard1, humanCard2, flopCard1, flopCard2, flopCard3, turnCard & riverCard and find the highest value. If still a draw then look at the next highest value and so on until a winner.
    humanHighCardValueInAFlush = function () {
      if (humanFlushHands.length > 0) {
        var valueOfSuitInFlush = humanFlushHands[0][0];
        console.log('Value of Suit In Flush is '+valueOfSuitInFlush);
        if (deckOfCards[humanCard1].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[humanCard1].value);
        }
        if (deckOfCards[humanCard2].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[humanCard2].value);
        }
        if (deckOfCards[flopCard1].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[flopCard1].value);
        }
        if (deckOfCards[flopCard2].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[flopCard2].value);
        }
        if (deckOfCards[flopCard3].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[flopCard3].value);
        }
        if (deckOfCards[turnCard].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[turnCard].value);
        }
        if (deckOfCards[riverCard].suit === valueOfSuitInFlush) {
          humanFlushCardValues.push(deckOfCards[riverCard].value);
        }
        humanFlushCardValues.sort(function(a, b) {return b-a;});
        console.log(humanFlushCardValues);
        console.log('Human has a Flush. '+humanFlushCardValues[0]+' high');
      }
    };
    humanHighCardValueInAFlush();

    //Fifth Case - both players have a straight.
    humanCardValueOfAStraight = function() {
      for (var i=0;i<humanStraightHands.length;i++) {
        if (humanStraightHands[i][0] > humanHighestCardValueInAStraight) {
          humanHighestCardValueInAStraight = humanStraightHands[i][0];
          console.log('Human has high card value of '+humanHighestCardValueInAStraight+' in a Straight');
        }
      }
    };
    humanCardValueOfAStraight();

    //Sixth Case - both players have Three Of A Kind
    humanCardValueOfThreeOfAKind = function() {
      for (var i=0;i<humanThreeOfAKindHands.length;i++) {
        if (humanThreeOfAKindHands[i][2] > humanHighestCardValueInThreeOfAKind) {
          humanHighestCardValueInThreeOfAKind = humanThreeOfAKindHands[i][2];
          console.log('Human has high card value of '+humanHighestCardValueInThreeOfAKind+' in Three Of A Kind');
        }
      }
    };
    humanCardValueOfThreeOfAKind();

    //Seventh Case - If Both Players Have Two Pair!
    humanCardValueOfFirstPairInTwoPair = function () {
      for (var i=0;i<humanTwoPairHands.length;i++) {
        if (humanTwoPairHands[i][1] > humanHighestCardValueInFirstPairInTwoPair) {
          humanHighestCardValueInFirstPairInTwoPair = humanTwoPairHands[i][1];
          console.log('Human has first pair value of '+humanHighestCardValueInFirstPairInTwoPair+' in Two Pairs');
        }
      }
    };
    humanCardValueOfFirstPairInTwoPair();

    humanCardValueOfSecondPairInTwoPair = function () {
      for (var i=0;i<humanTwoPairHands.length;i++) {
        if (humanTwoPairHands[i][3] > humanHighestCardValueInSecondPairInTwoPair) {
          humanHighestCardValueInSecondPairInTwoPair = humanTwoPairHands[i][3];
          console.log('Human has second pair value of '+humanHighestCardValueInSecondPairInTwoPair+' in Two Pairs');
        }
      }
    };
    humanCardValueOfSecondPairInTwoPair();

    //Eighth Case - If Both Players Have One Pair
    humanCardValueOfPair = function () {
      for (var i=0;i<humanPairedHands.length;i++) {
        if (humanPairedHands[i][0] === humanPairedHands[i][1]) {
          humanHighestCardValueInPair = humanPairedHands[i][0];
          console.log('Human has pair value of '+humanHighestCardValueInPair+' in a Pair');
        } else if (humanPairedHands[i][1] === humanPairedHands[i][2]) {
          humanHighestCardValueInPair = humanPairedHands[i][1];
          console.log('Human has pair value of '+humanHighestCardValueInPair+' in a Pair');
        } else if (humanPairedHands[i][2] === humanPairedHands[i][3]) {
          humanHighestCardValueInPair = humanPairedHands[i][2];
          console.log('Human has pair value of '+humanHighestCardValueInPair+' in a Pair');
        } else if (humanPairedHands[i][3] === humanPairedHands[i][4]) {
          humanHighestCardValueInPair = humanPairedHands[i][3];
          console.log('Human has pair value of '+humanHighestCardValueInPair+' in a Pair');
        }
      }
    };
    humanCardValueOfPair();

    //Ninth Case - If Both Players Have High Card
    //As for Flush... Need to iterate through the Sorted values of humanCard1, humanCard2, flopCard1, flopCard2, flopCard3, turnCard & riverCard until a winner is declared.

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////Similarly Work out the Computer's Hands////////////////////////////////////////////////////////////////////////////////

    // A hunman's 'hand' will be determined by finding the highest value of possible hands that s/he could have by looking at a combination of cards from the array and scoring it against criteria for each hand type.
    // Possible arrays of cards values that we need to consider are sorted by descending value to make their analysis easier:-
    var computerSortedCombinationCardValues1 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues2 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues3 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues4 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues5 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues6 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues7 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues8 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues9 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues10 = [deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues11 = [deckOfCards[computerCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues12 = [deckOfCards[computerCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues13 = [deckOfCards[computerCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues14 = [deckOfCards[computerCard1].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues15 = [deckOfCards[computerCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues16 = [deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues17 = [deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues18 = [deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues19 = [deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues20 = [deckOfCards[computerCard2].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardValues21 = [deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value].sort(function(a, b) {return b-a;});

    //This is a useful log which shows all the card values in all the combinaiton arrays
    //console.log(computerSortedCombinationCardValues1, computerSortedCombinationCardValues2, computerSortedCombinationCardValues3, computerSortedCombinationCardValues4, computerSortedCombinationCardValues5, computerSortedCombinationCardValues6, computerSortedCombinationCardValues7, computerSortedCombinationCardValues8, computerSortedCombinationCardValues9, computerSortedCombinationCardValues10, computerSortedCombinationCardValues11, computerSortedCombinationCardValues12, computerSortedCombinationCardValues13, computerSortedCombinationCardValues14, computerSortedCombinationCardValues15, computerSortedCombinationCardValues16, computerSortedCombinationCardValues17, computerSortedCombinationCardValues18, computerSortedCombinationCardValues19, computerSortedCombinationCardValues20, computerSortedCombinationCardValues21);

    // Similarly, we need to know the suited values of the cards so that we can check for a flush, a stright flush and a Royal Flush:-
    var computerSortedCombinationCardSuits1 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits2 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits3 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits4 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits5 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits6 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits7 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits8 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits9 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits10 = [deckOfCards[computerCard1].suit, deckOfCards[computerCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits11 = [deckOfCards[computerCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits12 = [deckOfCards[computerCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits13 = [deckOfCards[computerCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits14 = [deckOfCards[computerCard1].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits15 = [deckOfCards[computerCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits16 = [deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits17 = [deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits18 = [deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits19 = [deckOfCards[computerCard2].suit, deckOfCards[flopCard1].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits20 = [deckOfCards[computerCard2].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});
    var computerSortedCombinationCardSuits21 = [deckOfCards[flopCard1].suit, deckOfCards[flopCard2].suit, deckOfCards[flopCard3].suit, deckOfCards[turnCard].suit, deckOfCards[riverCard].suit].sort(function(a, b) {return b-a;});

    //This is a useful log which shows all the card suits in all the computer combinaiton arrays
    //console.log(computerSortedCombinationCardSuits1, computerSortedCombinationCardSuits2, computerSortedCombinationCardSuits3, computerSortedCombinationCardSuits4, computerSortedCombinationCardSuits5, computerSortedCombinationCardSuits6, computerSortedCombinationCardSuits7, computerSortedCombinationCardSuits8, computerSortedCombinationCardSuits9, computerSortedCombinationCardSuits10, computerSortedCombinationCardSuits11, computerSortedCombinationCardSuits12, computerSortedCombinationCardSuits13, computerSortedCombinationCardSuits14, computerSortedCombinationCardSuits15, computerSortedCombinationCardSuits16, computerSortedCombinationCardSuits17, computerSortedCombinationCardSuits18, computerSortedCombinationCardSuits19, computerSortedCombinationCardSuits20, computerSortedCombinationCardSuits21);

    //Use these two arrays for testing... they overwrite the arrays above...
    // computerSortedCombinationCardValues1 = [12,11,10,9,8];
    // computerSortedCombinationCardValues2 = [5,4,3,2,1];
    // computerSortedCombinationCardSuits1 = [1,1,1,1,1];
    //computerSortedCombinationCardSuits2 = [2,2,2,2,2];

    //This is a variable containing the arrays of all the sorted card values (above) for all permutations for the computer
    var allComputerSortedCombinationCardValues = [computerSortedCombinationCardValues1, computerSortedCombinationCardValues2, computerSortedCombinationCardValues3, computerSortedCombinationCardValues4, computerSortedCombinationCardValues5, computerSortedCombinationCardValues6, computerSortedCombinationCardValues7, computerSortedCombinationCardValues8, computerSortedCombinationCardValues9, computerSortedCombinationCardValues10, computerSortedCombinationCardValues11, computerSortedCombinationCardValues12, computerSortedCombinationCardValues13, computerSortedCombinationCardValues14, computerSortedCombinationCardValues15, computerSortedCombinationCardValues16, computerSortedCombinationCardValues17, computerSortedCombinationCardValues18, computerSortedCombinationCardValues19, computerSortedCombinationCardValues20, computerSortedCombinationCardValues21];

    //This is a variable containing the arrays of all the sorted suit values (above) for all permutations for the computer
    var allComputerSortedCombinationCardSuits = [computerSortedCombinationCardSuits1, computerSortedCombinationCardSuits2, computerSortedCombinationCardSuits3, computerSortedCombinationCardSuits4, computerSortedCombinationCardSuits5, computerSortedCombinationCardSuits6, computerSortedCombinationCardSuits7, computerSortedCombinationCardSuits8, computerSortedCombinationCardSuits9, computerSortedCombinationCardSuits10, computerSortedCombinationCardSuits11, computerSortedCombinationCardSuits12, computerSortedCombinationCardSuits13, computerSortedCombinationCardSuits14, computerSortedCombinationCardSuits15, computerSortedCombinationCardSuits16, computerSortedCombinationCardSuits17, computerSortedCombinationCardSuits18, computerSortedCombinationCardSuits19, computerSortedCombinationCardSuits20, computerSortedCombinationCardSuits21];



    //highCardChecker. Checks for the highest value card in the array of all cards. Uses the cardsSelected outcome.
    var computerHighCardChecker = function() {
      computerHighestCard = Math.max(deckOfCards[computerCard1].value, deckOfCards[computerCard2].value, deckOfCards[flopCard1].value, deckOfCards[flopCard2].value, deckOfCards[flopCard3].value, deckOfCards[turnCard].value, deckOfCards[riverCard].value);
    };

    //FUNCTIONS THAT TAKE THE ARRAYS AND EVALUATE THEM FOR THE MADE HANDS
    //
    //

    //Function to see if there are Four Of A Kind arrays when called with the allComputerSortedCombinationCardValues array. Uses the fourOfAKindChecker function.
    var isFourOfAKindComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(fourOfAKindChecker(array[i])) {
          computerFourOfAKindHands.push(array[i]);
          // console.log(array[i]+' is a Four Of A Kind');
        }
      }
    };
    isFourOfAKindComputer(allComputerSortedCombinationCardValues);
    console.log('Computer has '+computerFourOfAKindHands.length+' Four Of A Kind arrays');
    console.log(computerFourOfAKindHands);

    //Function to see if there are Full House arrays when called with the allComputerSortedCombinationCardValues array. Uses the fullHouseChecker function.
    var isFullHouseComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(fullHouseChecker(array[i])) {
          computerFullHouseHands.push(array[i]);
          // console.log(array[i]+' is a Full House');
        }
      }
    };
    isFullHouseComputer(allComputerSortedCombinationCardValues);
    console.log('Computer has '+computerFullHouseHands.length+' Full House arrays');
    console.log(computerFullHouseHands);

    //Function to see if there are Flush arrays when called with the allComputerSortedCombinationCardSuits array. Uses the flushChecker function.
    var isFlushComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(flushChecker(array[i])) {
          computerFlushHands.push(array[i]);
          console.log(array[i]+' computer has a flush');
        }
      }
    };
    isFlushComputer(allComputerSortedCombinationCardSuits);
    console.log('Computer has '+computerFlushHands.length+' Flush arrays');
    console.log(computerFlushHands);

    //Function to see if there are Straight arrays when called with the allComputerSortedCombinationCardValues array. Uses the straightChecker function.
    var isStraightComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(straightChecker(array[i])) {
          computerStraightHands.push(array[i]);
          // console.log(array[i]+' is a Four Of A Kind');
        }
      }
    };
    isStraightComputer(allComputerSortedCombinationCardValues);
    console.log('Computer has '+computerStraightHands.length+' Straight arrays');
    console.log(computerStraightHands);

    //Function to see if there are Striaght Flush arrays when called with BOTH allComputerSortedCombinationCardValues and allComputerSortedCombinationCardSuits
    var isStraightFlushComputer = function(array1, array2) {
      for (var i=0;i<array1.length;i++) {
        if(straightFlushChecker(array1[i], array2[i])) {
          computerStraightFlushHands.push(array1[i], array2[i]);
          // console.log(array[i]+' is a Four Of A Kind');
        }
      }
    };
    //And a Royal Flush can therefore be established if any of those computerStraightFlushHands contain an Ace. Can be done seperately.

    isStraightFlushComputer(allComputerSortedCombinationCardValues, allComputerSortedCombinationCardSuits);
    console.log('Computer has '+computerStraightFlushHands.length+' Straight Flush arrays');
    console.log(computerStraightFlushHands);


    //Function to see if there are Three Of A Kind arrays when called with the allComputerSortedCombinationCardValues array. Uses the threeOfAKindChecker function.
    var isThreeOfAKindComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(threeOfAKindChecker(array[i])) {
          computerThreeOfAKindHands.push(array[i]);
          // console.log(array[i]+' is a Three Of A Kind');
        }
      }
    };
    isThreeOfAKindComputer(allComputerSortedCombinationCardValues);
    console.log('Computer has '+computerThreeOfAKindHands.length+' Three Of A Kind arrays');
    console.log(computerThreeOfAKindHands);

    //Function to see if there are Two Pairs in an array when called with the allComputerSortedCombinationCardValues array. Uses the twoPairChecker function.
    var isTwoPairComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(twoPairChecker(array[i])) {
          computerTwoPairHands.push(array[i]);
          // console.log(array[i]+' is Two Pairs');
        }
      }
    };
    isTwoPairComputer(allComputerSortedCombinationCardValues);
    console.log('Computer has '+computerTwoPairHands.length+' Two Pair arrays');
    console.log(computerTwoPairHands);

    //Function to see if there is a Pair in an array when called with the allComputerSortedCombinationCardValues array. Uses the pairChecker function.
    var isPairComputer = function(array) {
      for (var i=0;i<array.length;i++) {
        if(pairChecker(array[i])) {
          computerPairedHands.push(array[i]);
          // console.log(array[i]+' is Two Pairs');
        }
      }
    };
    isPairComputer(allComputerSortedCombinationCardValues);
    console.log('Computer has '+computerPairedHands.length+' Paired arrays');
    console.log(computerPairedHands);

    //Function to see what the highest card is within an array. Called with the allComputerSortedCombinationCardValues array. Uses the highCardChecker function
    computerHighCardChecker();
    console.log("Computer's Highest Card is: "+computerHighestCard);
    // console.log('High Card is 'Math.max(computerCard1));



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //So what if two players both had the same hand type? We will need to compare a secondary value to determine the winner. We need to look into
    //the values of the hands arrays to find the highest value of whatever and give them a secondary scoring value...

    // First Case - both players have a Straight Flush but one has a higher Straight Flush
    computerHighestCardOfAStraightFlush = function() {
      for (var i=0;i<computerStraightFlushHands.length;i++) {
        if (computerStraightFlushHands[i][0] > computerHighestCardValueInAStraightFlush) {
          computerHighestCardValueInAStraightFlush = computerStraightFlushHands[i][0];
          console.log('Computer has high card value of '+computerHighestCardValueInAStraightFlush+' in a Straight Flush');
        }
      }
    };
    computerHighestCardOfAStraightFlush();

    // Second Case - both players have Four Of A Kind but one has a higher Four Of A Kind
    computerCardValueOfFourOfAKind = function() {
      for (var i=0;i<computerFourOfAKindHands.length;i++) {
        if (computerFourOfAKindHands[i][2] > computerHighestCardValueInAFourOfAKind) {
          computerHighestCardValueInAFourOfAKind = computerFourOfAKindHands[i][2];
          console.log('Computer has high card value of '+computerHighestCardValueInAFourOfAKind+' in Four Of A Kind');
        }
      }
    };
    computerCardValueOfFourOfAKind();

    //Third Case - both players have a Full house
    computerCardValueOfFullHouse = function() {
      for (var i=0;i<computerFullHouseHands.length;i++) {
        if (computerFullHouseHands[i][2] > computerHighestCardValueInAFullHouse) {
          computerHighestCardValueInAFullHouse = computerFullHouseHands[i][2];
          console.log('Computer has high card value of '+computerHighestCardValueInAFullHouse+' in a Full House');
        }
      }
    };
    computerCardValueOfFullHouse();

    //Fourth Case - both players have a Flush - needs some thinking... Need to look at the suit value of the flush and then filter all cards within the array computerCard1, computerCard2, flopCard1, flopCard2, flopCard3, turnCard & riverCard and find the highest value. If still a draw then look at the next highest value and so on until a winner.
    computerHighCardValueInAFlush = function () {
      if (computerFlushHands.length > 0) {
        var valueOfSuitInFlush = computerFlushHands[0][0];
        console.log('Value of Suit In Flush is '+valueOfSuitInFlush);
        if (deckOfCards[computerCard1].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[computerCard1].value);
        }
        if (deckOfCards[computerCard2].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[computerCard2].value);
        }
        if (deckOfCards[flopCard1].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[flopCard1].value);
        }
        if (deckOfCards[flopCard2].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[flopCard2].value);
        }
        if (deckOfCards[flopCard3].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[flopCard3].value);
        }
        if (deckOfCards[turnCard].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[turnCard].value);
        }
        if (deckOfCards[riverCard].suit === valueOfSuitInFlush) {
          computerFlushCardValues.push(deckOfCards[riverCard].value);
        }
        computerFlushCardValues.sort(function(a, b) {return b-a;});
        console.log(computerFlushCardValues);
        console.log('Computer has a Flush. '+computerFlushCardValues[0]+' high');
      }
    };
    computerHighCardValueInAFlush();

    //Fifth Case - both players have a straight.
    computerCardValueOfAStraight = function() {
      for (var i=0;i<computerStraightHands.length;i++) {
        if (computerStraightHands[i][0] > computerHighestCardValueInAStraight) {
          computerHighestCardValueInAStraight = computerStraightHands[i][0];
          console.log('Computer has high card value of '+computerHighestCardValueInAStraight+' in a Straight');
        }
      }
    };
    computerCardValueOfAStraight();

    //Sixth Case - both players have Three Of A Kind
    computerCardValueOfThreeOfAKind = function() {
      for (var i=0;i<computerThreeOfAKindHands.length;i++) {
        if (computerThreeOfAKindHands[i][2] > computerHighestCardValueInThreeOfAKind) {
          computerHighestCardValueInThreeOfAKind = computerThreeOfAKindHands[i][2];
          console.log('Computer has high card value of '+computerHighestCardValueInThreeOfAKind+' in Three Of A Kind');
        }
      }
    };
    computerCardValueOfThreeOfAKind();

    //Seventh Case - If Both Players Have Two Pair!
    computerCardValueOfFirstPairInTwoPair = function () {
      for (var i=0;i<computerTwoPairHands.length;i++) {
        if (computerTwoPairHands[i][1] > computerHighestCardValueInFirstPairInTwoPair) {
          computerHighestCardValueInFirstPairInTwoPair = computerTwoPairHands[i][1];
          console.log('Computer has first pair value of '+computerHighestCardValueInFirstPairInTwoPair+' in Two Pairs');
        }
      }
    };
    computerCardValueOfFirstPairInTwoPair();

    computerCardValueOfSecondPairInTwoPair = function () {
      for (var i=0;i<computerTwoPairHands.length;i++) {
        if (computerTwoPairHands[i][3] > computerHighestCardValueInSecondPairInTwoPair) {
          computerHighestCardValueInSecondPairInTwoPair = computerTwoPairHands[i][3];
          console.log('Computer has second pair value of '+computerHighestCardValueInSecondPairInTwoPair+' in Two Pairs');
        }
      }
    };
    computerCardValueOfSecondPairInTwoPair();

    //Eighth Case - If Both Players Have One Pair
    computerCardValueOfPair = function () {
      for (var i=0;i<computerPairedHands.length;i++) {
        if (computerPairedHands[i][0] === computerPairedHands[i][1]) {
          computerHighestCardValueInPair = computerPairedHands[i][0];
          console.log('Computer has pair value of '+computerHighestCardValueInPair+' in a Pair');
        } else if (computerPairedHands[i][1] === computerPairedHands[i][2]) {
          computerHighestCardValueInPair = computerPairedHands[i][1];
          console.log('Computer has pair value of '+computerHighestCardValueInPair+' in a Pair');
        } else if (computerPairedHands[i][2] === computerPairedHands[i][3]) {
          computerHighestCardValueInPair = computerPairedHands[i][2];
          console.log('Computer has pair value of '+computerHighestCardValueInPair+' in a Pair');
        } else if (computerPairedHands[i][3] === computerPairedHands[i][4]) {
          computerHighestCardValueInPair = computerPairedHands[i][3];
          console.log('Computer has pair value of '+computerHighestCardValueInPair+' in a Pair');
        }
      }
    };
    computerCardValueOfPair();

    //Ninth Case - If Both Players Have High Card
    //As for Flush... Need to iterate through the Sorted values of humanCard1, humanCard2, flopCard1, flopCard2, flopCard3, turnCard & riverCard until a winner is declared.

    //Notes here on edits still required to perfect the game: Need to cater for the last card in the Four of A Kind Array - can be done by finding the highest value of the sum of the contents of each array as the only other card will be the non FOAK.

    //This is where we will calculate the player's hand values
    var humanHandValueCalculator = function () {
      if (humanHighestCardValueInAStraightFlush === 14) {
        humanHandScore = 100000000000;
        humanHasRoyalFlush = 1;
      } else if (humanHighestCardValueInAStraightFlush !==0) {
        humanHandScore = 10000000000 + humanHighestCardValueInAStraightFlush;
      } else if (humanHighestCardValueInAFourOfAKind !==0) {
        humanHandScore = 1000000000 + humanHighestCardValueInAFourOfAKind*1000;
      } else if (humanHighestCardValueInAFullHouse !==0) {
        humanHandScore = 100000000 + humanHighestCardValueInAFullHouse;
      } else if (humanFlushCardValues.length !==0) {
        humanHandScore = 10000000 + 100000*humanFlushCardValues[0] + 10000*humanFlushCardValues[1]+1000*humanFlushCardValues[2]+100*humanFlushCardValues[3]+10*humanFlushCardValues[4];
      } else if (humanHighestCardValueInAStraight !==0) {
        humanHandScore = 1000000 + humanHighestCardValueInAStraight;
      } else if (humanHighestCardValueInThreeOfAKind !==0) {
        humanHandScore = 100000 + 1000*humanHighestCardValueInThreeOfAKind;
      } else if (humanHighestCardValueInFirstPairInTwoPair !==0) {
        humanHandScore = 10000 + 100*humanHighestCardValueInFirstPairInTwoPair +10*humanHighestCardValueInSecondPairInTwoPair;
      } else if (humanHighestCardValueInPair !==0) {
        humanHandScore = 1000 + 100*humanHighestCard;
      } else if (humanHighestCard !==0) {
        humanHandScore = 100*humanSortedCardsArray[0]+50*humanSortedCardsArray[1]+20*humanSortedCardsArray[2]+10*humanSortedCardsArray[3]+humanSortedCardsArray[4];
      }
    };
    humanHandValueCalculator();

    var computerHandValueCalculator = function () {
      if (computerHighestCardValueInAStraightFlush === 14) {
        computerHandScore = 100000000000;
        computerHasRoyalFlush = 1;
      }
      else if (computerHighestCardValueInAStraightFlush !==0) {
        computerHandScore = 10000000000 + computerHighestCardValueInAStraightFlush;
      }
      else if (computerHighestCardValueInAFourOfAKind !==0) {
        computerHandScore = 1000000000 + computerHighestCardValueInAFourOfAKind*1000;
      }
      else if (computerHighestCardValueInAFullHouse !==0) {
        computerHandScore = 100000000 + computerHighestCardValueInAFullHouse;
      }
      else if (computerFlushCardValues.length !==0) {
        computerHandScore = 10000000 + 100000*computerFlushCardValues[0] + 10000*computerFlushCardValues[1]+1000*computerFlushCardValues[2]+100*computerFlushCardValues[3]+10*computerFlushCardValues[4];
      }
      else if (computerHighestCardValueInAStraight !==0) {
        computerHandScore = 1000000 + computerHighestCardValueInAStraight;
      } else if (computerHighestCardValueInThreeOfAKind !==0) {
        computerHandScore = 100000 + 1000*computerHighestCardValueInThreeOfAKind;
      } else if (computerHighestCardValueInFirstPairInTwoPair !==0) {
        computerHandScore = 10000 + 100*computerHighestCardValueInFirstPairInTwoPair +10*computerHighestCardValueInSecondPairInTwoPair;
      } else if (computerHighestCardValueInPair !==0) {
        computerHandScore = 1000 + 100*computerHighestCard;
      } else if (computerHighestCard !==0) {
        computerHandScore = 100*computerHighestCard;
      }
    };
    computerHandValueCalculator();

    console.log(computerHighestCardValueInPair);

    //// Log Scores
    console.log('Human Hand Score = '+humanHandScore);
    console.log('Computer Hand Score = '+computerHandScore);

    var handWinnerFunction = function () {
      if (humanHandScore > computerHandScore) {
        handWinner =  'Human';
      }
      else {
        handWinner = 'Computer';
      }
    };
    handWinnerFunction();

    console.log(handWinner +' is the winner!');


    //New hand closes
  };
  newHand();
});

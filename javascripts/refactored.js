$(document).ready(function () {

  var newgame;

  $('#new-game').on('click', function () {
    $(this).hide();
    $('#guess-button, #hint').attr('disabled', false);
    $('#give-up, #hint, #keyboard').fadeIn(200);
    $('#messages').fadeIn().text('').removeClass('green-bg').removeClass('red-bg');
    $('#guessed-letters').text('');
    $('#smile').hide();
    $('#guy, #torso, #head, #left-arm, #left-leg, #right-arm, #right-leg, #eyes, #right-ear, #left-ear, #frown').show();
    newgame = new app.Game();
  });

  
    $(document).on('keyup', function (stuff) { 
      if (newgame.inprogress === true) {
        var input_code = String.fromCharCode(stuff.which);
        var letter_input = input_code.toLowerCase();

        if ( letter_input.match(/[a-z]/) ) {
          newgame.guess(letter_input); 
        }else{
          $('#messages').text('please enter a letter between a-z!').removeClass('green-bg').addClass('red-bg');
        }
      }
    });

  $('#give-up').on('click', function () { newgame.giveUp(); });
  $('#hint').on('click', function () { newgame.hint(); });

});

var app = {

  Game: function () {

    var self = this;
    self.inprogress = true;
    self.guessedletters = [];

    var dictionary = ['cookies', 'nutella', 'waffles', 'pancakes', 'candy', 'pasta', 'bagels', 'lobster', 'cheeseburgers'];
    $('#hidden-stuff').fadeIn(200);
    var randNum = Math.floor((Math.random() * dictionary.length));
    self.answer = dictionary[randNum];

    var blanks_array = [];
    for (var i = 0; i < self.answer.length; i++) { blanks_array.push('_'); }
    self.blanks = blanks_array;
    $('#blanks').text(blanks_array.join(' '));

    self.tries = 8;
    $('#tries').text(self.tries + ' tries left');


    self.guess = function (letter_input) {

        if ( self.guessedletters.indexOf(letter_input) != -1 ) {
              $('#messages').text('you already guessed the letter ' + letter_input + '!').removeClass('green-bg').addClass('red-bg')

        }else{    

          if (self.answer.indexOf(letter_input) === -1) {

          $('#messages').text('sorry, the letter "' + letter_input + '" is not in this word').removeClass('green-bg').addClass('red-bg');
          self.tries--

          $('#tries').text(self.tries + ' tries left');

          self.guessedletters.push(letter_input);
          $('#guessed-letters').html('incorrect letters: <span style="color:#d2322d;">' + self.guessedletters.join(', ') + '</span>');

          if (self.tries === 7) {
            $('#left-arm').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 6){
            $('#right-ear').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 5){
            $('#right-arm').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 4){
            $('#left-leg').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 3){
            $('#left-ear').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 2){
            $('#right-leg').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 1){
            $('#torso').toggle('explode', {pieces: 25}, 500).hide();
          }else if (self.tries === 0) {
            $('#head').toggle('explode', {pieces: 25}, 500).hide();
            self.gameOver();
          }

        }else{

      for (var i = 0; i < self.answer.length; i++) {
        if (self.answer[i] === letter_input) {
          self.blanks[i] = letter_input;
          $('#messages').text('the letter "' + letter_input + '" is in this word!').removeClass('red-bg').addClass('green-bg');
        }
      }

      self.blanksUpdate();

      }
    }
    }

    self.blanksUpdate = function () {
      var blanks_update = self.blanks.join(' ');
      $('#blanks').text(blanks_update);
      self.verifySolution()
    }

    self.verifySolution = function () {
      var blanks_array = self.blanks.join('');
      if (blanks_array === self.answer) {
        $('#messages').removeClass('red-bg').addClass('green-bg');
        self.youWin();
      }
    }

    self.hint = function () {
      $('#hint').attr('disabled', true);
      var blanks_indexes = [];
      for (var i = 0; i < self.blanks.length; i++) {
        if ( self.blanks[i] === '_' ) { 
          blanks_indexes.push(i); 
        }
      }

      var randomnumber = Math.floor( Math.random() * blanks_indexes.length );
      var random_index = blanks_indexes[randomnumber];
      var random_index_letter = self.answer[random_index];
      self.blanks[random_index] = random_index_letter;
      self.blanksUpdate();
    }

    self.youWin = function () {
      $('#frown').hide();
      $('#guy, #torso, #head, #left-arm, #left-leg, #right-arm, #right-leg, #eyes, #smile, #left-ear, #right-ear').show();
      self.inprogress = false;
      $('#messages').text('congrats, you solved it!');
      self.resetStuff();
    }

    self.gameOver = function () {
      self.inprogress = false;
      $('#messages').html('sorry, you are out of tries.<br> The answer was <b>"' + self.answer + '"</b>');
      self.resetStuff();
    }

    self.giveUp = function () {
      self.inprogress = false;
      self.tries = 0;
      $('#tries').text(self.tries + ' tries left');
      $('#messages').html('The answer was <b>"' + self.answer + '"</b>');
      $('#head, #right-ear, #left-ear').toggle('explode', {pieces: 25}, 500)
      self.resetStuff();
    }


    self.resetStuff = function () {
      $('#guess-button').attr('disabled', true);
      $('#give-up, #hint, #keyboard').hide();
      $('#new-game').fadeIn();
    }

}

}

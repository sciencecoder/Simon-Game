var buttons = {
  //Green button
  0: '#green-quarter',
  //Red button
  1: '#red-quarter',
  //Yellow button
  2: '#yellow-quarter',
  //Blue button
  3: '#blue-quarter'
};

function randomButton() {
  return Math.floor((Math.random() * 4));
}

function showPointer() {
  $('.game-button').addClass('cursor');
}

function hidePointer() {
  $('.game-button').removeClass('cursor');
}
$('#start').on('click', function() {
  game.reset();

});

var game = {
  steps: [],
  completedSteps: [],
  currBtnIndex: 0,
  strict: false,
  canClickBtn: false,

  enableClick: function(index, length) {
    setTimeout(function() {
      showPointer();
      game.canClickBtn = true;

    }, ((index + 1) * length) - (index * 1250));

  },

  blink: function() {

    //Source: https://en.wikipedia.org/wiki/Blink_element
    this.canClickBtn = false;
    hidePointer();
    var x = setInterval(function() {
      $('#count-text').each(function() {
        $(this).css('visibility', $(this).css('visibility') === 'hidden' ? '' : 'hidden');
      });
    }, 250);
    //End code snippet.
    setTimeout(function() {

      clearInterval(x);
      $('#count-text').css("visibility", "visible");
    }, 2000);

  },

  resetColor: function(btn, time) {
    setTimeout(function() {
      $(btn).removeClass('green-hover red-hover yellow-hover blue-hover');
    }, time);
  },

  showStep: function(btn, num) {

    if (btn === buttons[0]) {

      $(btn).addClass('green-hover');
      document.getElementById('sound1').play();
      this.resetColor(btn, num);
      return 'green-hover';
    } else if (btn === buttons[1]) {

      $(btn).addClass('red-hover');
      document.getElementById('sound2').play();
      this.resetColor(btn, num);
      return 'red-hover';
    } else if (btn === buttons[2]) {

      $(btn).addClass('yellow-hover');
      document.getElementById('sound3').play();
      this.resetColor(btn, num);
      return 'yellow-hover';
    } else if (btn === buttons[3]) {

      $(btn).addClass('blue-hover');
      document.getElementById('sound4').play();
      this.resetColor(btn, num);
      return 'blue-hover';
    }
  },

  updateText: function(time) {
    setTimeout(function() {
      var number = game.steps.length;
      if (number < 10) {
        $('#count-text').text('0' + number);
      } else {
        $('#count-text').text(number);
      }
    }, time);
  },

  resetCompletedSteps: function() {
    this.completedSteps = [];
    this.currBtnIndex = 0;
  },

  reset: function(btn) {
    hidePointer();
    this.steps = [];
    this.resetCompletedSteps();
    this.canClickBtn = false;
    $('#count-text').text('--');
    setTimeout(function() {
      $('#count-text').text('01');
    }, 2000);

    this.addStep(buttons[randomButton()]);
  },

  addStep: function(btn) {
    hidePointer();
    this.canClickBtn = false;
    this.steps.push(btn);
    var indexOfLastBtn = this.steps.lastIndexOf(btn);
    this.playStep(indexOfLastBtn, 2000);
    this.enableClick(indexOfLastBtn, 3250);
  },

  playStep: function(i, time) {
  
    //Source: http://stackoverflow.com/questions/5226285/settimeout-in-for-loop-does-not-print-consecutive-values
    setTimeout(function() {
      game.showStep(game.steps[i], 1250);
    }, ((i + 1) * time) - (i * 20));
    //End code snippet.
  },

  playSteps: function() {
    hidePointer();
    this.canClickBtn = false;
    this.playStep(0, 2500);

    for (var i = 1; i < this.steps.length; i++) {

      this.playStep(i, 2000);

    }
  },

  showPattern: function() {
    this.updateText(2500);
    this.playSteps();
    this.resetCompletedSteps();
  },

  notifyVictory: function() {
    this.canClickBtn = false;
    hidePointer();
    setTimeout(function() {
      $('#count-text').text('**');
      game.blink();
      game.showStep(buttons[0], 1250);
    }, 2000);

    setTimeout(function() {
      game.showStep(buttons[1], 1250);
    }, 3500);

    setTimeout(function() {
      game.showStep(buttons[3], 1250);
    }, 5000);
    setTimeout(function() {
      game.showStep(buttons[2], 1250);
    }, 6500);

  },

  update: function(btn) {

    if (this.completedSteps.length === 20) {

      this.notifyVictory();
      setTimeout(function() {
        game.reset();
      }, 8500);

    } else if (this.steps.length < 20) {

      this.showPattern();
      this.addStep(buttons[randomButton()]);
      console.log(this.steps);
    }

  },

  checkPlayerClick: function(btn) {
    var id = '#' + btn;
    var currentBtn = this.steps[this.currBtnIndex];

    if (id === currentBtn) {
      this.showStep(id, 800);
      this.currBtnIndex += 1;
      this.completedSteps.push(id);
      if (game.completedSteps.toString() === game.steps.toString()) {
        this.update();
      }

    } else if (id !== currentBtn) {
      if (this.strict) {
        $('#count-text').text('!!');
        this.blink();
        setTimeout(function() {
          game.reset();
        }, 3000);

      } else {

        this.showStep('#' + btn, 800);
        $('#count-text').text('!!');
        this.blink();
        this.showPattern();
        this.enableClick(this.steps.length - 1, 3250);
        console.log(this.steps);
      }
    }

  }
};
$('#start').on('click', function() {
  game.reset();
});

$('#strict').on('click', function() {

  game.strict = !game.strict;
  if (game.strict) {
    $('.strict-light').addClass('strict-active');
  } else $('.strict-light').removeClass('strict-active');
});

$('.game-button').on('click', function() {
  if (game.canClickBtn) {
    game.checkPlayerClick($(this).attr('id'));

  }

});

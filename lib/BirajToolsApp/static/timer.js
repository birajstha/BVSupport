window.onload = function() {
    var startTime;
    var timerInterval;
  
    function startTimer() {
      startTime = new Date().getTime();
      timerInterval = setInterval(updateTimer, 1000);
    }
  
    function updateTimer() {
      var currentTime = new Date().getTime();
      var timeDifference = currentTime - startTime;
  
      var hours = Math.floor(timeDifference / (1000 * 60 * 60));
      var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
      var formattedTime = formatTime(hours) + ':' + formatTime(minutes) + ':' + formatTime(seconds);
  
      document.getElementById('timer').innerHTML = formattedTime;
  
      // Set the timer value in the hidden input field
      document.getElementById('timerValue').value = formattedTime;
    }
  
    function formatTime(time) {
      return time < 10 ? '0' + time : time;
    }
  
    startTimer();
  
    // Submit the form when the page is exited or unloaded
    window.onbeforeunload = function() {
      clearInterval(timerInterval);
  
      // Trigger the form submission
      document.querySelector('form').submit();
    };
  };
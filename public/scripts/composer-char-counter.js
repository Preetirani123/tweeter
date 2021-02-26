$(document).ready(function() {
  
  $("#tweet-text").on('keyup keypress blur change' ,function(event) {
    $text = $(this).val();
    $charsLeft = 140 - $text.length;
    $counter = $(this).closest("form").find(".counter");
    $counter.text($charsLeft);

    // Remaining text is in negative then add the class name
    if ($charsLeft < 0) {
      $counter.addClass("redColor");
    } else {
      $counter.removeClass("redColor");
    }

  });
});
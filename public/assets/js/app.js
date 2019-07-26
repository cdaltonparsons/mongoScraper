$("#showSongs").on("click", function(event) {
  event.preventDefault();
  $.get("/songs").then(function(data) {
    $("#song-card-column").empty();

    for (var i = 0; i < data.length; i++) {
      console.log(data[i]);
      var cardBody = $("<div>").addClass("card-body");
      var addNoteBtn = $("<a>")
        .addClass("btn btn-secondary btn-sm contact-btn")
        .attr("role", "button")
        .attr("id", "add-note")
        .attr("data-id", data[i]._id)
        .text("Add a note");
      var song = $("<h4>")
        .addClass("card-title")
        .text(data[i].title);
      var artist = $("<h4>")
        .addClass("card-title")
        .text(data[i].artist);
      var img = $("<img>")
        .attr("src", data[i].img)
        .attr("style", "max-width: 20rem;");
      var cardStyleDiv = $("<div>")
        .addClass("card text-white bg-info mb-3")
        .attr("style", "max-width: 30rem;");

      $(cardBody).prepend(addNoteBtn);
      $(cardBody).prepend(img);
      $(cardBody).prepend(artist);
      $(cardBody).prepend(song);
      $(cardStyleDiv).prepend(cardBody);
      $("#song-card-column").prepend(cardStyleDiv);
    }
  });
});


$("#clearSongs").on("click", function(){
    $.ajax({
        method: "PUT",
        url: "/clear"
}).then(function(data) {
    console.log("Database cleared")
});
$("#song-card-column").empty();
});

$("#scrape").on("click", function(event) {
  $.get("/scrape").then(function(data) {
    console.log("successfully scraped");
  });
});

$(document).on("click", "#add-note", function() {
  $("#note-column").empty();
  var thisId = $(this).attr("data-id");

  $.get("/songs/" + thisId)
  .then(function(data) {
    console.log(data);
    // create the note card
    var cardBody = $("<div>").addClass("card-body").attr("id", "noteCard");
    var song = $("<h2>")
      .addClass("card-title")
      .text(data.title);
    var noteTitle = $("<input>").addClass("sticky-top")
      .attr("id", "titleinput")
      .attr("name", "title");
    var noteBody = $("<textarea>")
      .attr("id", "bodyinput")
      .attr("name", "body");
    var noteButton = $("<a>")
      .addClass("btn btn-secondary btn-sm")
      .attr("role", "button")
      .attr("data-id", data._id)
      .attr("id", "saveNote")
      .text("Save note");
    var cardStyleDiv = $("<div>")
      .addClass("card text-white bg-info mb-3 sticky-top")
      .attr("style", "max-width: 30rem;");

    $(cardBody).prepend(noteButton);
    $(cardBody).prepend(noteBody);
    $(cardBody).prepend(noteTitle);
    $(cardBody).prepend(song);
    $(cardStyleDiv).prepend(cardBody);
    $("#note-column").prepend(cardStyleDiv);
// if the song already has note data, display that
    if (data.note) {
      $("#titleinput").val(data.note.title);

      $("#bodyinput").val(data.note.body);
    }
  });
});

$(document).on("click", "#saveNote", function() {

    var thisId = $(this).attr("data-id");
  
    console.log(thisId)
    $.ajax({
      method: "POST",
      url: "/songs/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    }).then(function(data) {
        console.log(data);
        $("#note-column").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  })

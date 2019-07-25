var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SongSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  artist: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Song = mongoose.model("Song", SongSchema);

// Export the Article model
module.exports = Song;

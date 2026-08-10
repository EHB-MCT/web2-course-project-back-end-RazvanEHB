const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const seasonSchema = new mongoose.Schema({
  season: { type: String, required: true },
  sky: { type: String, required: true },
  mood: { type: String, required: true },
  startMonth: { type: Number, min: 1, max: 12, required: true },
  endMonth: { type: Number, min: 1, max: 12, required: true },
  luminosityLevel: { type: Number, min: 0, max: 1 },
  musicTag: { type: String, required: true },
  illustrationTheme: String,
});

module.exports = mongoose.model('Season', seasonSchema);

seasonSchema.plugin(AutoIncrement, { inc_field: 'id' });
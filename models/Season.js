const mongoose = require('mongoose');

const seasonSchema = new mongoose.Schema(
  {
  id: { type: Number, unique: true },
  season: { type: String, required: true },
  sky: { type: String, required: true },
  mood: { type: String, required: true },
  startMonth: { type: Number, min: 1, max: 12, required: true },
  endMonth: { type: Number, min: 1, max: 12, required: true },
  luminosityLevel: { type: Number, min: 0, max: 1 },
  musicTag: { type: String, required: true },
  illustrationTheme: String,
  },
  { id: false }
);

seasonSchema.pre('save', async function () {
    if (this.isNew) {
        const lastSeason = await this.constructor.find().sort({ id: -1 }).limit(1);
        this.id = lastSeason.length > 0 ? lastSeason[0].id + 1 : 1;
    }
});

module.exports = mongoose.model('Season', seasonSchema);
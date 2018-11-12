const mongoose = require('mongoose')

const correctionSchema = mongoose.Schema({
  id: mongoose.Schema.Types.ObjectId,
  receivedCorrections: Number,
  wrongReference: { ref: 'ReferencePoint' },
  correctReference: { ref: 'ReferencePoint' },
  corrections: [{ ref: 'CorrectionEvent' }]
})

module.exports = mongoose.model('Correction', correctionSchema)

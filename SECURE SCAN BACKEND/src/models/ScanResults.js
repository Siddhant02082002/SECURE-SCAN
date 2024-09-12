// models/ScanResult.js
import mongoose from 'mongoose';

const scanResultSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  Informational: {
    count: {
      type: Number,
      required: true
    },
    types: {
      type: [String],
      required: true
    },
    apis: {
      type: [String],
      required: true
    }
  },
  Low: {
    count: {
      type: Number,
      required: true
    },
    types: {
      type: [String],
      required: true
    },
    apis: {
      type: [String],
      required: true
    }
  },
  Medium: {
    count: {
      type: Number,
      required: true
    },
    types: {
      type: [String],
      required: true
    },
    apis: {
      type: [String],
      required: true
    }
  },
  High: {
    count: {
      type: Number,
      required: true
    },
    types: {
      type: [String],
      required: true
    },
    apis: {
      type: [String],
      required: true
    }
  }
});

const ScanResult = mongoose.model('ScanResult', scanResultSchema);

export default ScanResult;

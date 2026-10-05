// AI Categorization & Assistance Service
// Strict Safety Protocol: AI provides suggestions only. It NEVER diagnoses diseases or alters prescriptions.

const CATEGORY_TAXONOMY = {
  Cardiology: {
    keywords: ['cardio', 'ecg', 'ekg', 'heart', 'troponin', 'sinus rhythm', 'echo', 'echocardiogram', 'bp', 'blood pressure', 'hypertension', 'cardiologist', 'telmisartan', 'amlodipine', 'angina'],
    specialist: 'Cardiologist'
  },
  Laboratory: {
    keywords: ['blood', 'cbc', 'lipid', 'cholesterol', 'sugar', 'glucose', 'hemoglobin', 'urine', 'thyroid', 'tsh', 'liver', 'lft', 'kft', 'creatinine', 'platelet', 'pathology', 'pathlab', 'serum', 'hba1c'],
    specialist: 'Pathologist / Clinical Biochemist'
  },
  Radiology: {
    keywords: ['x-ray', 'xray', 'mri', 'ct scan', 'computed tomography', 'ultrasound', 'usg', 'sonography', 'radiology', 'imaging', 'lung fields', 'contrast', 'scan'],
    specialist: 'Radiologist'
  },
  Orthopedics: {
    keywords: ['ortho', 'bone', 'fracture', 'joint', 'knee', 'spine', 'vertebra', 'cast', 'ligament', 'acl', 'cartilage', 'arthritis', 'calcium', 'osteo'],
    specialist: 'Orthopedic Surgeon'
  },
  Dental: {
    keywords: ['dental', 'tooth', 'teeth', 'caries', 'root canal', 'dentist', 'molar', 'gum', 'dentistry', 'orthodontic'],
    specialist: 'Dentist'
  },
  'General Medicine': {
    keywords: ['physician', 'fever', 'cough', 'cold', 'infection', 'pediatric', 'general checkup', 'prescription', 'wellness', 'consultation', 'vitals'],
    specialist: 'General Physician'
  }
};

const suggestCategory = (text, fileName = '') => {
  const combined = `${fileName} ${text}`.toLowerCase();
  
  const scores = {};
  const matchedKeywords = {};

  Object.entries(CATEGORY_TAXONOMY).forEach(([category, data]) => {
    let matchCount = 0;
    const found = [];
    data.keywords.forEach(kw => {
      if (combined.includes(kw)) {
        matchCount++;
        found.push(kw);
      }
    });
    scores[category] = matchCount;
    matchedKeywords[category] = found;
  });

  // Find category with highest score
  let bestCategory = 'Other';
  let maxScore = 0;

  Object.entries(scores).forEach(([cat, score]) => {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = cat;
    }
  });

  // Calculate confidence score (normalized between 0.50 and 0.98)
  let confidence = 0.50;
  let isLowConfidence = false;

  if (maxScore >= 3) {
    confidence = Math.min(0.96, 0.75 + maxScore * 0.05);
  } else if (maxScore === 2) {
    confidence = 0.82;
  } else if (maxScore === 1) {
    confidence = 0.68;
  } else {
    // Zero keyword match
    bestCategory = 'General Medicine';
    confidence = 0.45;
    isLowConfidence = true;
  }

  return {
    suggestedCategory: bestCategory,
    confidence: Number(confidence.toFixed(2)),
    isLowConfidence,
    extractedKeywords: matchedKeywords[bestCategory] || [],
    safetyNotice: "AI categorization is assistive only. User confirmation is required before saving."
  };
};

module.exports = {
  suggestCategory,
  CATEGORY_TAXONOMY
};

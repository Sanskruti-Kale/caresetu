// "What Changed?" Comparison Engine
// Compares two selected health records strictly based on reliably extracted data
// Never extrapolates beyond verifiable text

const compareRecords = (recordA, recordB) => {
  // Determine chronological order (older -> newer)
  const dateA = new Date(recordA.dateOfReport || recordA.createdAt);
  const dateB = new Date(recordB.dateOfReport || recordB.createdAt);

  const older = dateA <= dateB ? recordA : recordB;
  const newer = dateA <= dateB ? recordB : recordA;

  // 1. Compare Medications
  const medsOlder = older.extractedMedications || [];
  const medsNewer = newer.extractedMedications || [];

  const olderNames = medsOlder.map(m => m.name.toLowerCase());
  const newerNames = medsNewer.map(m => m.name.toLowerCase());

  const addedMedications = medsNewer.filter(m => !olderNames.includes(m.name.toLowerCase()));
  const removedMedications = medsOlder.filter(m => !newerNames.includes(m.name.toLowerCase()));
  const continuedMedications = medsNewer.filter(m => olderNames.includes(m.name.toLowerCase()));

  // 2. Compare Extracted Numeric / Clinical Parameters
  const paramsOlder = older.extractedParameters || [];
  const paramsNewer = newer.extractedParameters || [];

  const changedParameters = [];

  paramsNewer.forEach(newP => {
    const oldP = paramsOlder.find(p => p.key.toLowerCase() === newP.key.toLowerCase());
    if (oldP) {
      if (oldP.value !== newP.value) {
        changedParameters.push({
          parameter: newP.key,
          previousValue: oldP.value,
          currentValue: newP.value,
          unit: newP.unit || oldP.unit || '',
          referenceRange: newP.referenceRange || oldP.referenceRange || '',
          changeType: 'modified'
        });
      }
    } else {
      changedParameters.push({
        parameter: newP.key,
        previousValue: 'Not tested / absent',
        currentValue: newP.value,
        unit: newP.unit || '',
        referenceRange: newP.referenceRange || '',
        changeType: 'new_entry'
      });
    }
  });

  // Parameters that were in older but not in newer
  paramsOlder.forEach(oldP => {
    const stillPresent = paramsNewer.some(p => p.key.toLowerCase() === oldP.key.toLowerCase());
    if (!stillPresent) {
      changedParameters.push({
        parameter: oldP.key,
        previousValue: oldP.value,
        currentValue: 'Not repeated in current report',
        unit: oldP.unit || '',
        referenceRange: oldP.referenceRange || '',
        changeType: 'not_repeated'
      });
    }
  });

  return {
    olderRecord: {
      id: older._id,
      title: older.title,
      date: older.dateOfReport,
      doctor: older.doctorName,
      category: older.category
    },
    newerRecord: {
      id: newer._id,
      title: newer.title,
      date: newer.dateOfReport,
      doctor: newer.doctorName,
      category: newer.category
    },
    medications: {
      added: addedMedications,
      removed: removedMedications,
      continued: continuedMedications
    },
    parameterChanges: changedParameters,
    safetyDisclaimer: "This comparison is limited strictly to reliably extracted text. It does not replace medical judgment or professional clinical interpretation."
  };
};

module.exports = {
  compareRecords
};

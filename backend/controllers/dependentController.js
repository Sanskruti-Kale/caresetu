const memoryStore = require('../data/memoryStore');

// Get all dependents for the authorized parent/guardian
exports.getDependents = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const dependents = memoryStore.getDependents(userId);

    res.json({
      success: true,
      count: dependents.length,
      dependents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a child / dependent profile
exports.addDependent = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, relationship, dateOfBirth, gender, bloodGroup, allergies, pediatrician, notes } = req.body;

    if (!name || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Dependent name and date of birth are required.'
      });
    }

    const newDep = memoryStore.createDependent({
      userId,
      name,
      relationship: relationship || 'Child',
      dateOfBirth: new Date(dateOfBirth),
      gender: gender || 'Male',
      bloodGroup: bloodGroup || 'B+',
      allergies: allergies ? (Array.isArray(allergies) ? allergies : allergies.split(',').map(s => s.trim())) : [],
      pediatrician: pediatrician || '',
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: `${newDep.relationship} profile for "${newDep.name}" created under your authorized guardianship.`,
      dependent: newDep
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get vaccination chart for a child
exports.getVaccinations = async (req, res) => {
  try {
    const { dependentId } = req.params;
    const vaccinations = memoryStore.getVaccinations(dependentId);

    res.json({
      success: true,
      count: vaccinations.length,
      vaccinations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update vaccine status (Given / Due / Upcoming)
exports.updateVaccinationStatus = async (req, res) => {
  try {
    const { vaccinationId } = req.params;
    const { status, administeredBy, notes } = req.body;

    const updated = memoryStore.updateVaccinationStatus(vaccinationId, status, administeredBy, notes);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Vaccination record not found.' });
    }

    res.json({
      success: true,
      message: `Vaccination "${updated.vaccineName}" marked as ${status}.`,
      vaccination: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

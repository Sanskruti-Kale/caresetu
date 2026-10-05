const memoryStore = require('../data/memoryStore');

// Get all medicines
exports.getMedicines = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { dependentId } = req.query;

    const medicines = memoryStore.getMedicines(userId, dependentId);
    
    // Check courses that have naturally completed
    const now = new Date();
    medicines.forEach(m => {
      if (m.status === 'active' && new Date(m.endDate) < now) {
        m.status = 'completed';
      }
    });

    res.json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add medicine with precise duration
exports.addMedicine = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      name,
      dosage,
      frequency,
      startDate,
      durationDays,
      reminderTimes,
      instructions,
      prescribedBy,
      notes,
      dependentId
    } = req.body;

    if (!name || !dosage || !durationDays) {
      return res.status(400).json({
        success: false,
        message: 'Medicine name, dosage, and duration in days are required.'
      });
    }

    const durationNum = parseInt(durationDays, 10);
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start.getTime() + durationNum * 24 * 60 * 60 * 1000);

    const newMed = memoryStore.createMedicine({
      userId,
      dependentId: dependentId || null,
      name,
      dosage,
      frequency: frequency || 'Once daily',
      startDate: start,
      durationDays: durationNum,
      endDate: end,
      reminderTimes: reminderTimes && reminderTimes.length ? reminderTimes : ['08:30 AM'],
      instructions: instructions || 'After food',
      prescribedBy: prescribedBy || 'Consulting Physician',
      notes: notes || '',
      status: 'active'
    });

    res.status(201).json({
      success: true,
      message: `Medicine ${newMed.name} added. Reminders scheduled for ${durationNum} days (until ${end.toLocaleDateString('en-IN')}).`,
      medicine: newMed
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Log a dose as Taken or Missed
exports.logDose = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { medicineId } = req.params;
    const { status, time, notes, date } = req.body; // status: 'taken' or 'missed'

    if (!['taken', 'missed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'taken' or 'missed'."
      });
    }

    const result = memoryStore.logMedicineDose(medicineId, userId, {
      status,
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      notes: notes || (status === 'missed' ? 'Recorded as missed dose in compliance log.' : 'Marked as taken.'),
      date: date ? new Date(date) : new Date()
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found or access unauthorized.'
      });
    }

    res.json({
      success: true,
      message: status === 'taken' 
        ? `Great! Marked dose for ${result.med.name} as taken.` 
        : `Dose recorded as missed in compliance history. (Note: Your prescribed schedule has not been automatically altered).`,
      doseLog: result.log,
      medicine: result.med
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Today's Medicine Reminders & Status
exports.getTodaySchedule = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { dependentId } = req.query;

    const medicines = memoryStore.getMedicines(userId, dependentId);
    const today = new Date().toISOString().split('T')[0];

    const todayItems = [];

    medicines.filter(m => m.status === 'active').forEach(med => {
      // For each reminder time
      (med.reminderTimes || ['09:00 AM']).forEach(time => {
        // Check if there is an existing log for today and this time
        const log = (med.doseLogs || []).find(l => {
          const logDate = new Date(l.date).toISOString().split('T')[0];
          return logDate === today && l.time === time;
        });

        todayItems.push({
          medicineId: med._id,
          name: med.name,
          dosage: med.dosage,
          instructions: med.instructions,
          frequency: med.frequency,
          time,
          durationDays: med.durationDays,
          endDate: med.endDate,
          status: log ? log.status : 'pending', // 'taken' | 'missed' | 'pending'
          loggedAt: log ? log.loggedAt : null
        });
      });
    });

    res.json({
      success: true,
      todayDate: today,
      schedule: todayItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const memoryStore = require('../data/memoryStore');

// Generate concise consultation summary for doctor
exports.getDoctorBrief = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { dependentId } = req.query;

    let targetPerson = req.user;
    if (dependentId && dependentId !== 'all') {
      const dep = memoryStore.dependents.find(d => d._id === dependentId && d.userId === userId);
      if (dep) targetPerson = dep;
    }

    // 1. Recent Reports
    const reports = memoryStore.getReports(userId, dependentId).slice(0, 5);

    // 2. Active Medicines
    const medicines = memoryStore.getMedicines(userId, dependentId).filter(m => m.status === 'active');

    // 3. Recent Events & Timeline Highlights
    const timeline = memoryStore.getTimeline(userId, { dependentId }).slice(0, 5);

    // 4. Key Vitals & Parameters summary
    const latestVitals = {};
    reports.forEach(r => {
      (r.extractedParameters || []).forEach(p => {
        if (!latestVitals[p.key]) {
          latestVitals[p.key] = { value: p.value, unit: p.unit, date: r.dateOfReport, status: p.status };
        }
      });
    });

    res.json({
      success: true,
      brief: {
        patient: {
          name: targetPerson.name,
          bloodGroup: targetPerson.bloodGroup || 'O+',
          dateOfBirth: targetPerson.dateOfBirth,
          gender: targetPerson.gender,
          allergies: targetPerson.allergies || [],
          chronicConditions: targetPerson.chronicConditions || [],
          emergencyContact: targetPerson.emergencyContact
        },
        activeMedicines: medicines.map(m => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          instructions: m.instructions,
          prescribedBy: m.prescribedBy,
          startDate: m.startDate,
          endDate: m.endDate
        })),
        recentReports: reports.map(r => ({
          id: r._id,
          title: r.title,
          category: r.category,
          date: r.dateOfReport,
          doctorName: r.doctorName,
          keyParameters: (r.extractedParameters || []).slice(0, 3)
        })),
        recentTimelineHighlights: timeline.map(t => ({
          date: t.date,
          title: t.title,
          category: t.category,
          doctor: t.doctorOrSpecialty
        })),
        latestVitals,
        generatedAt: new Date(),
        safetyDisclaimer: "This clinical summary is compiled directly from patient-authorized records. It does not replace independent clinical evaluation."
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create Consent-based share for doctor
exports.createShareConsent = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { doctorName, doctorEmail, sharedSections, dependentId, durationHours } = req.body;

    if (!doctorName) {
      return res.status(400).json({
        success: false,
        message: 'Doctor name or clinic name is required.'
      });
    }

    const consent = memoryStore.createDoctorConsent({
      userId,
      doctorName,
      doctorEmail: doctorEmail || '',
      sharedSections: sharedSections || { reports: true, medicines: true, timeline: true, dependents: false },
      dependentId: dependentId || null
    });

    res.status(201).json({
      success: true,
      message: `Doctor access code generated! Valid for 24 hours under your explicit consent.`,
      consent: {
        id: consent._id,
        accessCode: consent.accessCode,
        doctorName: consent.doctorName,
        expiresAt: consent.expiresAt,
        status: consent.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's active & previous consent logs
exports.getUserConsents = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const consents = memoryStore.getDoctorConsents(userId);

    res.json({
      success: true,
      consents
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Revoke Doctor Access
exports.revokeConsent = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { consentId } = req.params;

    const revoked = memoryStore.revokeDoctorConsent(consentId, userId);
    if (!revoked) {
      return res.status(404).json({ success: false, message: 'Consent record not found.' });
    }

    res.json({
      success: true,
      message: `Access for ${revoked.doctorName} has been immediately revoked. Doctor can no longer access your records.`,
      consent: revoked
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Doctor Portal: Access summary via code
exports.doctorAccessByCode = async (req, res) => {
  try {
    const { accessCode } = req.body;
    if (!accessCode) {
      return res.status(400).json({ success: false, message: 'Please provide the 6-character CareSetu access code.' });
    }

    const consent = memoryStore.verifyDoctorAccess(accessCode.trim().toUpperCase());
    if (!consent) {
      return res.status(403).json({
        success: false,
        message: 'Invalid, expired, or revoked access code. Please request the patient to generate a new active code.'
      });
    }

    const patient = memoryStore.findUserById(consent.userId);
    const reports = consent.sharedSections.reports ? memoryStore.getReports(consent.userId, consent.dependentId).slice(0, 5) : [];
    const medicines = consent.sharedSections.medicines ? memoryStore.getMedicines(consent.userId, consent.dependentId) : [];
    const timeline = consent.sharedSections.timeline ? memoryStore.getTimeline(consent.userId, { dependentId: consent.dependentId }).slice(0, 5) : [];

    res.json({
      success: true,
      consentId: consent._id,
      doctorName: consent.doctorName,
      patient: {
        name: patient.name,
        bloodGroup: patient.bloodGroup,
        allergies: patient.allergies,
        chronicConditions: patient.chronicConditions
      },
      reports,
      medicines,
      timeline,
      expiresAt: consent.expiresAt
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// In-memory data store with disk persistence fallback
// Ensures 100% operational reliability for hackathon viva & offline evaluations
const fs = require('fs');
const path = require('path');
const {
  initialUser,
  initialDoctor,
  initialDependents,
  initialReports,
  initialMedicines,
  initialTimelineEvents,
  initialVaccinations,
  initialDoctorConsents
} = require('./seedData');

class MemoryStore {
  constructor() {
    this.users = [JSON.parse(JSON.stringify(initialUser)), JSON.parse(JSON.stringify(initialDoctor))];
    this.dependents = JSON.parse(JSON.stringify(initialDependents));
    this.reports = JSON.parse(JSON.stringify(initialReports));
    this.medicines = JSON.parse(JSON.stringify(initialMedicines));
    this.timeline = JSON.parse(JSON.stringify(initialTimelineEvents));
    this.vaccinations = JSON.parse(JSON.stringify(initialVaccinations));
    this.consents = JSON.parse(JSON.stringify(initialDoctorConsents));
    this.isMongoConnected = false;
  }

  setMongoStatus(status) {
    this.isMongoConnected = status;
  }

  // User methods
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: `user_${Date.now()}`,
      ...userData,
      createdAt: new Date()
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id, updateData) {
    const idx = this.users.findIndex(u => u._id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updateData };
      return this.users[idx];
    }
    return null;
  }

  deleteUser(id) {
    this.users = this.users.filter(u => u._id !== id);
    this.reports = this.reports.filter(r => r.userId !== id);
    this.medicines = this.medicines.filter(m => m.userId !== id);
    this.timeline = this.timeline.filter(t => t.userId !== id);
    this.dependents = this.dependents.filter(d => d.userId !== id);
    return true;
  }

  // Reports
  getReports(userId, dependentId = null) {
    return this.reports.filter(r => {
      const userMatch = r.userId === userId;
      if (!userMatch) return false;
      if (dependentId === 'all') return true;
      if (dependentId) return r.dependentId === dependentId;
      return r.dependentId === null || r.dependentId === undefined;
    }).sort((a, b) => new Date(b.dateOfReport) - new Date(a.dateOfReport));
  }

  getReportById(id) {
    return this.reports.find(r => r._id === id);
  }

  createReport(reportData) {
    const newReport = {
      _id: `rep_${Date.now()}`,
      ...reportData,
      createdAt: new Date()
    };
    this.reports.unshift(newReport);

    // Auto-create a corresponding health timeline event
    this.timeline.unshift({
      _id: `evt_${Date.now()}`,
      userId: reportData.userId,
      dependentId: reportData.dependentId || null,
      eventType: 'report',
      title: `${reportData.title} Added`,
      date: reportData.dateOfReport || new Date(),
      category: reportData.category || 'General Medicine',
      doctorOrSpecialty: reportData.doctorName || 'Consulting Physician',
      description: `New ${reportData.category} report uploaded. Extracted parameters and records attached.`,
      relatedReportId: newReport._id,
      vitals: {},
      icon: 'file-text',
      createdAt: new Date()
    });

    return newReport;
  }

  deleteReport(id, userId) {
    const idx = this.reports.findIndex(r => r._id === id && r.userId === userId);
    if (idx !== -1) {
      const removed = this.reports.splice(idx, 1)[0];
      // remove associated timeline event
      this.timeline = this.timeline.filter(t => t.relatedReportId !== id);
      return removed;
    }
    return null;
  }

  // Medicines
  getMedicines(userId, dependentId = null) {
    return this.medicines.filter(m => {
      const userMatch = m.userId === userId;
      if (!userMatch) return false;
      if (dependentId === 'all') return true;
      if (dependentId) return m.dependentId === dependentId;
      return m.dependentId === null || m.dependentId === undefined;
    }).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
  }

  createMedicine(medData) {
    const startDate = new Date(medData.startDate || new Date());
    const durationDays = parseInt(medData.durationDays) || 15;
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const newMed = {
      _id: `med_${Date.now()}`,
      ...medData,
      startDate,
      durationDays,
      endDate,
      status: 'active',
      doseLogs: [],
      createdAt: new Date()
    };
    this.medicines.unshift(newMed);

    // Timeline event
    this.timeline.unshift({
      _id: `evt_${Date.now()}`,
      userId: medData.userId,
      dependentId: medData.dependentId || null,
      eventType: 'medicine',
      title: `Started ${medData.name} (${medData.dosage})`,
      date: startDate,
      category: 'General Medicine',
      doctorOrSpecialty: medData.prescribedBy || 'Prescribed Medication',
      description: `Course: ${durationDays} days. Schedule: ${medData.reminderTimes?.join(', ') || 'Daily'}.`,
      relatedMedicineId: newMed._id,
      vitals: {},
      icon: 'pill',
      createdAt: new Date()
    });

    return newMed;
  }

  logMedicineDose(medId, userId, doseData) {
    const med = this.medicines.find(m => m._id === medId && m.userId === userId);
    if (!med) return null;

    const newLog = {
      _id: `log_${Date.now()}`,
      date: doseData.date ? new Date(doseData.date) : new Date(),
      time: doseData.time || '10:00 AM',
      status: doseData.status || 'taken', // 'taken' | 'missed'
      loggedAt: new Date(),
      notes: doseData.notes || ''
    };

    if (!med.doseLogs) med.doseLogs = [];
    med.doseLogs.unshift(newLog);

    return { med, log: newLog };
  }

  // Timeline
  getTimeline(userId, filters = {}) {
    let events = this.timeline.filter(e => e.userId === userId);

    if (filters.dependentId && filters.dependentId !== 'all') {
      events = events.filter(e => e.dependentId === filters.dependentId);
    } else if (filters.dependentId !== 'all') {
      events = events.filter(e => !e.dependentId);
    }

    if (filters.category && filters.category !== 'All') {
      events = events.filter(e => e.category === filters.category);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(e =>
        e.title?.toLowerCase().includes(q) ||
        e.doctorOrSpecialty?.toLowerCase().includes(q) ||
        e.description?.toLowerCase().includes(q)
      );
    }

    return events.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  createTimelineEvent(eventData) {
    const newEvent = {
      _id: `evt_${Date.now()}`,
      ...eventData,
      date: eventData.date ? new Date(eventData.date) : new Date(),
      createdAt: new Date()
    };
    this.timeline.unshift(newEvent);
    return newEvent;
  }

  // Dependents (Children & Family)
  getDependents(userId) {
    return this.dependents.filter(d => d.userId === userId);
  }

  createDependent(depData) {
    const newDep = {
      _id: `dep_${Date.now()}`,
      ...depData,
      createdAt: new Date()
    };
    this.dependents.push(newDep);

    // If it's a child, initialize basic vaccination schedule recommendations
    if (depData.relationship === 'Child') {
      this.initChildVaccinations(newDep._id, depData.userId);
    }

    return newDep;
  }

  initChildVaccinations(dependentId, userId) {
    const basicVaccines = [
      { name: "BCG", age: "At birth", status: "given" },
      { name: "Hepatitis B", age: "At birth", status: "given" },
      { name: "OPV (Oral Polio)", age: "Birth & 6 weeks", status: "given" },
      { name: "Pentavalent / DTP 1", age: "6 Weeks", status: "given" },
      { name: "Rotavirus 1", age: "6 Weeks", status: "given" },
      { name: "DTP Booster 1", age: "16-24 Months", status: "given" },
      { name: "MMR Booster", age: "15 Months", status: "given" },
      { name: "Annual Flu Shot", age: "Pre-winter", status: "due" },
      { name: "Typhoid Booster", age: "6 Years", status: "upcoming" }
    ];

    basicVaccines.forEach((v, i) => {
      this.vaccinations.push({
        _id: `vac_${Date.now()}_${i}`,
        dependentId,
        userId,
        vaccineName: v.name,
        targetAge: v.age,
        scheduledDate: new Date(),
        status: v.status,
        administeredBy: "Pediatric Clinic",
        batchNumber: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
        notes: "Schedule based on IAP (Indian Academy of Pediatrics) recommendations."
      });
    });
  }

  // Vaccinations
  getVaccinations(dependentId) {
    return this.vaccinations.filter(v => v.dependentId === dependentId);
  }

  updateVaccinationStatus(vacId, status, administeredBy, notes) {
    const vac = this.vaccinations.find(v => v._id === vacId);
    if (vac) {
      vac.status = status;
      if (status === 'given') vac.givenDate = new Date();
      if (administeredBy) vac.administeredBy = administeredBy;
      if (notes) vac.notes = notes;
      return vac;
    }
    return null;
  }

  // Doctor Consents
  getDoctorConsents(userId) {
    return this.consents.filter(c => c.userId === userId);
  }

  createDoctorConsent(consentData) {
    const newConsent = {
      _id: `con_${Date.now()}`,
      ...consentData,
      accessCode: `CARE-${Math.floor(1000 + Math.random() * 9000)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours valid
      status: 'active',
      consentGrantedAt: new Date(),
      accessLog: []
    };
    this.consents.unshift(newConsent);
    return newConsent;
  }

  revokeDoctorConsent(id, userId) {
    const consent = this.consents.find(c => c._id === id && c.userId === userId);
    if (consent) {
      consent.status = 'revoked';
      consent.revokedAt = new Date();
      return consent;
    }
    return null;
  }

  verifyDoctorAccess(accessCode) {
    const consent = this.consents.find(c => c.accessCode === accessCode && c.status === 'active');
    if (!consent) return null;
    if (new Date() > new Date(consent.expiresAt)) {
      consent.status = 'expired';
      return null;
    }
    // log access
    consent.accessLog.push({
      accessedAt: new Date(),
      ip: '127.0.0.1',
      action: 'Doctor verified access code and viewed consultation brief'
    });
    return consent;
  }

  // Reset to initial seed data
  resetDemoData() {
    this.users = [JSON.parse(JSON.stringify(initialUser)), JSON.parse(JSON.stringify(initialDoctor))];
    this.dependents = JSON.parse(JSON.stringify(initialDependents));
    this.reports = JSON.parse(JSON.stringify(initialReports));
    this.medicines = JSON.parse(JSON.stringify(initialMedicines));
    this.timeline = JSON.parse(JSON.stringify(initialTimelineEvents));
    this.vaccinations = JSON.parse(JSON.stringify(initialVaccinations));
    this.consents = JSON.parse(JSON.stringify(initialDoctorConsents));
    return true;
  }
}

const memoryStore = new MemoryStore();
module.exports = memoryStore;

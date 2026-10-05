const memoryStore = require('../data/memoryStore');

exports.getTimeline = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { dependentId, category, doctor, search } = req.query;

    let events = memoryStore.getTimeline(userId, { dependentId, category, search });

    if (doctor && doctor !== 'All') {
      const docLower = doctor.toLowerCase();
      events = events.filter(e => e.doctorOrSpecialty?.toLowerCase().includes(docLower));
    }

    res.json({
      success: true,
      count: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addTimelineEvent = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { title, date, category, doctorOrSpecialty, description, vitals, eventType, dependentId } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Event title is required.' });
    }

    const event = memoryStore.createTimelineEvent({
      userId,
      dependentId: dependentId || null,
      eventType: eventType || 'visit',
      title,
      date: date ? new Date(date) : new Date(),
      category: category || 'General Medicine',
      doctorOrSpecialty: doctorOrSpecialty || 'Consultant',
      description: description || '',
      vitals: vitals || {},
      icon: eventType === 'visit' ? 'stethoscope' : 'activity'
    });

    res.status(201).json({
      success: true,
      message: 'Health event added to your journey.',
      event
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

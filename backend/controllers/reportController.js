const path = require('path');
const memoryStore = require('../data/memoryStore');
const { processDocumentOcr } = require('../services/ocrService');
const { suggestCategory } = require('../services/aiCategorizer');
const { compareRecords } = require('../services/comparisonService');

// Step 1: Upload document, run OCR and AI Category Suggestion (Staging step)
exports.analyzeReport = async (req, res) => {
  try {
    const file = req.file;
    const { title, notes } = req.body;

    if (!file && !req.body.sampleReportName) {
      return res.status(400).json({
        success: false,
        message: 'No medical report file uploaded. Please select a PDF, JPG, or PNG document.'
      });
    }

    const fileName = file ? file.originalname : req.body.sampleReportName;
    const fileUrl = file ? `/uploads/${file.filename}` : (req.body.sampleUrl || '/sample-reports/cbc_lipid_report.pdf');
    const fileSize = file ? file.size : 350000;
    const fileType = fileName.endsWith('.pdf') ? 'pdf' : (fileName.endsWith('.png') ? 'png' : 'jpg');

    // Run OCR Text extraction
    const ocrResult = await processDocumentOcr(file || { originalname: fileName }, notes);

    // Run AI Categorizer
    const aiAnalysis = suggestCategory(ocrResult.rawText, fileName);

    // Return staging analysis back to client for USER CONFIRMATION
    res.json({
      success: true,
      message: 'Document analyzed successfully. Please review and confirm the AI suggested category.',
      analysis: {
        fileName,
        fileUrl,
        fileSize,
        fileType,
        extractedText: ocrResult.rawText,
        aiSuggestedCategory: aiAnalysis.suggestedCategory,
        aiConfidence: aiAnalysis.confidence,
        isLowConfidence: aiAnalysis.isLowConfidence,
        aiExtractedKeywords: aiAnalysis.extractedKeywords,
        extractedParameters: ocrResult.extractedParameters,
        extractedMedications: ocrResult.extractedMedications,
        safetyNotice: aiAnalysis.safetyNotice
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `Failed to analyze report: ${error.message}`
    });
  }
};

// Step 2: Confirm Category and Permanently Save Report
exports.confirmAndSaveReport = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      title,
      confirmedCategory,
      doctorName,
      hospitalOrLab,
      dateOfReport,
      fileUrl,
      fileName,
      fileType,
      fileSize,
      extractedText,
      aiSuggestedCategory,
      aiConfidence,
      aiExtractedKeywords,
      extractedParameters,
      extractedMedications,
      notes,
      dependentId
    } = req.body;

    if (!title || !confirmedCategory) {
      return res.status(400).json({
        success: false,
        message: 'Report title and confirmed category are required.'
      });
    }

    const newReport = memoryStore.createReport({
      userId,
      dependentId: dependentId || null,
      title,
      category: confirmedCategory, // User's confirmed or manually changed category
      doctorName: doctorName || 'Attending Physician',
      hospitalOrLab: hospitalOrLab || '',
      dateOfReport: dateOfReport ? new Date(dateOfReport) : new Date(),
      fileUrl: fileUrl || '/sample-reports/cbc_lipid_report.pdf',
      fileName: fileName || 'Report.pdf',
      fileType: fileType || 'pdf',
      fileSize: fileSize || 350000,
      ocrExtractedText: extractedText || '',
      aiSuggestedCategory: aiSuggestedCategory || confirmedCategory,
      aiConfidence: aiConfidence || 0.90,
      aiExtractedKeywords: aiExtractedKeywords || [],
      userConfirmedCategory: true,
      extractedParameters: extractedParameters || [],
      extractedMedications: extractedMedications || [],
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: `Report "${newReport.title}" successfully saved under "${confirmedCategory}"!`,
      report: newReport
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Reports (isolated by user and optional dependent)
exports.getReports = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { dependentId, category, search } = req.query;

    let reports = memoryStore.getReports(userId, dependentId);

    if (category && category !== 'All') {
      reports = reports.filter(r => r.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      reports = reports.filter(r =>
        r.title?.toLowerCase().includes(q) ||
        r.doctorName?.toLowerCase().includes(q) ||
        r.hospitalOrLab?.toLowerCase().includes(q) ||
        r.category?.toLowerCase().includes(q)
      );
    }

    res.json({
      success: true,
      count: reports.length,
      reports
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Single Report
exports.getReportById = async (req, res) => {
  try {
    const report = memoryStore.getReportById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Medical report not found.' });
    }

    // Access control: Ensure report belongs to current user
    const userId = req.user._id || req.user.id;
    if (report.userId !== userId && req.user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Unauthorized access to this health record.' });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Report
exports.deleteReport = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const removed = memoryStore.deleteReport(req.params.id, userId);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or you are not authorized to delete it.'
      });
    }

    res.json({
      success: true,
      message: 'Medical report and linked timeline event successfully deleted.',
      reportId: req.params.id
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// "What Changed?" Comparison between two records
exports.compareTwoReports = async (req, res) => {
  try {
    const { reportIdA, reportIdB } = req.body;

    if (!reportIdA || !reportIdB) {
      return res.status(400).json({
        success: false,
        message: 'Please select two reports to compare.'
      });
    }

    const reportA = memoryStore.getReportById(reportIdA);
    const reportB = memoryStore.getReportById(reportIdB);

    if (!reportA || !reportB) {
      return res.status(404).json({
        success: false,
        message: 'One or both selected reports could not be found.'
      });
    }

    const comparison = compareRecords(reportA, reportB);

    res.json({
      success: true,
      comparison
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

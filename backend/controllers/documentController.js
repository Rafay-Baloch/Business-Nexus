const Document = require('../models/Document');

// Local storage list simulation for sandbox architecture
const localDocsMockDB = [];

// 1. UPLOAD DOCUMENT METADATA
exports.uploadDocument = async (req, res) => {
  try {
    const { title, fileUrl, userId } = req.body;

    const newDoc = {
      id: `DOC_${Math.random().toString(36).substring(2, 9)}`,
      title,
      fileUrl: fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Sample PDF layout path
      uploadedBy: userId || "U_mock_entrepreneur_849",
      version: "v1.0",
      status: "pending",
      signatureImage: "",
      createdAt: new Date().toISOString()
    };

    localDocsMockDB.push(newDoc);
    console.log("--> New Document cached in simulation chamber. Total docs:", localDocsMockDB.length);

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and registered successfully in Chamber!',
      document: newDoc
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error during document processing' });
  }
};

// 2. GET DOCUMENT REPOSITORY LIST
exports.getDocuments = async (req, res) => {
  try {
    if (localDocsMockDB.length === 0) {
      // Default placeholder listing matching frontend viewer framework
      return res.json([
        {
          id: "d1",
          title: "Nexus Core Pitch Deck v1",
          fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
          uploadedBy: "U_mock_entrepreneur_849",
          version: "v1.0",
          status: "verified",
          signatureImage: ""
        }
      ]);
    }
    return res.json(localMeetingsMockDB);
  } catch (err) {
    return res.status(500).json({ message: 'Server error fetching documents' });
  }
};

// 3. APPLY DIGITAL E-SIGNATURE
exports.signDocument = async (req, res) => {
  try {
    const { docId, signatureDataUrl } = req.body;

    const docIndex = localDocsMockDB.findIndex(d => d.id === docId);
    if (docIndex !== -1) {
      localDocsMockDB[docIndex].status = "signed";
      localDocsMockDB[docIndex].signatureImage = signatureDataUrl;
    }

    return res.json({
      success: true,
      message: 'E-Signature locked and document state updated to signed!',
      docId,
      status: "signed"
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error securing signature image reference' });
  }
};
const express = require('express');
const router = express.Router();
const Event = require('../models/event.model');
const auth = require('../middleware/auth');
const PDFDocument = require('pdfkit');

router.get('/download-pdf', async (req, res) => {
  try {
    // Fetch events from the database
    const events = await Event.find().select('title description capacity price');
    console.log(events);
    if (!events.length) {
      return res.status(404).json({ message: 'No events found' });
    }

    // Calculate totals
    const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
    const totalPrice = events.reduce((sum, event) => sum + event.price, 0);

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 }); // Increased margin for better border visibility
    const filename = `all_events.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    doc.pipe(res);

    // Add black border
    doc.lineWidth(1) // Set line width
      .strokeColor('black') // Set border color
      .rect(30, 30, doc.page.width - 60, doc.page.height - 60) // Draw rectangle
      .stroke(); // Apply the stroke

    // Title and header styling
    doc.fontSize(18).text('All Events', { align: 'center', underline: true });
    doc.moveDown(1);

    // Table headers
    const headers = ['Title', 'Description', 'Capacity', 'Price'];
    const columnWidths = [150, 200, 80, 80];

    // Header Row
    doc.fontSize(12).font('Helvetica-Bold');
    headers.forEach((header, index) => {
      const x = 50 + columnWidths.slice(0, index).reduce((sum, width) => sum + width, 0);
      doc.text(header, x, doc.y, { width: columnWidths[index], align: 'center' });
    });
    doc.moveDown(0.5);

    // Draw the table rows
    doc.fontSize(10).font('Helvetica');
    events.forEach(event => {
      doc.text(event.title, 50, doc.y, { width: columnWidths[0], align: 'left' });
      doc.text(event.description, 50 + columnWidths[0], doc.y, { width: columnWidths[1], align: 'left' });
      doc.text(event.capacity, 50 + columnWidths[0] + columnWidths[1], doc.y, { width: columnWidths[2], align: 'center' });
      doc.text(`$${event.price.toFixed(2)}`, 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], doc.y, { width: columnWidths[3], align: 'right' });
      doc.moveDown(0.5);  // Add margin between rows
    });

    // Total Row
    doc.fontSize(10).font('Helvetica-Bold').text('Total', 50, doc.y, { width: columnWidths[0], align: 'left' });
    doc.text('', 50 + columnWidths[0], doc.y, { width: columnWidths[1], align: 'left' });
    doc.text(totalCapacity, 50 + columnWidths[0] + columnWidths[1], doc.y, { width: columnWidths[2], align: 'center' });
    doc.text(`$${totalPrice.toFixed(2)}`, 50 + columnWidths[0] + columnWidths[1] + columnWidths[2], doc.y, { width: columnWidths[3], align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Function to render table
function renderTable(doc, header, rows) {
  const tableTop = doc.y + 20;
  const cellPadding = 5;

  // Draw headers
  header.forEach((col, i) => {
    const x = 50 + header.slice(0, i).reduce((sum, h) => sum + h.width, 0);
    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(col.label, x, tableTop, { width: col.width, align: col.align || 'left' });
    doc.moveTo(x, tableTop + 15).lineTo(x + col.width, tableTop + 15).stroke();
  });

  // Draw rows
  rows.forEach((row, rowIndex) => {
    const rowTop = tableTop + 25 + rowIndex * 20;
    row.forEach((cell, i) => {
      const x = 50 + header.slice(0, i).reduce((sum, h) => sum + h.width, 0);
      doc
        .fontSize(10)
        .font('Helvetica')
        .text(cell, x, rowTop, { width: header[i].width, align: header[i].align || 'left' });
    });
  });
}

router.get('/byDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Validate dates
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Query events between the two dates and select specific fields
    const events = await Event.find({
      date: { $gte: start, $lte: end },
    }).select('title description capacity price');

    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching events by date:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('organizer', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizer: req.user.userId
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name');
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.user.userId },
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      organizer: req.user.userId
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
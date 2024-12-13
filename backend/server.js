const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');

const app = express();
const apiKey = "AIzaSyCUk-O_m2LFGnv-m3Fi3RaNzUenekPD0mY";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

// middlewares
app.use(cors());
app.use(express.json());

// Initialize multer for file uploads
const upload = multer();

// Define the POST route for PDF conversion
app.post('/api/convert-pdf', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No File Uploaded');
    }
  
    try {
      // Parse PDF to extract text
      const pdfText = await pdfParse(req.file.buffer);
      const extractedText = pdfText.text;
  
      const customText = "Generate as much Mcq as you can with answers ";
  
  
      const fullText = customText + extractedText;
  
 
      const chatSession = model.startChat({
        generationConfig,
        history: [],
      });
  
      const result = await chatSession.sendMessage(fullText);
      const generatedText = await result.response.text();
  

      res.json({ generatedText });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error processing the PDF or contacting the AI service');
    }
  });
  

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

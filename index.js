require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileType = require('file-type');
const app = express();
const port = process.env.PORT || 5500;
app.use(express.json({ limit: '50mb' }));

const corsOptions = {
    origin: 'https://bajaj-frontend-git-main-manan-telrandhe.vercel.app/', 
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); 
const isPrime = (num) => {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

app.post('/bfhl', async (req, res) => {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data)) {
        return res.status(400).json({ is_success: false, message: 'Invalid data format. "data" must be an array.' });
    }

    const numbers = data.filter((item) => !isNaN(item) && item.trim() !== '');
    const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(item));
    const highestLowercaseAlphabet = alphabets
        .filter((item) => item === item.toLowerCase())
        .sort()
        .pop() || '';

    const primeFound = numbers.some((num) => isPrime(Number(num)));

    let fileValid = false;
    let fileMimeType = '';
    let fileSizeKB = 0;
    
    if (file_b64) {
        try {

            const base64Data = file_b64.replace(/^data:image\/\w+;base64,/, "");
    
            const fileBuffer = Buffer.from(base64Data, 'base64');

            const fileInfo = await fileType.fromBuffer(fileBuffer);
    
            if (fileInfo) {
                fileValid = true;
                fileMimeType = fileInfo.mime;
                fileSizeKB = (fileBuffer.length / 1024).toFixed(2);
            } else {
                fileValid = false; 
            }
        } catch (err) {
            fileValid = false;
        }
    }
    
    

    const response = {
        is_success: true,
        user_id: `${process.env.USER_NAME}_${process.env.DOB}`,
        email: process.env.EMAIL_ID,
        roll_number: process.env.REG_NO,
        numbers,
        alphabets,
        highest_lowercase_alphabet: highestLowercaseAlphabet ? [highestLowercaseAlphabet] : [],
        is_prime_found: primeFound,
        file_valid: fileValid,
        file_mime_type: fileMimeType,
        file_size_kb: fileSizeKB,
    };

    res.json(response);
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ operation_code: 1 });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

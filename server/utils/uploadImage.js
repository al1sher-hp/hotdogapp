const FormData = require('form-data');
const fetch = require('node-fetch');

/**
 * Upload image to ImgBB
 * @param {Buffer} fileBuffer - Image file buffer from multer
 * @param {string} apiKey - ImgBB API key
 * @returns {Promise<string>} - Image URL
 */
async function uploadToImgBB(fileBuffer, apiKey) {
    try {
        const form = new FormData();
        form.append('key', apiKey);
        form.append('image', fileBuffer.toString('base64'));

        const response = await fetch('https://api.imgbb.com/1/upload', {
            method: 'POST',
            body: form
        });

        const json = await response.json();

        if (json.success && json.data && json.data.url) {
            return json.data.url;
        }

        throw new Error(json.error?.message || 'ImgBB upload failed');
    } catch (error) {
        console.error('ImgBB upload error:', error);
        throw new Error('Rasm yuklashda xato yuz berdi');
    }
}

module.exports = { uploadToImgBB };

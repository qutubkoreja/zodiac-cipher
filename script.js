// Function to encode text using Caesar cipher
function encodeText(text, shift) {
    return text.split('').map(char => {
        if (/[a-zA-Z]/.test(char)) {
            const start = char.charCodeAt(0) < 91 ? 65 : 97;
            return String.fromCharCode(((char.charCodeAt(0) - start + shift) % 26) + start);
        }
        return char;
    }).join('');
}

// Function to decode text using Caesar cipher
function decodeText(text, shift) {
    return encodeText(text, 26 - (shift % 26)); // Decoding is just encoding with (26 - shift)
}

// Adding event listeners to buttons
document.getElementById('encodeBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const shift = parseInt(document.getElementById('shift').value) || 3; // Default shift is 3
    const encodedText = encodeText(inputText, shift);
    document.getElementById('outputText').value = encodedText;
});

document.getElementById('decodeBtn').addEventListener('click', () => {
    const inputText = document.getElementById('inputText').value;
    const shift = parseInt(document.getElementById('shift').value) || 3; // Default shift is 3
    const decodedText = decodeText(inputText, shift);
    document.getElementById('outputText').value = decodedText;
});

// Image encoding/decoding functions
function encodeImage(image, text) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    // Convert text to binary
    const binaryText = text.split('').map(char => {
        return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('') + '11111111'; // End of text marker

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < binaryText.length; i++) {
        // Modify the least significant bit of the pixel
        const bit = binaryText[i];
        data[i * 4] = (data[i * 4] & ~1) | bit; // Modify the red channel
    }

    ctx.putImageData(imageData, 0, 0);
    const encodedImageUrl = canvas.toDataURL();
    downloadImage(encodedImageUrl, 'encoded_image.png');
}

function downloadImage(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
}

function decodeImage(image) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let binaryText = '';
    for (let i = 0; i < data.length; i += 4) {
        const bit = data[i] & 1; // Get the least significant bit
        binaryText += bit;
    }

    // Split the binary text into bytes and convert to characters
    const bytes = [];
    for (let i = 0; i < binaryText.length; i += 8) {
        const byte = binaryText.slice(i, i + 8);
        if (byte === '11111111') break; // End of text marker
        bytes.push(String.fromCharCode(parseInt(byte, 2)));
    }
    document.getElementById('decodedText').value = bytes.join('');
}

// Adding event listeners for image encoding/decoding
document.getElementById('encodeImageBtn').addEventListener('click', () => {
    const imageInput = document.getElementById('imageInput').files[0];
    const hiddenText = document.getElementById('hiddenText').value;

    if (imageInput && hiddenText) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => encodeImage(img, hiddenText);
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageInput);
    } else {
        alert('Please select an image and enter text to encode.');
    }
});

document.getElementById('decodeImageBtn').addEventListener('click', () => {
    const imageInput = document.getElementById('imageInput').files[0];

    if (imageInput) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => decodeImage(img);
            img.src = event.target.result;
        };
        reader.readAsDataURL(imageInput);
    } else {
        alert('Please select an image to decode.');
    }
});

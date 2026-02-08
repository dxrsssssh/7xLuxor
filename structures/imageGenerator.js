const canvas = require('canvas');
const path = require('path');
const fs = require('fs');

const fontPath = path.join(__dirname, '../fonts/Versa.otf');

if (fs.existsSync(fontPath)) {
    try {
        canvas.registerFont(fontPath, { family: 'Versa' });
        console.log('✓ Versa font loaded successfully');
    } catch (e) {
        console.error('Failed to load Versa font:', e.message);
    }
}

module.exports = async () => {
    try {
        const canvasInstance = canvas.createCanvas(1200, 400);
        const ctx = canvasInstance.getContext('2d');

        const borderRadius = 30;

        ctx.beginPath();
        ctx.moveTo(borderRadius, 0);
        ctx.lineTo(1200 - borderRadius, 0);
        ctx.quadraticCurveTo(1200, 0, 1200, borderRadius);
        ctx.lineTo(1200, 400 - borderRadius);
        ctx.quadraticCurveTo(1200, 400, 1200 - borderRadius, 400);
        ctx.lineTo(borderRadius, 400);
        ctx.quadraticCurveTo(0, 400, 0, 400 - borderRadius);
        ctx.lineTo(0, borderRadius);
        ctx.quadraticCurveTo(0, 0, borderRadius, 0);
        ctx.closePath();
        ctx.clip();

        const backgroundPath = path.join(__dirname, '../images/background.png');
        const background = await canvas.loadImage(backgroundPath);
        ctx.drawImage(background, 0, 0, 1200, 400);

        ctx.font = 'bold 75px Versa';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const textGradient = ctx.createLinearGradient(200, 100, 1000, 300);
        textGradient.addColorStop(0, '#001F3F');
        textGradient.addColorStop(0.5, '#41729F');
        textGradient.addColorStop(1, '#E1F1FF');

        ctx.fillStyle = textGradient;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 25;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        ctx.fillText('LEVIATHAN', 600, 200);

        ctx.font = '20px Versa';
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText('Versatile Bot', 600, 350);

        const buffer = canvasInstance.toBuffer('image/png');
        const outputPath = path.join(__dirname, '../images/leviathan_embed.png');
        fs.writeFileSync(outputPath, buffer);

        return outputPath;
    } catch (error) {
        console.error('Error generating image:', error);
        return null;
    }
};

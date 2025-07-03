import html2canvas from 'html2canvas';

export const generateCanvas = async (element, scale) => {
  return await html2canvas(element, {
    backgroundColor: null,
    scale: scale,
  });
};

export const downloadCanvasAsPNG = (canvas, filename) => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
};

export const copyCanvasToClipboard = async (canvas) => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          resolve();
        } catch (err) {
          reject(err);
        }
      } else {
        reject(new Error('Failed to create blob from canvas'));
      }
    }, 'image/png');
  });
};

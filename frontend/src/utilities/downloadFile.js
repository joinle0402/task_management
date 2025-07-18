import http from '@/http.js';

export async function exportFile(url, filename) {
    const response = await http.get(url, { responseType: 'blob' });
    const blob = new Blob([response]);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

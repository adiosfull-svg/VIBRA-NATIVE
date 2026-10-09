// Sul web: download del browser, come nell'app originale.
export async function saveBase64File(name: string, base64: string, mime: string): Promise<void> {
  const a = document.createElement('a');
  a.href = `data:${mime};base64,${base64}`;
  a.download = name;
  a.click();
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).replace(/^data:[^,]*,/, ''));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

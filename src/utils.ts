export function downloadBlob(blob: Blob, name :string) {
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  
  link.href = blobUrl;
  link.download = name;
  
  document.body.appendChild(link);
  
  link.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      })
  );
  
  document.body.removeChild(link);
}

export async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      resolve(reader.result as string)
    });

    reader.addEventListener("error", (event) => {
      reject(event)
    });

    reader.readAsDataURL(file);
  })
}
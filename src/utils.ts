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

export function openFile(accept: string): Promise<FileList | null> {
  
  return new Promise((resolve) => {
    const link = document.createElement("input");
    link.type = 'file'
    link.accept = accept

    document.body.appendChild(link);

    link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          view: window
        })
    );

    link.addEventListener('input',(e) => {
      const element = e.target as HTMLInputElement
      
      resolve(element.files)
    })

    link.addEventListener('cancel',() => {
      resolve(null)
    })

    document.body.removeChild(link);
  })

}
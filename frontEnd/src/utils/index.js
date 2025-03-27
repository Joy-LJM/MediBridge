const createURLDownloadFile = (data, id) => {
  const fileUrl = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = `prescription-${id}.pdf`;
  a.click();
};

export { createURLDownloadFile };

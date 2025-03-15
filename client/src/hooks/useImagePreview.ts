import { ChangeEventHandler, useState } from "react";
import { Preview } from "../components/gallery/UploadContainer";

export default function useImagePreview() {
  const [files, setFiles] = useState<File[] | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const imageSelectHandler: ChangeEventHandler<HTMLInputElement> = async (
    e
  ) => {
    const imageFiles = e.target.files;

    if (imageFiles && imageFiles.length > 0) {
      const imageArray = Array.from(imageFiles);

      setFiles((prevFiles) => {
        const newFiles = prevFiles ? [...prevFiles, ...imageArray] : imageArray;
        return newFiles.slice(0, 5);
      });

      const imagePreviews = await Promise.all(
        [...imageArray].map(async (imageFile) => {
          return new Promise<Preview>((resolve, reject) => {
            try {
              const fileReader = new FileReader();

              fileReader.readAsDataURL(imageFile);
              fileReader.onload = (e) =>
                resolve({
                  imgSrc: e.target?.result as string,
                  fileName: imageFile.name,
                });
            } catch (err) {
              reject(err);
            }
          });
        })
      );

      setPreviews((prevPreviews) => {
        const newPreviews = [...prevPreviews, ...imagePreviews];
        return newPreviews.slice(0, 5);
      });
    }
  };

  const removePreview = (index: number) => {
    setPreviews((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);

      setFiles((prevFiles) => {
        if (prevFiles) {
          return prevFiles.filter((_, i) => i !== index);
        }
        return prevFiles;
      });

      return newPreviews;
    });
  };

  return { files, previews, setPreviews, imageSelectHandler, removePreview };
}

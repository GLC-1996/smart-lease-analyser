import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing({
  errorFormatter: (err) => {
    return {
      message: err.message,
    };
  },
});
 
export const uploadRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async () => {
      return { uploadedAt: new Date() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof uploadRouter; 
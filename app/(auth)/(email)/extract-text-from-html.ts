import { htmlToText } from "html-to-text";

export const extractTextFromHTML = (html: string): string => {
  return htmlToText(html, {
    wordwrap: 130,
  });
};

// import DOMPurify from "dompurify";

// export const extractTextFromHtml = (html: string): string => {
//   const cleanHTML = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] });
//   const tempDiv = document.createElement("div");
//   tempDiv.innerHTML = cleanHTML;
//   return tempDiv.textContent || tempDiv.innerText || "";
// };

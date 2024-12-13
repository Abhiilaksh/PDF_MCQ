import { useState } from "react";
import axios from "axios";
import { Loader } from "./Loader"; // Assuming you have a Loader component

export const Input = () => {
  const [file, setFile] = useState(null);
  const [mcq, setMcq] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // Parse MCQ text into a structured format
  const parseMCQs = (text) => {
    const sections = text.split(/\n\n(?=[A-Z])/); // Split sections by double newlines
    const parsedMCQs = sections.map((section) => {
      const [title, ...questions] = section.split(/\n(?=\d+\.)/); // Split questions within each section
      return {
        title: title.trim(),
        questions: questions.map((q) => q.trim()),
      };
    });
    return parsedMCQs;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/convert-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data && response.data.generatedText) {
        const parsedMCQs = parseMCQs(response.data.generatedText);
        setMcq(parsedMCQs);
        alert("MCQs generated successfully!");
      } else {
        alert("No MCQs found in the response.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        error.response?.data?.message || "Error uploading the file. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center justify-center w-96 item-center">
            <form onSubmit={handleSubmit} className="w-full">
              {/* Drag and Drop Area */}
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-96 h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  {file ? (
                    <p className="mt-2 text-sm text-green-500">Selected: {file.name}</p>
                  ) : (
                    <div>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag
                        and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        PDF
                      </p>
                    </div>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  onChange={handleUpload}
                  accept=".pdf"
                />
              </label>

              <button
                type="submit"
                className="mt-4 w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}

      {/* Display Generated MCQs */}
      <div className="mt-8">
        {mcq.length > 0 ? (
          mcq.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <ul className="list-disc pl-6">
                {section.questions.map((question, qIndex) => (
                  <li key={qIndex} className="mb-2">
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No MCQs generated yet.</p>
        )}
      </div>
    </>
  );
};

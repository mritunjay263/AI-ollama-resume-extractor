import React from "react";
import "./form.css";
import illustration from "../assets/AI.jpg"; // Example illustration
import { useState} from "react";

function FormComponent() {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      setMessage("No file selected.");
      return;
    }

    if (file.size > 500 * 1024) {
      setMessage("File size exceeds the maximum limit of 500KB.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      let response = await fetch("http://localhost:8000/upload-resume", {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        response = response.json();
        response.then((result) => setData(result.data));
        setMessage("File uploaded successfully!");
      } else {
        setMessage("Failed to upload file.");
      }
      setLoading(false);
    } catch (error) {
      setMessage("An error occurred while uploading the file.");
      console.error(error);
      setLoading(false);
    }
  };

  console.log(data);


  return (
    <div className="container">
      {/* Left Section */}
      <div className="left-section">
        <h1>AI Document Extractor using Ollama3.2</h1>
        <p className="description">
          Experience the power of Generative AI in extracting insights from
          documents. This tool uses cutting-edge AI models to automatically
          parse and extract structured information from resumes and other
          documents.
        </p>
        <img
          className="illustration"
          src={illustration}
          alt="AI Illustration"
        />
        <button className="cta-button">TRY IT NOW</button>
      </div>

      {/* Right Section */}
      <div className="right-section">
        {/* Progress Bar */}
        <div className="progress-bar">
          <span>Step 1 of 3</span>
          <div className="progress">
            <div className="progress-fill"></div>
          </div>
        </div>

        <h2>Presentation</h2>
        {/* Upload Resume */}
        <div className="form-group">
          <label>Upload Resume</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          <small>Max file size: 500KB</small>
          {message && <p>{message}</p>}
        </div>
        {loading && (
          <div className="loding-con">
            <div className="loader"></div>
            <img
              style={{ width: "20px", height: "auto", padding: "0 10px" }}
              src="https://ollama.com/public/ollama.png"
              alt="ollama"
            />
            <span>Ollama3.2 working hard, please wait..</span>
          </div>
        )}

        {/* Form */}
        {!loading && (
          <form>
            <h3>Personal Info</h3>

            {/* Name */}
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                defaultValue={data?.name || ""}
              />
            </div>

            {/* Contact Information */}
            <div className="form-group">
              <label>Email Address</label>
              <input
                defaultValue={data?.contact_information?.email || ""}
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                defaultValue={data?.contact_information?.phone || ""}
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Education */}
            <div className="form-group">
              <label>Degree</label>
              <input
                type="text"
                defaultValue={data?.education?.degree || ""}
                placeholder="Enter your degree"
              />
            </div>

            <div className="form-group">
              <label>Institution</label>
              <input
                type="text"
                defaultValue={data?.education?.institution || ""}
                placeholder="Enter your institution name"
              />
            </div>

            <div className="form-group">
              <label>Year of Graduation</label>
              <input
                type="number"
                placeholder="Enter graduation year"
                defaultValue={data?.education?.year_of_graduation || ""}
              />
            </div>

            {/* Work Experience */}
            {/* <h3>Work Experience</h3>
            <div className="form-group">
              <label>Job Title</label>
              <input
                type="text"
                placeholder="Enter your job title"
                defaultValue="Software Engineer (Angular)"
              />
            </div>

            <div className="form-group">
              <label>Company</label>
              <input type="text" placeholder="Enter company name" />
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input type="date" defaultValue="2023-05-08" />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input type="date" placeholder="Leave empty if still working" />
            </div> */}

            {/* Skills */}
            <h3>Skills</h3>
            <div className="form-group">
              <label>Technologies</label>
              <textarea
                style={{height:"100px"}}
                placeholder="Enter your skills (e.g., Angular, React.js, Node.js)"
                defaultValue={data?.skills || ""}
              ></textarea>
            </div>

            {/* Gender */}
            <div className="form-group">
              <label>Gender</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    defaultChecked
                  />{" "}
                  Male
                </label>
                <label>
                  <input type="radio" name="gender" value="Female" /> Female
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Next
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default FormComponent;

import json
import os
from PyPDF2 import PdfReader
import docx
from langchain.prompts import PromptTemplate
from groq import Groq
from dotenv import load_dotenv
# Load .env file
load_dotenv()
# Access the API key
groq_api_key = os.getenv("GROQ_API_KEY")
print(f"groq_api_key {groq_api_key}")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY not found. Make sure .env is properly configured.")

def read_pdf(file_path):
    reader = PdfReader(file_path)
    return "\n".join([page.extract_text() for page in reader.pages])


def read_docx(file_path):
    doc = docx.Document(file_path)
    return "\n".join([p.text for p in doc.paragraphs])


def extract_text(file_path):
    _, ext = os.path.splitext(file_path)
    if ext.lower() == ".pdf":
        return read_pdf(file_path)
    elif ext.lower() == ".docx":
        return read_docx(file_path)
    else:
        raise ValueError("Unsupported file type")
    


# LangChain integration with Ollama
def extract_data_from_text(resume_text):
    
    # prompt = PromptTemplate(
    #     input_variables=["resume_text"],
    #    template=
    #     ("""
    #         Extract the following information from the resume. Return ONLY the result as a **valid JSON object**. 
    #         Do NOT include any additional text, explanation, comments, or formatting outside of the JSON object.

    #         Returns:
    #         str: The content of the AI's response to the summarization prompt.
            
    #         "name": "Full name of the candidate",
    #         "contact_information": 
    #         "email": "Email address",
    #         "phone": "Phone number"
    #         "education": 
    #         "degree": "Degree name",
    #         "institution": "Name of institution",
    #         "year_of_graduation": "Year of graduation"
    #         "work_experience": 
    #         "job_title": "Title of the job",
    #         "company": "Company name",
    #         "start_date": "Start date",
    #         "end_date": "End date or 'Present'",
    #         "description": "Brief description of responsibilities and achievements"
    #         "skills": ["List of key skills"]

    #         Resume Text:
    #         {resume_text}
                 
    #          dont add preambles text
    #          do not comment on the structure or metadata of the table itself
    #     """)
    # )
    
    prompt = PromptTemplate(
        input_variables=["resume_text"],
        template="""
        Extract the following information from the resume and return ONLY as a **valid JSON object**.
        Strictly adhere to the structure provided below. Do NOT include additional fields or variations.

        The JSON should have the following format:

            "name": "Full name of the candidate",
            "gender":"Gender of the person"
            "contact_information": 
                "email": "Email address",
                "phone": "Phone number"
            "education": 
                "degree": "Degree name",
                "institution": "Name of institution",
                "year_of_graduation": "Year of graduation"
            "work_experience": 
                    "job_title": "Title of the job",
                    "company": "Company name",
                    "start_date": "Start date (YYYY-MM-DD)",
                    "end_date": "End date (YYYY-MM-DD or 'Present')",
                    "description": "Brief description of responsibilities and achievements"            
            "skills": "List of key skills"

        Ensure the following:
        1. Do not include any fields outside the specified format.
        2. Use proper JSON syntax (e.g., use double quotes around all keys and string values).
        3. If a field value is missing, use `null` instead.
        4. Dates must be in the `YYYY-MM-DD` format. Use `null` if the exact date is unknown.
        5. Provide "skills" as an array of strings. If no skills are found, return an empty array: `[]`.

        Resume Text:
        {resume_text}
        """
    )

    client = Groq(api_key = groq_api_key)
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt.format(resume_text=resume_text)}],
        model="llama3-8b-8192",
        response_format={"type": "json_object"}
    )
 
    try:
        extracted_data = json.loads(response.choices[0].message.content)
    except json.JSONDecodeError:
        raise ValueError(f"Failed to parse the response as JSON. Output received:{''}")
    
    return extracted_data

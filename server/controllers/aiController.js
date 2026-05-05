import axios from "axios";

const getSuggestedSpeciality = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms) {
      return res.status(400).json({ success: false, message: "Enter your symptoms" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // model: "anthropic/claude-3-haiku",
        // model: "meta-llama/llama-3-8b-instruct",
        // model: "mistralai/mistral-7b-instruct",
        model: "openrouter/free",
        messages: [
          {
            role: "user",
            content: `Based on these symptoms: "${symptoms}", which ONE speciality from this list is most relevant? 
            List: General Physician, Cardiologist, Dermatologist, Orthopedic, Neurologist, ENT
            Reply with ONLY the speciality name, nothing else.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const speciality = response.data.choices[0].message.content.trim();

    res.status(200).json({ success: true, speciality });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const aiController = { getSuggestedSpeciality };
export default aiController;
import axios from "axios";

export const submitQuiz = async (data) => {
  const response = await axios.post("http://localhost:5000/submit", data);
  return response.data;
};

const { GoogleGenerativeAI } = require("@google/generative-ai");

const geminiApiKey = `AIzaSyA825kHac32VZwQabjdWynaZcKEv4k0g34`;
const genAI = new GoogleGenerativeAI(geminiApiKey);

async function getFeedback(req, res) {
  try {
    const { caption, ratings } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `you are my assistant and you have to give summary based on the data I provide to you. Give response in 1 sentence.`,
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage(`
        This is a post from a social platform , you can check the content of the post below:
        Post text : ${caption} \n
        According to an expert any social media post can be judged based on 3 factors: \n
        Author Credibility
        Evidence
        Influence
        Each factor can have a value of low, medium and high
        High influence means that author is trying to influence in the post , so high influence is not good
        High author credibility and high evidence is good
        Our experts said that in this particular post which i have attached the author credibility is ${ratings.author_bias.rating}, evidence is ${ratings.evidence.rating} and influence is ${ratings.influence.rating}.
        Can you generate a 1 line summary defining the reliability summary of this based on the above analysis by our experts
        Also please find the explanation of each analysis
        Why author credibility is ${ratings.author_bias.rating} ? - ${ratings.author_bias.explanation} \n
        Why evidence is ${ratings.evidence.rating}? -  ${ratings.evidence.explanation} \n
        Why influence is ${ratings.influence.rating}? -  ${ratings.influence.explanation} \n
      `);
    const response = await result.response;
    const text = response.text();
    return res.json({ data: text });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

module.exports = getFeedback;

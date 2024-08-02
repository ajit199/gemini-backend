const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");
const cheerio = require("cheerio");
const { ApifyClient } = require("apify-client");
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyB-nHwcG5C0FjIMh4O6nJg6vKY11MSXFrY");

APIFY_TOKEN = "apify_api_cVxZl4fjFtARwVmaioVCAQrnSzHKQZ0duwdS";

const client = new ApifyClient({
  token: APIFY_TOKEN,
});

async function getPosts(req, res) {
  try {
    const { topic = "", posts = 1 } = req.body;

    // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)
    if (1 > 3) {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [
              {
                text: `
        you are my assistant and you have to assist me in parsing, organizing, and analyzing the hashtags based on below topics You have to separate the data based on these topics. In response you have to give me only array of objects in string format.
        I have these topics:

    
${topic}          


            I will give you an array of hashtags. In response you have to choose which hashtags are related to these topics 
            give response in array of objects in string format. Give only array in response not any string.
            `,
              },
            ],
          },
        ],
      });

      const hashtags = await scrapeTikTokData();
      const msg = JSON.stringify(hashtags);

      const result = await chat.sendMessage(msg);
      const response = await result.response;
      const text = response.text();
      const firstIndex = text.indexOf("[");
      const lastIndex = text.lastIndexOf("]");
      const result1 = text.substring(firstIndex, lastIndex + 1);

      const data = JSON.parse(result1);
      let finaldata = {};
      data?.map((item) => {
        if (finaldata[item?.topic]) {
          finaldata[item?.topic]["hashtags"] = [
            ...finaldata[item?.topic]["hashtags"],
            ...item?.hashtags,
          ];
        } else {
          finaldata[item?.topic] = {
            topic: item?.topic,
            hashtags: item?.hashtags,
          };
        }
      });

      for (let key in finaldata) {
        finaldata[key]["data"] = await getTiktokPosts(
          finaldata[key]["hashtags"],
          posts,
          topic
        );
      }
    }
    res.json({
      data: [
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/fdd9383d35488bd433b341f4d1b3bf43~c5_720x720.jpeg?lk3s=a5d48078&nonce=1769&refresh_token=d7a5531dda0301d1f5dcf18622e32b48&x-expires=1722769200&x-signature=litNT%2FSzWj2UsUqwVNQSCLS7lO8%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl: "https://www.tiktok.com/@teamusa/video/7395332410952404255",
          postText:
            "Passing the phone: The women of Team USA edition 🇺🇸🤳 #teamusa #parisolympics #olympics ",
          accountName: "teamusa",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/e08076365f16088f8a64370b1e47a786~c5_720x720.jpeg?lk3s=a5d48078&nonce=61676&refresh_token=2e9bdb76d1654002b3715c6256b9bd21&x-expires=1722769200&x-signature=99C763Hs0vAcZ39ZviXvHKsiedk%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@nbcolympics/video/7397245303386033439",
          postText:
            "OUR FRIEND STEVE. 🇺🇸 #ParisOlympics #usagym #mensgymnastics #gymtok #gymnastics #stephennedoroscik #TeamUSA ",
          accountName: "nbcolympics",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/e08076365f16088f8a64370b1e47a786~c5_720x720.jpeg?lk3s=a5d48078&nonce=61676&refresh_token=2e9bdb76d1654002b3715c6256b9bd21&x-expires=1722769200&x-signature=99C763Hs0vAcZ39ZviXvHKsiedk%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@nbcolympics/video/7397903186234740010",
          postText:
            "Team USA made this look WAY too easy. 🤩 📺 USA Network and Peacock #usabasketball #basketball #ParisOlympics #celtics #lakers #warriors ",
          accountName: "nbcolympics",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/fdd9383d35488bd433b341f4d1b3bf43~c5_720x720.jpeg?lk3s=a5d48078&nonce=1769&refresh_token=d7a5531dda0301d1f5dcf18622e32b48&x-expires=1722769200&x-signature=litNT%2FSzWj2UsUqwVNQSCLS7lO8%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl: "https://www.tiktok.com/@teamusa/video/7397847272995802398",
          postText:
            "“I love that I have it.” 😂 Bronze medal check with the women of @USA Rugby 🇺🇸 #teamusa #parisolympics #olympics #rugby #rugby7s ",
          accountName: "teamusa",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/fdd9383d35488bd433b341f4d1b3bf43~c5_720x720.jpeg?lk3s=a5d48078&nonce=1769&refresh_token=d7a5531dda0301d1f5dcf18622e32b48&x-expires=1722769200&x-signature=litNT%2FSzWj2UsUqwVNQSCLS7lO8%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl: "https://www.tiktok.com/@teamusa/video/7398196786696899870",
          postText:
            "Winning tastes pretty sweet 🥰 @Ilona Maher @Naya Tapper #spiffsedrick @USA Rugby #parisolympics #olympics #rugby #teamusa #olympicmedalist #chomp #nomnomnom ",
          accountName: "teamusa",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/99d43f49d3f1749ffa85f5954ca10a8c~c5_720x720.jpeg?lk3s=a5d48078&nonce=31340&refresh_token=5b7ce914b9a77fa1059d4542eab207de&x-expires=1722769200&x-signature=r0uEO8crSj%2BTTwPaCYj7O4TVJNE%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl: "https://www.tiktok.com/@cnn/video/7398309399984622894",
          postText:
            "Simone Biles reflects on her sixth Olympic gold medal win and why she wears her goat necklace. #cnn #news #olympics",
          accountName: "cnn",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/e08076365f16088f8a64370b1e47a786~c5_720x720.jpeg?lk3s=a5d48078&nonce=61676&refresh_token=2e9bdb76d1654002b3715c6256b9bd21&x-expires=1722769200&x-signature=99C763Hs0vAcZ39ZviXvHKsiedk%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@nbcolympics/video/7397591570205216030",
          postText:
            "Nothing to say here except: 🗣️ SIMONE BILES. #ParisOlympics ",
          accountName: "nbcolympics",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign.tiktokcdn-us.com/tos-useast5-avt-0068-tx/e08076365f16088f8a64370b1e47a786~c5_720x720.jpeg?lk3s=a5d48078&nonce=61676&refresh_token=2e9bdb76d1654002b3715c6256b9bd21&x-expires=1722769200&x-signature=99C763Hs0vAcZ39ZviXvHKsiedk%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@nbcolympics/video/7395532401297984811",
          postText:
            "Simone Biles, ready for takeoff. ✈️#parisolympics #simonebiles #usagymnastics #gymnastics #teamusa ",
          accountName: "nbcolympics",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/254a09a93b6ebb10598fb47fb09e5a44~c5_720x720.jpeg?lk3s=a5d48078&nonce=94829&refresh_token=08d2d7e755edaaade6f7acaeafb362af&x-expires=1722769200&x-signature=ercIeuG7177iWYjhJc8iRcxUA%2Fk%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@plutowishesx/video/7398218936463920427",
          postText:
            "Simone Biles STILL wins GOLDDD #gymnastics #womensgymnastics #olympics #parisolympics #parisolympics2024 #simonebiles #unevenbars #teamusa #goat ",
          accountName: "plutowishesx",
          verified: false,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/7342553217407909931~c5_720x720.jpeg?lk3s=a5d48078&nonce=946&refresh_token=d958a53f4aa0303ca24152e82961d872&x-expires=1722769200&x-signature=aHlb6YJWdPR5w5EqRS5R6ZuxfWw%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@emmasofija/video/7398301897163017518",
          postText:
            "@Simone Biles is a two time Olympic all-around champion 🥇🐐 Simone Biles has won every All-Around competition she has competed in the past 11 years, staying undefeated in this event for over a decade.  As of today August 1st, Simone has 9 Olympic medals (6 gold, 1 silver, 2 bronze) and 30 World Championship medals (23 gold, 4 silver, 3 bronze), making her the most decorated gymnast in history—male or female. She has another 3 medal chances in Paris in the upcoming event finals.  Simone has five skills named after her, and the Biles II on floor—the skill in the first pass in this video—is a triple-twisting, double-tucked salto backward, rated J, making it the highest rated skill across all apparatuses in Women’s Artistic Gymnastics. It’s so complex that no other gymnast has even attempted it in competition.  GOAT. End of discussion.  #SimoneBiles #Olympics #OlympicGames #Paris2024 #Gymnastics #WomensArtisticGymnastics #GOAT #greatestofalltime ",
          accountName: "emmasofija",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-sign-useast2a.tiktokcdn.com/tos-useast2a-avt-0068-euttp/d8d85822eb3d608efb7c70ec826883c6~c5_720x720.jpeg?lk3s=a5d48078&nonce=88403&refresh_token=28311925077a98f5f34518e5e22beb45&x-expires=1722769200&x-signature=WRqtWkZDOJKdEuJ2pRHZ7vIHG4c%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@jervynneleigh10/video/7397735666454482208",
          postText:
            "#parisolympics2024  #10msynchronizeddiving #quanhongchan #chenyuxi #chinesedivers",
          accountName: "jervynneleigh10",
          verified: false,
        },
        {
          topic: "Sports",
          photo:
            "https://p16-pu-sign-useast8.tiktokcdn-us.com/tos-useast8-avt-0068-tx2/3ec10511157c8c7b9ad0e18bc6f54442~c5_720x720.jpeg?lk3s=a5d48078&nonce=13754&refresh_token=50ea236208a71285b4293bc1c4cd6e90&x-expires=1722769200&x-signature=PAUkkQU1iWeRKpUqUMpjFsasRLM%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@simonebilesowens/video/7395876174800456990",
          postText:
            "give me all the desserts 🥖🍡🧁🍭🍩🍨🍫🍰 #olympics #paris ",
          accountName: "simonebilesowens",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast5-avt-0068-tx/7310076350768316459~c5_720x720.jpeg?lk3s=a5d48078&nonce=46094&refresh_token=932c572ced0bdcb8d6573d3a79bb6cdc&x-expires=1722769200&x-signature=sXeB3rCLDz2gGmpxOmS7ZLm%2F9wg%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@dailymail/video/7397822429206203690",
          postText:
            "Paris Olympics' catering might need Simone Biles' magic touch. The gymnastics star gave a thumbs-down to the Olympic Village's food, suggesting athletes seek \"real\" French cuisine outside. Following the U.S. women's team gold win on July 30, Biles noted the village food was healthier but not authentic. Teammate Hezly Rivera was more blunt, saying the food wasn't great. Despite using fresh, local produce, organizers faced criticism, leading to a promise of improvements.  #olympic #olympicvillage #simonebiles #gymnastics ",
          accountName: "dailymail",
          verified: true,
        },
        {
          topic: "Sports",
          photo:
            "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast8-avt-0068-tx2/f73d49f83f31e8303c8dacd6286c9b2a~c5_720x720.jpeg?lk3s=a5d48078&nonce=77287&refresh_token=92cbee441960a9978714d9cd1c0c0a1f&x-expires=1722769200&x-signature=dCtVtcy7ZFoJYoD53731a3N%2BIjM%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl:
            "https://www.tiktok.com/@infoinews/video/7397226411607543070",
          postText:
            "the olympic village is going viral not in a good way #olympics #paris #foryou #viral ",
          accountName: "infoinews",
          verified: false,
        },
        {
          topic: "Sports",
          photo:
            "https://p19-pu-sign-useast8.tiktokcdn-us.com/tos-useast8-avt-0068-tx2/af5db989b747a9c7d7961f9bd469c891~c5_720x720.jpeg?lk3s=a5d48078&nonce=17430&refresh_token=6263177c585c798f6681939b0175cae1&x-expires=1722769200&x-signature=2tgIPJrwy3LMtPBuzimXdeTRjJg%3D&shp=a5d48078&shcp=b59d6b55",
          postUrl: "https://www.tiktok.com/@9vvux/video/7397866266641386795",
          postText:
            "she is literally ethereal her face card eats so bad || #foryou #usagymnastics #parisolympics #teamusa #sunilee #sunileeedit #olympics #trending #aestheticedits #aestheticedit #viral #foryoupage #sports #sportsedit ",
          accountName: "9vvux",
          verified: false,
        },
      ],
      // data: Object.keys(finaldata).map((key) => finaldata[key]["data"]),
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// Function to fetch the HTML of the webpage
async function fetchHTML(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error("Error fetching the HTML:", error);
  }
}

// Function to scrape the desired data
async function scrapeTikTokData() {
  const tiktokUrl =
    "https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en";

  const html = await fetchHTML(tiktokUrl);
  const $ = cheerio.load(html);

  const data = $(".CommonDataList_listWrap__4ejAT")
    .find(".CardPc_titleText__RYOWo")
    .toArray();

  const result = data.map((item, index) => {
    return item.lastChild.data;
  });
  return result;
}

async function getTiktokPosts(hashtags, posts, topic) {
  try {
    let config = {
      hashtags: hashtags,
      resultsPerPage: posts,
      shouldDownloadCovers: false,
      shouldDownloadSlideshowImages: false,
      shouldDownloadSubtitles: false,
      shouldDownloadVideos: false,
    };

    const run = await client
      .actor("clockworks/free-tiktok-scraper")
      .call(config);

    // Fetch and print actor results from the run's dataset (if any)
    const { items } = await client.dataset(run.defaultDatasetId).listItems();
    const data = items.map((item) => {
      return {
        topic: topic,
        photo: item.authorMeta.avatar,
        postUrl: item.webVideoUrl,
        postText: item.text,
        accountName: item.authorMeta.name,
        verified: item.authorMeta.verified,
      };
    });

    return data;
  } catch (error) {
    console.log("error getting tiktok posts", error);
  }
}

module.exports = getPosts;

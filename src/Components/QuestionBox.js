import { useState, useRef, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import QuestionAnswerTwoToneIcon from "@mui/icons-material/QuestionAnswerTwoTone";
import { Configuration, OpenAIApi } from "openai";
import { useSnackbar } from "notistack";

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

const QuestionBox = () => {
  const [ques, setQues] = useState("");
  const [prevData, setPrevData] = useState([]);
  const [loader, setLoader] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dataEndRef = useRef(null);

  const scrollToBottom = () => {
    dataEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [prevData]);

  const handleChange = (e) => {
    setQues(e.target.value);
  };

  const handleClear = () => {
    setQues("");
  };

  const handleSubmit = async () => {
    try {
      if (ques.length > 0) {
        setLoader(true);
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: ques,
          temperature: 0.6,
          max_tokens: 2048,
        });
        let tempAnswer = completion.data.choices[0].text;
        setPrevData([...prevData, { question: ques, answer: tempAnswer }]);
        setQues("");
        setLoader(false);
      } else {
        let message = "Please enter your question.";
        enqueueSnackbar(message, {
          variant: "warning",
        });
      }
    } catch (error) {
      setLoader(false);
      let message =
        "Wasn't able to connect the server, Please try again later.";
      enqueueSnackbar(message, {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        marginBottom={5}
        sx={{
          height: 50,
          backgroundColor: "primary.light",
        }}
      >
        <QuestionAnswerTwoToneIcon />
        <Typography variant="h6">Q&A Web App</Typography>
      </Box>
      <Container>
        <Box>
          {prevData.length > 0 ? (
            <>
              <List>
                {prevData.map((item, index) => (
                  <ListItem
                    key={index}
                    sx={{ border: "1px solid black", m: 1 }}
                  >
                    <ListItemText
                      primary={`Question : ${item.question}`}
                      secondary={
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Answer : {item.answer}
                        </Typography>
                      }
                    />
                    <div ref={dataEndRef} />
                  </ListItem>
                ))}
              </List>
            </>
          ) : null}
        </Box>
        <Box>
          {/* display="flex" flexDirection="column" alignItems="center" */}
          {loader ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : (
            <TextField
              id="outlined-textarea"
              label="Ask Me Anything"
              placeholder="Ex: Today's temperature in Bengaluru"
              multiline
              value={ques}
              onChange={handleChange}
              fullWidth
              sx={{ m: 1 }}
            />
          )}
          <Box display="flex" justifyContent="space-between">
            <Button sx={{ m: 1 }} variant="contained" onClick={handleSubmit}>
              Ask
            </Button>
            <Button sx={{ m: 1 }} variant="contained" onClick={handleClear}>
              Clear
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default QuestionBox;

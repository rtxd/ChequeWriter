import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import { units, tens } from "./constants";
import SvgIcon from "@material-ui/core/SvgIcon";
import GitHubIcon from "@material-ui/icons/GitHub";
import Link from "@material-ui/core/Link";

function WriteCheque(props) {
  const classes = useStyles();
  let throwError = false;

  //Check if we have to calculate cents
  let doesDecimalExist = false;
  if (props.value.includes(".")) doesDecimalExist = true;

  let intNumber = parseInt(props.value);
  let stringNumber = props.value;
  let wholeNumber = stringNumber.split(".")[0];
  let fractionalNumber = stringNumber.split(".")[1];
  let finalWord = "";

  // Run validation checks on number
  if (
    parseInt(props.value) <= 2000000000 &&
    (fractionalNumber < 100 || fractionalNumber == null) &&
    parseInt(props.value) > 0
  )
    throwError = false;
  else throwError = true;

  //If the number is 0 then return zero
  if (intNumber === 0 || isNaN(intNumber)) {
    return (
      <Typography variant="h3" className={classes.cheque}>
        zero dollars
      </Typography>
    );
  }

  //Add zeros in front of the number so it has 10 digits
  let amountOfZeros = 10 - wholeNumber.length;
  for (let i = 0; i < amountOfZeros; i++) {
    wholeNumber = "0" + wholeNumber;
  }

  //Split the number into 4 sections, for example: 8462 --> [0][000][008][462]
  let arrayOfScales = [];
  for (let i = 0; i < wholeNumber.length; i++) {
    if (i === 0) {
      arrayOfScales.push(wholeNumber[i]);
    }
    if (i === 1) {
      arrayOfScales.push(
        wholeNumber[i] + wholeNumber[i + 1] + wholeNumber[i + 2]
      );
    }
    if (i === 4) {
      arrayOfScales.push(
        wholeNumber[i] + wholeNumber[i + 1] + wholeNumber[i + 2]
      );
    }
    if (i === 7) {
      arrayOfScales.push(
        wholeNumber[i] + wholeNumber[i + 1] + wholeNumber[i + 2]
      );
    }
  }

  //Mini function that takes in a 3 digit value and returns it as words
  var getNumbersAsWords = (n) => {
    if (n === "0") return "";
    let word = "";
    //If the number has a teen in it (example: 2318)
    if (n[1] === "1") {
      //Write the units
      //* get the teens from the units by adding both the units column with the tens column
      word = units[parseInt(n[1] + n[2])] + " " + word;
      //Write the hundreds
      if (n[0] !== "0") {
        word = units[n[0]] + " hundred and " + word;
      }
    } else {
      for (var i = n.length; i > 0; i--) {
        //Write the units
        if (i === n.length) word = units[parseInt(n[i - 1])] + " " + word;
        //Write the tens
        if (i === n.length - 1) word = tens[parseInt(n[i - 1])] + " " + word;
        //Write the hundreds
        //Show the "And" based on whether any units or tens have been added to the string
        if (i === n.length - 2 && n[0] !== "0")
          if (!word.replace(/\s/g, "").length)
            word = units[parseInt(n[i - 1])] + " hundred " + word;
          else word = units[parseInt(n[i - 1])] + " hundred and " + word;
      }
    }
    return word;
  };

  for (var i = 0; i < 4; i++) {
    finalWord = finalWord + getNumbersAsWords(arrayOfScales[i]);

    if (arrayOfScales[i] !== "000" && arrayOfScales[i] !== "0") {
      if (i === 0) finalWord = finalWord + " billion ";
      if (i === 1) finalWord = finalWord + " million ";
      if (i === 2) finalWord = finalWord + " thousand ";
    }
  }

  // Throw Error if invalid number
  if (throwError)
    return (
      <Typography variant="h3" className={classes.error}>
        Invalid Number
      </Typography>
    );

  //Final Return statement
  if (doesDecimalExist) {
    //Write the cents out
    if (fractionalNumber.length == 1) fractionalNumber = fractionalNumber + "0";
    let stringCents = getNumbersAsWords("0" + fractionalNumber);
    return (
      <Typography variant="h3" className={classes.cheque}>
        {finalWord} dollars and {stringCents} cents
      </Typography>
    );
  } else {
    return (
      <Typography variant="h3" className={classes.cheque}>
        {finalWord} dollars
      </Typography>
    );
  }
}

const App = () => {
  const [value, setValue] = useState("0");
  const classes = useStyles();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className={classes.root}>
      <Grid container direction="column" justify="center" alignItems="center">
        <Grid item>
          <Typography variant="h3" noWrap>
            Cheque Writer
          </Typography>
        </Grid>

        <Grid item>
          <Typography variant="h6" className={classes.text}>
            <SvgIcon component={GitHubIcon} style={{ paddingRight: "20px" }} />
            GitHub:{" "}
            <Link href="https://github.com/rtxd/ChequeWriter">
              https://github.com/rtxd/ChequeWriter
            </Link>
          </Typography>
          <Typography variant="h6" className={classes.text}>
            The application will output the English words that express the
            number as a string of word (dollars and cents). The program should
            encode words exactly as you would say them in reading out the
            monetary amount.
          </Typography>
          <Typography variant="h6" className={classes.text}>
            Enter a dollar and cents amount (no currency symbols or commas are
            required for the input) which is less than 2 billion dollars. ie. A
            number between zero and 2 billion with 2 decimal places.
          </Typography>
        </Grid>

        <Grid item>
          <TextField
            id="filled-number"
            label="Number"
            type="number"
            value={value}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleChange}
            variant="filled"
          />
        </Grid>

        <Grid item>
          <Typography variant="h6" className={classes.text}>
            Written Cheque is:
          </Typography>
        </Grid>
        <Grid item>
          <WriteCheque value={value} />
        </Grid>
      </Grid>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  text: {
    textAlign: "center",
    width: "700px",
    padding: "20px",
  },
  cheque: {
    maxWidth: "700px",
    textAlign: "center",
  },
  error: {
    maxWidth: "700px",
    textAlign: "center",
    color: "red",
  },
}));

export default App;

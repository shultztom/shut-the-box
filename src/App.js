import React, { useState } from 'react';
import {cloneDeep} from 'lodash';

import {
    Container,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';

function App() {
    // Helper functions
    const oneOptionsThatAddToGoal = (array, goal) => {
        for(let item of array){
            if(item === goal){
                return true;
            }
        }
        return false;
    }

    const twoOptionsThatAddToGoal = (array, goal) => {
        for(let i = 0; i < array.length; i++){
            for(let j = 0; j < array.length; j++){
                if(i !== j){
                    let sum = array[i] + array[j];
                    if(sum === goal){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    const threeAddToGoal = (array, goal) => {
        // TODO remove hardcode?
        /*
            1 - none
            2 - none
            3 - none
            4 - none
            5 - none
            6 - 1,2,3
            7 - 1,2,4
            8 - 1,3,4
            9 - 2,3,4
        */
        let valid = false;
        if(goal === 6){
            if(array.includes(1) && array.includes(2) && array.includes(3)){
                valid = true;
            }
        }else if(goal === 7){
            if(array.includes(1) && array.includes(2) && array.includes(4)){
                valid = true;
            }
        }else if(goal === 8){
            if(array.includes(1) && array.includes(3) && array.includes(4)){
                valid = true;
            }
        }else if(goal === 9){
            if(array.includes(2) && array.includes(3) && array.includes(4)){
                valid = true;
            }
        }
        return valid;
    };

    const getTilesLeft = (tiles) => {
        // Get tiles left as array
        const tilesLeft = [];
        for(let tile of tiles){
            if(tile.selected === false){
                tilesLeft.push(tile.number);
            }
        }
        return tilesLeft;
    }

    const checkGameStatus = (diceOne, diceTwo, tiles) => {
        const tilesLeft = getTilesLeft(tiles);

        // Check winner
        if(tilesLeft.length === 0){
            return 'winner';
        }

        // Check if playable
        const diceSum = diceOne + diceTwo;
        const optionsFromOneTile = oneOptionsThatAddToGoal(tilesLeft, diceSum);
        if(optionsFromOneTile){
            return 'keepPlaying';
        }
        const optionsFromTwoTiles = twoOptionsThatAddToGoal(tilesLeft, diceSum);
        if(optionsFromTwoTiles){
            return 'keepPlaying';
        }
        const optionsFromThreeTiles = threeAddToGoal(tilesLeft, diceSum);
        if(optionsFromThreeTiles){
            return 'keepPlaying';
        }

        return 'loser';
    }

    const determineCanRollOneDice = (tiles) => {
        let sevenPicked = false;
        let eightPicked = false;
        let ninePicked = false;
        for(let tile of tiles){
            if(tile.selected === true && tile.number === 7){
                sevenPicked = true;
            }
            if(tile.selected === true && tile.number === 8){
                eightPicked = true;
            }
            if(tile.selected === true && tile.number === 9){
                ninePicked = true;
            }
        }
        return sevenPicked && eightPicked && ninePicked;
    }


    // State
    const [tiles, setTiles] = useState(
        [
            {
                number: 1,
                selected: false,
            },{
                number: 2,
                selected: false,
            },{
                number: 3,
                selected: false,
            },{
                number: 4,
                selected: false,
            },{
                number: 5,
                selected: false,
            },{
                number: 6,
                selected: false,
            },{
                number: 7,
                selected: false,
            },{
                number: 8,
                selected: false,
            },{
                number: 9,
                selected: false,
            }
        ],
    );
    const [diceOne, setDiceOne] = useState(null);
    const [diceTwo, setDiceTwo] = useState(null);
    const [canPickTiles, setCanPickTiles] = useState(false);
    const [canRoll, setCanRoll] = useState(true);
    const [lastItemsPicked, setLastItemsPicked] = useState([]);
    const [numLeftInTurn, setNumLeftInTurn] = useState(0);
    const [canRollOneDice, setCanRollOneDice] = useState(false);
    const [openLoser, setOpenLoser] = useState(false);
    const [openWinner, setOpenWinner] = useState(false);
    const [finalScore, setFinalScore] = useState(0);

    // State Helper
    const setNumberSelected = (number) => {
        const newTiles = cloneDeep(tiles);
        for(let tile of newTiles){
            if(tile.number === number){
                tile.selected = true;
            }
        }
        setTiles(newTiles);
    }

    const calculateFinalScore = (tiles) => {
        let total = 0;
        for(let tile of tiles){
            if(!tile.selected){
                total += tile.number;
            }
        }
        return total;
    }


    const resetGame = () => {
        setTiles([
            {
                number: 1,
                selected: false,
            },{
                number: 2,
                selected: false,
            },{
                number: 3,
                selected: false,
            },{
                number: 4,
                selected: false,
            },{
                number: 5,
                selected: false,
            },{
                number: 6,
                selected: false,
            },{
                number: 7,
                selected: false,
            },{
                number: 8,
                selected: false,
            },{
                number: 9,
                selected: false,
            }
        ]);
        setDiceOne(null);
        setDiceTwo(null);
        setCanPickTiles(false);
        setCanRoll(true);
        setLastItemsPicked([])
        setNumLeftInTurn(0);
        setCanRollOneDice(false);
        setFinalScore(0);
    }


    // Handlers
    const handleTileClick = (e) => {
        if(!canPickTiles){
            return;
        }

        let { value } = e.target;
        value = parseInt(value);

        // Check if valid number

        // Check if exact
        const remainder = numLeftInTurn - value;
        if(remainder === 0){
            // Roll dice again and reset last picked
            setNumberSelected(value);
            setCanPickTiles(false);
            setCanRoll(true);
            setLastItemsPicked([]);
            setNumLeftInTurn(remainder);
            // Determine if roll one or two dice
            setCanRollOneDice(determineCanRollOneDice(tiles));
        }else if(remainder > 0){
            // Keep picking tiles and add value to last picked
            setNumberSelected(value);

            const newLastPicked = cloneDeep(lastItemsPicked);
            newLastPicked.push(value);
            setLastItemsPicked(newLastPicked);

            setNumLeftInTurn(remainder);
        }else if(remainder < 0){
            // Don't do anything, for now anyway
        }
    }

    const handleRoll = () => {
        setCanRoll(false);
        setCanPickTiles(false);

        // Get random number not directly in setter, so we can use value in this function
        const diceOneValue = Math.floor(Math.random() * 6) + 1;
        let diceTwoValue = 0;
        // TODO allow user to override and roll both dice
        if(!canRollOneDice){
            diceTwoValue = Math.floor(Math.random() * 6) + 1;
        }
        const sumOfDice = diceOneValue + diceTwoValue;
        setDiceOne(diceOneValue);
        setDiceTwo(diceTwoValue);

        setNumLeftInTurn(sumOfDice);

        const status = checkGameStatus(diceOneValue, diceTwoValue, tiles);
        console.log(status);

        if(status === 'keepPlaying'){
            setCanPickTiles(true);
        }else if(status === 'winner'){
            setOpenWinner(true);
        }else if(status === 'loser'){
            // Calculate final score
            setFinalScore(calculateFinalScore(tiles));
            setOpenLoser(true);
        }
    }

    const undoClick = () => {
        let newLastItemsPicked = cloneDeep(lastItemsPicked);
        const lastItemAdded = newLastItemsPicked.shift();
        const newTiles = cloneDeep(tiles);
        for(let tile of newTiles){
            if(tile.number === lastItemAdded){
                tile.selected = false;
            }
        }
        setTiles(newTiles);
        setNumLeftInTurn(lastItemAdded + numLeftInTurn);
        setLastItemsPicked(newLastItemsPicked);
    }

    const handleLoserClose = () => {
        resetGame();
        setOpenLoser(false);
    }

    const handleWinnerClose = () => {
        resetGame();
        setOpenWinner(false);
    }

  return (
      <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
              Shut The Box!
          </Typography>

          <Grid container justifyContent={"center"}>
              {tiles.map((tile, index) => (
                  <Grid item xs={1} key={index}>
                      <Button
                          style={{
                              minWidth: "100%"
                          }}
                          variant="outlined"
                          value={tile.number}
                          disabled={tile.selected || !canPickTiles}
                          onClick={(e) => handleTileClick(e)}>
                            {tile.number}
                      </Button>
                  </Grid>
              ))}

          </Grid>

          <Grid container mt={4}>
              <Grid item xs={6}>
                  <Typography align={"center"}>{diceOne}</Typography>
              </Grid>
              <Grid item xs={6}>
                  <Typography align={"center"}>{diceTwo}</Typography>
              </Grid>
          </Grid>

          <Grid container mt={4} justifyContent={"center"}>
              <Grid item mr={2}>
                  <Button variant={"contained"} onClick={handleRoll} disabled={!canRoll}>
                      ROLL!
                  </Button>
              </Grid>

              <Grid item>
                  <Button variant={"contained"} onClick={undoClick} disabled={!canPickTiles || lastItemsPicked.length === 0}>
                      Undo Move
                  </Button>
              </Grid>
          </Grid>

          <Dialog
              open={openLoser}
              onClose={handleLoserClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  Loser!
              </DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                      Try Again Next Time!
                  </DialogContentText>
                  <DialogContentText id="alert-dialog-description">
                      Final Score: {finalScore}
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleLoserClose} autoFocus>
                      Close
                  </Button>
              </DialogActions>
          </Dialog>

          <Dialog
              open={openWinner}
              onClose={handleWinnerClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
          >
              <DialogTitle id="alert-dialog-title">
                  Winner!
              </DialogTitle>
              <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                      Play Again!
                  </DialogContentText>
              </DialogContent>
              <DialogActions>
                  <Button onClick={handleWinnerClose} autoFocus>
                      Close
                  </Button>
              </DialogActions>
          </Dialog>
      </Container>

  );
}

export default App;

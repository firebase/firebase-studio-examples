'use client';

import {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {provideSudokuHint} from '@/ai/flows/provide-sudoku-hint';
import {useToast} from "@/hooks/use-toast";
import {Toaster} from "@/components/ui/toaster";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger} from "@/components/ui/alert-dialog";

// Utility function to generate a Sudoku grid (replace with actual logic)
const generateSudoku = (difficulty: string): number[][] => {
  // This is a placeholder, replace with your Sudoku generation algorithm
  const emptyGrid = Array(9).fill(null).map(() => Array(9).fill(0));
  if (difficulty === 'Easy') {
    emptyGrid[0][1] = 3;
    emptyGrid[0][2] = 6;
    emptyGrid[1][0] = 7;
    emptyGrid[1][4] = 9;
    emptyGrid[1][5] = 1;
    emptyGrid[2][2] = 4;
    emptyGrid[2][3] = 2;
    emptyGrid[2][6] = 9;

    emptyGrid[3][0] = 6;
    emptyGrid[3][1] = 2;
    emptyGrid[3][5] = 5;
    emptyGrid[4][3] = 9;
    emptyGrid[4][7] = 4;
    emptyGrid[5][5] = 7;
    emptyGrid[5][6] = 2;
    emptyGrid[5][9 - 1] = 8;

    emptyGrid[6][3] = 4;
    emptyGrid[6][7] = 3;
    emptyGrid[6][8] = 5;
    emptyGrid[7][4] = 8;
    emptyGrid[7][8] = 6;
    emptyGrid[8][0] = 2;
    emptyGrid[8][7] = 1;
    emptyGrid[8][8] = 9;
  } else if (difficulty === 'Medium') {
    emptyGrid[0][2] = 7;
    emptyGrid[0][3] = 4;
    emptyGrid[0][5] = 8;
    emptyGrid[0][6] = 9;
    emptyGrid[1][1] = 8;
    emptyGrid[1][7] = 5;
    emptyGrid[2][0] = 3;
    emptyGrid[2][3] = 5;
    emptyGrid[2][5] = 6;
    emptyGrid[2][8] = 8;

    emptyGrid[3][1] = 3;
    emptyGrid[3][2] = 8;
    emptyGrid[3][6] = 6;
    emptyGrid[4][4] = 8;
    emptyGrid[4][5] = 3;
    emptyGrid[4][7] = 1;
    emptyGrid[5][2] = 6;
    emptyGrid[5][3] = 9;
    emptyGrid[5][7] = 3;

    emptyGrid[6][0] = 4;
    emptyGrid[6][5] = 2;
    emptyGrid[6][8] = 7;
    emptyGrid[7][1] = 1;
    emptyGrid[7][7] = 9;
    emptyGrid[8][2] = 2;
    emptyGrid[8][3] = 6;
    emptyGrid[8][5] = 7;
    emptyGrid[8][6] = 5;
  } else if (difficulty === 'Hard') {
    emptyGrid[0][3] = 6;
    emptyGrid[0][5] = 3;
    emptyGrid[1][0] = 5;
    emptyGrid[1][6] = 8;
    emptyGrid[1][7] = 6;
    emptyGrid[2][1] = 4;
    emptyGrid[2][5] = 5;
    emptyGrid[2][8] = 9;

    emptyGrid[3][0] = 7;
    emptyGrid[3][2] = 4;
    emptyGrid[4][1] = 8;
    emptyGrid[4][7] = 4;
    emptyGrid[5][6] = 3;
    emptyGrid[5][8] = 2;

    emptyGrid[6][0] = 9;
    emptyGrid[6][3] = 5;
    emptyGrid[6][7] = 7;
    emptyGrid[7][1] = 3;
    emptyGrid[7][2] = 2;
    emptyGrid[7][8] = 8;
    emptyGrid[8][3] = 2;
    emptyGrid[8][5] = 6;
  }
  return emptyGrid;
};

const Home = () => {
  const [grid, setGrid] = useState<number[][]>(generateSudoku('Easy'));
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [errorCells, setErrorCells] = useState<{[key: string]: boolean}>({});
  const {toast} = useToast();
  const [isSolved, setIsSolved] = useState<boolean>(false);

  useEffect(() => {
    const newGrid = generateSudoku(difficulty);
    setGrid(newGrid);
    setErrorCells({});
    setIsSolved(false);
  }, [difficulty]);

  const checkSolution = () => {
    // Basic check - all cells are filled
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j] === 0) {
          toast({
            title: "Not so fast!",
            description: "The grid is not complete yet!"
          });
          return;
        }
      }
    }

    // TODO: Comprehensive Sudoku solution validation logic
    setIsSolved(true);
    toast({
      title: "Congratulations!",
      description: "You solved it!"
    });
  };

  const handleInputChange = (row: number, col: number, value: string) => {
    const num = parseInt(value);
    if ((!isNaN(num) && num >= 1 && num <= 9) || value === '') {
      const newGrid = grid.map((rowArray, rowIndex) =>
        rowIndex === row
          ? rowArray.map((cellValue, colIndex) => (colIndex === col ? (num ? num : 0) : cellValue))
          : rowArray
      );
      setGrid(newGrid);
      validateMove(row, col, num, newGrid);
    }
  };

  const validateMove = (row: number, col: number, value: number, currentGrid: number[][]) => {
    const newErrors: {[key: string]: boolean} = {};

    // Check row
    for (let i = 0; i < 9; i++) {
      if (i !== col && currentGrid[row][i] === value) {
        newErrors[`${row}-${col}`] = true;
        newErrors[`${row}-${i}`] = true;
      }
    }

    // Check column
    for (let i = 0; i < 9; i++) {
      if (i !== row && currentGrid[i][col] === value) {
        newErrors[`${row}-${col}`] = true;
        newErrors[`${i}-${col}`] = true;
      }
    }

    // Check 3x3 block
    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if ((i !== row || j !== col) && currentGrid[i][j] === value) {
          newErrors[`${row}-${col}`] = true;
          newErrors[`${i}-${j}`] = true;
        }
      }
    }

    setErrorCells(newErrors);
  };

  const getHint = async () => {
    try {
      const hintData = await provideSudokuHint({grid: grid});
      toast({
        title: "Sudoku Hint",
        description: hintData?.hint || 'No hint available.'
      });
    } catch (error) {
      console.error('Error fetching hint:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to retrieve hint. Please try again."
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-background">
      <Toaster/>
      <h1 className="text-4xl font-bold mb-4">SudokuZen</h1>
      <div className="flex space-x-4 mb-4">
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select difficulty"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={getHint} variant="outline">Get Hint</Button>
      </div>
      <div className="grid grid-cols-9 gap-1 border-2 border-border">
        {grid.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <input
              key={`${rowIndex}-${colIndex}`}
              type="text"
              className={`w-10 h-10 text-xl font-bold text-center rounded appearance-none 
                          ${(rowIndex + colIndex) % 2 === 0 ? 'bg-secondary' : 'bg-accent'}
                          ${errorCells[`${rowIndex}-${colIndex}`] ? 'text-destructive' : 'text-blue-500'}
                          ${rowIndex % 3 === 2 ? 'border-b-2 border-border' : ''}
                          ${colIndex % 3 === 2 ? 'border-r-2 border-border' : ''}
                          focus:outline-none focus:ring-2 focus:ring-primary`}
              value={cell === 0 ? '' : cell}
              onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
              maxLength={1}
            />
          ))
        ))}
      </div>
      <div className="mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">Check Solution</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will check your solution and tell you if it is correct.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={checkSolution}>Check</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {isSolved && (
        <div className="mt-4 text-green-500">Congratulations! You solved the Sudoku!</div>
      )}
    </div>
  );
};

export default Home;

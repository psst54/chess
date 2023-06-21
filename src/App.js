import "./App.css";
import react from "react";
import styled from "styled-components";

const whiteColor = "#dcf1fa";
const blackColor = "#3aafe0";
const whiteColorPossible = "#eff5a9";
const blackColorPossible = "#9cc88b";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 100vw;
  min-height: 100vh;

  background: #0e0d21;
`;

const Board = styled.div`
  width: calc(min(80vw, 80vh));
  height: calc(min(80vw, 80vh));
  min-width: 300px;
  min-height: 300px;
  max-width: 500px;
  max-height: 500px;

  display: flex;
  flex-direction: column;
`;

const RowWrapper = styled.div`
  display: flex;
  width: 100%;
  height: calc(100% / 8);
  flex-direction: row;
`;
const Cell = styled.button`
  width: calc(100% / 8);
  height: 100%;
  background: ${({ isPossibleMove, isWhite }) =>
    isPossibleMove
      ? isWhite
        ? whiteColorPossible
        : blackColorPossible
      : isWhite
      ? whiteColor
      : blackColor};

  border: 2px solid
    ${({ isPossibleMove, isWhite }) =>
      isPossibleMove
        ? isWhite
          ? whiteColorPossible
          : blackColorPossible
        : isWhite
        ? whiteColor
        : blackColor};

  cursor: ${({ isPossibleMove }) => (isPossibleMove ? "pointer" : "default")};

  &:hover {
    border: 2px solid
      ${({ isPossibleMove, isWhite }) =>
        isPossibleMove
          ? isWhite
            ? "black"
            : "black"
          : isWhite
          ? whiteColor
          : blackColor};
  }
`;

const king = "king";
const queen = "queen";
const rook = "rook";
const bishop = "bishop";
const knight = "knight";
const pawn = "pawn";
const white = "white";
const black = "black";

const checkInsideBoard = ({ x, y }) => {
  return 0 <= x && x < 8 && 0 <= y && y < 8;
};

const checkPieceExists = ({ board, x, y }) => {
  if (board[y][x] === null) return false;
  return true;
};

const checkIsSameRegion = (regionA, regionB) => {
  return regionA === regionB;
};

const getRegion = ({ board, x, y }) => {
  return board[y][x].region;
};

const returnKingPossibleMoves = ({ board, x, y }) => {
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
  const ret = [];

  for (let i = 0; i < dx.length; i++) {
    const nx = x + dx[i];
    const ny = y + dy[i];

    if (!checkInsideBoard({ x: nx, y: ny })) continue;
    if (
      checkPieceExists({ board, x: nx, y: ny }) &&
      checkIsSameRegion(
        getRegion({ board, x: nx, y: ny }),
        getRegion({ board, x: x, y: y })
      )
    )
      continue;

    ret.push({ x: nx, y: ny });
  }

  return ret;
};

const returnQueenPossibleMoves = ({ board, x, y }) => {
  const dx = [-1, 0, 1, -1, 1, -1, 0, 1];
  const dy = [-1, -1, -1, 0, 0, 1, 1, 1];
  const ret = [];

  for (let i = 0; i < dx.length; i++) {
    let nx = x + dx[i];
    let ny = y + dy[i];

    while (checkInsideBoard({ x: nx, y: ny })) {
      if (checkPieceExists({ board, x: nx, y: ny })) break;

      ret.push({ x: nx, y: ny });

      nx += dx[i];
      ny += dy[i];
    }
  }

  return ret;
};

const returnRookPossibleMoves = ({ board, x, y }) => {
  const dx = [-1, 1, 0, 0];
  const dy = [0, 0, -1, 1];
  const ret = [];

  for (let i = 0; i < dx.length; i++) {
    let nx = x + dx[i];
    let ny = y + dy[i];

    while (checkInsideBoard({ x: nx, y: ny })) {
      if (checkPieceExists({ board, x: nx, y: ny })) break;

      ret.push({ x: nx, y: ny });

      nx += dx[i];
      ny += dy[i];
    }
  }

  return ret;
};

const returnBishopPossibleMoves = ({ board, x, y }) => {
  const dx = [-1, -1, 1, 1];
  const dy = [-1, 1, -1, 1];
  const ret = [];

  for (let i = 0; i < dx.length; i++) {
    let nx = x + dx[i];
    let ny = y + dy[i];

    while (checkInsideBoard({ x: nx, y: ny })) {
      if (checkPieceExists({ board, x: nx, y: ny })) break;

      ret.push({ x: nx, y: ny });

      nx += dx[i];
      ny += dy[i];
    }
  }

  return ret;
};

const returnKnightPossibleMoves = ({ board, x, y }) => {
  const dx = [-2, -1, 1, 2, 2, 1, -1, -2];
  const dy = [-1, -2, -2, -1, 1, 2, 2, 1];
  const ret = [];

  for (let i = 0; i < dx.length; i++) {
    const nx = x + dx[i];
    const ny = y + dy[i];

    if (!checkInsideBoard({ x: nx, y: ny })) continue;
    if (
      checkPieceExists({ board, x: nx, y: ny }) &&
      checkIsSameRegion(
        getRegion({ board, x: nx, y: ny }),
        getRegion({ board, x: x, y: y })
      )
    )
      continue;

    ret.push({ x: nx, y: ny });
  }

  return ret;
};

const returnPawnPossibleMoves = ({ board, x, y }) => {
  const ret = [];

  let nx = x;
  let ny = y - 1;
  if (
    checkInsideBoard({ x: nx, y: ny }) &&
    !checkPieceExists({ board, x: nx, y: ny })
  )
    ret.push({ x: nx, y: ny });

  if (y === 6) {
    nx = x;
    ny = y - 2;
    if (
      checkInsideBoard({ x: nx, y: ny }) &&
      !checkPieceExists({ board, x: nx, y: ny })
    )
      ret.push({ x: nx, y: ny });
  }

  nx = x - 1;
  ny = y - 1;
  if (
    checkInsideBoard({ x: nx, y: ny }) &&
    checkPieceExists({ board, x: nx, y: ny }) &&
    !checkIsSameRegion(
      getRegion({ board, x: nx, y: ny }),
      getRegion({ board, x: x, y: y })
    )
  )
    ret.push({ x: nx, y: ny });

  nx = x + 1;
  ny = y - 1;
  if (
    checkInsideBoard({ x: nx, y: ny }) &&
    checkPieceExists({ board, x: nx, y: ny }) &&
    !checkIsSameRegion(
      getRegion({ board, x: nx, y: ny }),
      getRegion({ board, x: x, y: y })
    )
  )
    ret.push({ x: nx, y: ny });

  return ret;
};

const WhiteKing = {
  type: king,
  region: white,
  returnPossibleMoves: returnKingPossibleMoves,
};
const WhiteQueen = {
  type: queen,
  region: white,
  returnPossibleMoves: returnQueenPossibleMoves,
};
const WhiteRook = {
  type: rook,
  region: white,
  returnPossibleMoves: returnRookPossibleMoves,
};
const WhiteBishop = {
  type: bishop,
  region: white,
  returnPossibleMoves: returnBishopPossibleMoves,
};
const WhiteKnight = {
  type: knight,
  region: white,
  returnPossibleMoves: returnKnightPossibleMoves,
};
const WhitePawn = {
  type: pawn,
  region: white,
  returnPossibleMoves: returnPawnPossibleMoves,
};

const BlackKing = {
  type: king,
  region: black,
  returnPossibleMoves: returnKingPossibleMoves,
};
const BlackQueen = {
  type: queen,
  region: black,
  returnPossibleMoves: returnQueenPossibleMoves,
};
const BlackRook = {
  type: rook,
  region: black,
  returnPossibleMoves: returnRookPossibleMoves,
};
const BlackBishop = {
  type: bishop,
  region: black,
  returnPossibleMoves: returnBishopPossibleMoves,
};
const BlackKnight = {
  type: knight,
  region: black,
  returnPossibleMoves: returnKnightPossibleMoves,
};
const BlackPawn = {
  type: pawn,
  region: black,
  returnPossibleMoves: returnPawnPossibleMoves,
};

function App() {
  const myRegion = white;
  const [selectedPiece, setSelectedPiece] = react.useState(false);
  const [possibleMoves, setPossibleMoves] = react.useState([]);

  const [pieces, setPieces] = react.useState([
    [
      BlackRook,
      BlackKnight,
      BlackBishop,
      BlackKing,
      BlackQueen,
      BlackBishop,
      BlackKnight,
      BlackRook,
    ],
    [
      BlackPawn,
      BlackPawn,
      BlackPawn,
      BlackPawn,
      BlackPawn,
      BlackPawn,
      BlackPawn,
      BlackPawn,
    ],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [
      WhitePawn,
      WhitePawn,
      WhitePawn,
      WhitePawn,
      WhitePawn,
      WhitePawn,
      WhitePawn,
      WhitePawn,
    ],
    [
      WhiteRook,
      WhiteKnight,
      WhiteBishop,
      WhiteKing,
      WhiteQueen,
      WhiteBishop,
      WhiteKnight,
      WhiteRook,
    ],
  ]);

  const checkIsPossibleMove = react.useCallback(
    ({ possibleMoves, x, y }) => {
      return (
        possibleMoves.filter((move) => move.x === x && move.y === y).length > 0
      );
    },
    [possibleMoves]
  );

  console.error = () => {};

  return (
    <Container>
      <Board>
        {pieces.map((cols, colsIdx) => {
          return (
            <RowWrapper key={colsIdx}>
              {cols.map((cell, cellIdx) => {
                const isPossibleMove = checkIsPossibleMove({
                  possibleMoves,
                  x: cellIdx,
                  y: colsIdx,
                });

                return (
                  <Cell
                    key={cellIdx}
                    isWhite={(colsIdx + cellIdx) % 2}
                    isPossibleMove={isPossibleMove}
                    onClick={() => {
                      if (selectedPiece) {
                        const move = possibleMoves.filter(
                          (possibleMove) =>
                            possibleMove.x === cellIdx &&
                            possibleMove.y === colsIdx
                        );
                        if (move.length === 1)
                          setPieces((oldPices) => {
                            let newPieces = [...oldPices];
                            newPieces[colsIdx][cellIdx] = selectedPiece.piece;
                            newPieces[selectedPiece.y][selectedPiece.x] = null;

                            return newPieces;
                          });
                        setSelectedPiece(null);
                        setPossibleMoves([]);
                      }
                      if (!selectedPiece && cell) {
                        setSelectedPiece({
                          x: cellIdx,
                          y: colsIdx,
                          piece: pieces[colsIdx][cellIdx],
                        });
                        setPossibleMoves(
                          cell.returnPossibleMoves({
                            board: pieces,
                            x: cellIdx,
                            y: colsIdx,
                          })
                        );
                      }
                    }}
                  >
                    {cell ? cell?.region + cell?.type : ""}
                  </Cell>
                );
              })}
            </RowWrapper>
          );
        })}
      </Board>
    </Container>
  );
}

export default App;

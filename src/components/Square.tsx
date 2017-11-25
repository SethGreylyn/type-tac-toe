import * as React from 'react';
import { Square } from '../types/GameTypes';

interface SquareProps {
    value: Square;
    onClick: () => void;
}

export function Square(props: SquareProps) {
      return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
      );
    }
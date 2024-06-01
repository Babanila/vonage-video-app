import React from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonPropss,
} from '@mui/material';

// Only include variant, size, and color
type ButtonBaseProps = Pick<MuiButtonPropss, 'variant' | 'size' | 'color'>;

// Use all except disableRipple
// type ButtonBaseProps = Omit<MuiButtonProps, "disableRipple">;

export interface ButtonProps extends ButtonBaseProps {
  label: string;
}

export const Button = ({ label, ...rest }: ButtonProps) => (
  <MuiButton {...rest}>{label}</MuiButton>
);

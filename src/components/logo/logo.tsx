import { forwardRef } from 'react';
import Link from '@mui/material/Link';
import Box, { BoxProps } from '@mui/material/Box';
import { RouterLink } from 'src/routes/components';

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    return (
      <Link component={RouterLink} href="/" onClick={(e) => e.preventDefault()}>
        <Box
          component="img"
          src="/logo/gfsaLogoB.png" 
          sx={{
            cursor: 'pointer',
            height: 100, 
            ...sx,
          }}
        />
      </Link>
    );
  }
);

export default Logo;

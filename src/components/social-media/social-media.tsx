import React from 'react';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton'; // Import IconButton
import YouTubeIcon from '@mui/icons-material/YouTube';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

const SocialMediaLinks = () => {
  return (
    <Stack direction="row" spacing={2}>
      {[
        { href: "https://www.youtube.com/@user-dr2yw1sb2w", title: "YouTube", Icon: YouTubeIcon },
        { href: "https://twitter.com/GFSA_KSA", title: "Twitter", Icon: TwitterIcon },
        // { href: "", title: "Facebook", Icon: FacebookIcon },
      ].map((social) => (
        <Link key={social.title} href={social.href} title={social.title} target="_blank" rel="noopener" sx={{ textDecoration: 'none' }}>
          <IconButton
            sx={{
              color: 'white', // Icon color
              backgroundColor: 'transparent',
              borderRadius: '50%', // Circular shape
              border: '2px solid white', // White circle around the icon
              '&:hover': {
                transform: 'scale(1.1)', // Zoom-in effect on hover
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slight background color on hover for better visibility
              },
              transition: 'transform 0.3s ease-in-out', // Smooth transition for zoom-in effect
            }}
          >
            <social.Icon />
          </IconButton>
        </Link>
      ))}
    </Stack>
  );
};

export default SocialMediaLinks;

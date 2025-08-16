import Box from '@mui/material/Box';

export default function RotatingBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        width: 200,
        height: 200,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1, // Ensure it stays behind other elements
        animation: 'rotate 30s linear infinite',
        '@keyframes rotate': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="-25 -25 250 250">
        <defs>
          <radialGradient id="rgrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style={{ stopColor: '#02b65f', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#018e5f', stopOpacity: 1 }} />
          </radialGradient>
        </defs>
        <path
          d="M35.76373715052806 23.359915611127164 C0.7942634853854358 56.905071311743505 71.87305173185212 191.00003405943266 119.82006113993837 198.01614752891027 C149.05183647417738 202.29365002992566 204.44827284421015 139.7951347945799 199.42786446707007 110.68174927237791 C191.5470299907105 64.98073152417291 69.23067090787659 -8.743899117760925 35.76373715052806 23.359915611127164Z"
          stroke="none"
          fill="url(#rgrad)"
        />
      </svg>
    </Box>
  );
}

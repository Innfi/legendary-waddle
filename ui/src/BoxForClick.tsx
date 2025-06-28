import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useGetApi } from './facility/axios.base';
import { useEffect } from 'react';

export default function BoxForClick() {
  const navigate = useNavigate();

  const { isFetched, data } = useGetApi('/users');
  useEffect(() => {
    if (isFetched === false) return;

    console.log('isFetched');
    console.log(`data: ${JSON.stringify(data)}`);
  }, [isFetched]);

  const handleClick = () => {
    console.log('handleClick');
    navigate({ pathname: '/users' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button variant='contained' onClick={() => handleClick()}>
        test button
      </Button>
    </Box>
  );
}
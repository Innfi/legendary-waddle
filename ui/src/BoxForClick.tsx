import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useGetApi, usePostApi } from './facility/axios.base';
import { useEffect } from 'react';

export default function BoxForClick() {
  const navigate = useNavigate();

  const { isFetched, data } = useGetApi('/users');
  useEffect(() => {
    if (!isFetched) return;

    console.log('isFetched');
    console.log(`data: ${JSON.stringify(data)}`);
  }, [isFetched]);

  const { mutate, isSuccess } = usePostApi<{ id: number; name: string }>('/users');
  useEffect(() => {
    if (isSuccess) console.log('post success');
  }, [isSuccess]);

  const handleClick = () => {
    console.log('handleClick');
    navigate({ pathname: '/users' });
  };

  return (
    <Box sx={{ flexDirection: 'column', gap: 2, padding: 20 }}>
      <Button variant='contained' onClick={() => handleClick()}>
        test button
      </Button>
      <Button variant='contained' onClick={() => mutate({ id: 999, name: 'milli'})}>
        post button
      </Button>
    </Box>
  );
}
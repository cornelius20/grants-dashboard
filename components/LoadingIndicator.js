import React from 'react';
import ReactLoading from 'react-loading';


export default function LoadingIndicator({ size }) {
  return (
    <ReactLoading type={'spin'} color={'#fff'} height={size == 'small' ? 20 : size == 'medium' ? 40 : 60} width={size == 'small' ? 20 : size == 'medium' ? 40 : 60} />
  )
}

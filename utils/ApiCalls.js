import axios from 'axios';

export const Login = async (params) => {
    try {
        var data = JSON.stringify(params);
        
        var config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://stacks-grant-backend.herokuapp.com/api/v1/user',
          headers: { 
            'Content-Type': 'application/json'
          },
          data: data
        };
        
        return axios(config).then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (err) {
        return false;
    }
}